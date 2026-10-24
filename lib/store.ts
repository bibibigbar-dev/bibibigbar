import { promises as fs } from "fs";
import path from "path";
import { createSeedStore } from "./seed";
import type { AppStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

let writeQueue: Promise<void> = Promise.resolve();
let memoryStore: AppStore | null = null;

function isReadOnlyError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  return code === "EROFS" || code === "EACCES" || code === "EPERM" || code === "ENOENT";
}

async function ensureStoreFile(): Promise<void> {
  if (memoryStore) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(STORE_PATH);
  } catch (error) {
    const seed = createSeedStore();
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    } catch (writeError) {
      if (!isReadOnlyError(writeError) && !isReadOnlyError(error)) throw writeError;
      memoryStore = seed;
    }
  }
}

function normalizeStore(store: AppStore): AppStore {
  return {
    ...store,
    blogPosts: Array.isArray(store.blogPosts) ? store.blogPosts : [],
    blogTopics: Array.isArray(store.blogTopics) ? store.blogTopics : [],
    blogProducts: Array.isArray(store.blogProducts) ? store.blogProducts : [],
  };
}

export async function readStore(): Promise<AppStore> {
  await ensureStoreFile();
  if (memoryStore) return normalizeStore(memoryStore);
  const raw = await fs.readFile(STORE_PATH, "utf8");
  return normalizeStore(JSON.parse(raw) as AppStore);
}

export async function writeStore(store: AppStore): Promise<void> {
  await ensureStoreFile();
  const next = normalizeStore(store);
  if (memoryStore) {
    memoryStore = next;
    return;
  }
  try {
    await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
  } catch (error) {
    if (!isReadOnlyError(error)) throw error;
    memoryStore = next;
  }
}

export async function updateStore(
  updater: (store: AppStore) => AppStore | Promise<AppStore>
): Promise<AppStore> {
  const run = writeQueue.then(async () => {
    const current = await readStore();
    const next = await updater(current);
    await writeStore(next);
    return next;
  });

  writeQueue = run.then(
    () => undefined,
    () => undefined
  );

  return run;
}
