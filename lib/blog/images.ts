import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isSupabaseConfigured, supabaseProjectUrl } from "./config";

const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "blog-images";

const imageTypes: Record<string, { ext: string; matches: (bytes: Uint8Array) => boolean }> = {
  "image/jpeg": {
    ext: "jpg",
    matches: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  "image/png": {
    ext: "png",
    matches: (bytes) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
  },
  "image/gif": {
    ext: "gif",
    matches: (bytes) => bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46,
  },
  "image/webp": {
    ext: "webp",
    matches: (bytes) =>
      bytes.length > 12 &&
      ascii(bytes, 0, 4) === "RIFF" &&
      ascii(bytes, 8, 12) === "WEBP",
  },
};

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}

export function blogImageLimitLabel() {
  return "5 MB";
}

function detectImage(bytes: Uint8Array) {
  return Object.entries(imageTypes).find(([, kind]) => kind.matches(bytes)) || null;
}

function isHeic(bytes: Uint8Array) {
  if (bytes.length < 12 || ascii(bytes, 4, 8) !== "ftyp") return false;
  const brand = ascii(bytes, 8, 12).toLowerCase();
  return ["heic", "heix", "hevc", "hevx", "mif1", "msf1", "heim", "heis"].includes(brand);
}

export async function storeImageBytes(bytes: Uint8Array) {
  if (bytes.length === 0) throw new Error("That file is empty.");
  if (bytes.length > MAX_BYTES) throw new Error(`Images must be ${blogImageLimitLabel()} or smaller.`);
  const detected = detectImage(bytes);
  if (!detected) {
    if (isHeic(bytes)) throw new Error("This photo is HEIC. Export it as a JPG and try again.");
    throw new Error("Use a JPG, PNG, WebP, or GIF.");
  }
  const [contentType, kind] = detected;
  const now = new Date();
  const objectPath = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${kind.ext}`;
  if (!isSupabaseConfigured()) return writeLocalImage(bytes, objectPath);
  return uploadSupabaseImage(bytes, contentType, objectPath);
}

export async function storeBlogImage(file: Blob) {
  if (file.size <= 0) throw new Error("That file is empty.");
  if (file.size > MAX_BYTES) throw new Error(`Images must be ${blogImageLimitLabel()} or smaller.`);
  return storeImageBytes(new Uint8Array(await file.arrayBuffer()));
}

async function writeLocalImage(bytes: Uint8Array, objectPath: string) {
  const destination = path.join(process.cwd(), "public", BUCKET, objectPath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return `/${BUCKET}/${objectPath}`;
}

async function uploadSupabaseImage(bytes: Uint8Array, contentType: string, objectPath: string) {
  let response = await putSupabaseObject(bytes, contentType, objectPath);
  if (response.status === 404 || (await response.clone().text()).toLowerCase().includes("bucket")) {
    await ensureBlogImageBucket();
    response = await putSupabaseObject(bytes, contentType, objectPath);
  }
  if (!response.ok) throw new Error("Image upload failed. Try again.");
  return `${supabaseProjectUrl()}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

function storageHeaders(contentType?: string) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...(contentType ? { "Content-Type": contentType, "cache-control": "public, max-age=31536000" } : {}),
  };
}

function putSupabaseObject(bytes: Uint8Array, contentType: string, objectPath: string) {
  return fetch(`${supabaseProjectUrl()}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: storageHeaders(contentType),
    body: Buffer.from(bytes),
  });
}

async function ensureBlogImageBucket() {
  const response = await fetch(`${supabaseProjectUrl()}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...storageHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: MAX_BYTES,
      allowed_mime_types: Object.keys(imageTypes),
    }),
  });
  if (response.ok || response.status === 409) return;
  const detail = (await response.text()).toLowerCase();
  if (detail.includes("already exists") || detail.includes("duplicate")) return;
  throw new Error("Image storage is not ready.");
}
