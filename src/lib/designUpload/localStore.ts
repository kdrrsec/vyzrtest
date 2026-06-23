import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { DESIGN_UPLOAD_EXT } from "./constants";

const UPLOAD_DIR = path.join(process.cwd(), "public", ".local-uploads");

export function localDesignUploadEnabled(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return false;
  if (process.env.NODE_ENV !== "development") return false;
  return process.env.DESIGN_UPLOAD_LOCAL?.trim() !== "0";
}

export async function storeDesignFileLocally(
  bytes: Buffer,
  contentType: string,
  meta: { setup: string; slot: string },
  baseUrl: string
): Promise<string> {
  const ext = DESIGN_UPLOAD_EXT[contentType.toLowerCase()] ?? "bin";
  const id = randomBytes(8).toString("hex");
  const rel = `vyzr-designs/${meta.setup}/${meta.slot}/${Date.now()}-${id}.${ext}`;
  const abs = path.join(UPLOAD_DIR, rel);

  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, bytes);

  const origin = baseUrl.replace(/\/$/, "");
  return `${origin}/.local-uploads/${rel}`;
}
