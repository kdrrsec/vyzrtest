export const DESIGN_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export const DESIGN_UPLOAD_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
]);

export const DESIGN_UPLOAD_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/svg+xml": "svg",
};
