const SAFE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 900 * 1024;

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close?: () => void;
}

interface EncodeAttempt {
  edge: number;
  quality: number;
}

const encodeAttempts: EncodeAttempt[] = [
  { edge: 1920, quality: 0.82 },
  { edge: 1600, quality: 0.72 },
  { edge: 1280, quality: 0.62 },
];

function canSendAsIs(file: File) {
  return SAFE_TYPES.has(file.type) && file.size > 0 && file.size <= MAX_BYTES;
}

function jpegName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-").slice(0, 80);
  return `${base || "photo"}.jpg`;
}

function loadImageElement(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that photo. Try a JPG or PNG."));
    };
    image.src = url;
  });
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      try {
        const bitmap = await createImageBitmap(file);
        return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
      } catch {
        // Fall through to an image element. Some phones only decode HEIC that way.
      }
    }
  }
  const image = await loadImageElement(file);
  if (!image.naturalWidth || !image.naturalHeight) throw new Error("Could not read that photo. Try a JPG or PNG.");
  return { source: image, width: image.naturalWidth, height: image.naturalHeight };
}

function encodeJpeg(decoded: DecodedImage, edge: number, quality: number) {
  const scale = Math.min(1, edge / Math.max(decoded.width, decoded.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(decoded.width * scale));
  canvas.height = Math.max(1, Math.round(decoded.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not read that photo. Try a JPG or PNG.");
  context.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not read that photo. Try a JPG or PNG."));
    }, "image/jpeg", quality);
  });
}

export async function prepareUploadImage(file: File) {
  if (canSendAsIs(file)) return file;
  const decoded = await decodeImage(file);
  try {
    for (const attempt of encodeAttempts) {
      const blob = await encodeJpeg(decoded, attempt.edge, attempt.quality);
      if (blob.size > 0 && blob.size <= MAX_BYTES) return new File([blob], jpegName(file.name), { type: "image/jpeg" });
    }
    throw new Error("That photo is too large. Try a smaller one.");
  } finally {
    decoded.close?.();
  }
}
