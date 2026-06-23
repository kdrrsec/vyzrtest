import { put } from "@vercel/blob";
import { randomBytes } from "crypto";
import {
  DESIGN_UPLOAD_EXT,
  DESIGN_UPLOAD_MAX_BYTES,
  DESIGN_UPLOAD_MIME,
} from "./constants";
import { localDesignUploadEnabled, storeDesignFileLocally } from "./localStore";

export function isDesignUploadConfigured(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  return localDesignUploadEnabled();
}

export async function storeDesignFile(
  bytes: Buffer,
  contentType: string,
  meta: { setup: string; slot: string },
  opts?: { baseUrl?: string }
): Promise<string> {
  const mime = contentType.toLowerCase();
  if (!DESIGN_UPLOAD_MIME.has(mime)) {
    throw new Error("Unsupported file type. Use PNG, JPG, or SVG.");
  }
  if (bytes.length > DESIGN_UPLOAD_MAX_BYTES) {
    throw new Error("File is too large (max 8 MB).");
  }

  if (localDesignUploadEnabled()) {
    const baseUrl = opts?.baseUrl?.trim() || "http://localhost:3001";
    return storeDesignFileLocally(bytes, mime, meta, baseUrl);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new Error("Design upload is not configured (BLOB_READ_WRITE_TOKEN).");
  }

  const ext = DESIGN_UPLOAD_EXT[mime] ?? "bin";
  const id = randomBytes(8).toString("hex");
  const pathname = `vyzr-designs/${meta.setup}/${meta.slot}/${Date.now()}-${id}.${ext}`;

  const blob = await put(pathname, bytes, {
    access: "public",
    contentType: mime,
    addRandomSuffix: false,
  });

  return blob.url;
}
