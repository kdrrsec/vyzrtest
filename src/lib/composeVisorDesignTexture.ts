import type { CustomizerSetupId, SlotUploads } from "@/lib/customizerSetup";
import { slotsForSetup } from "@/lib/customizerSetup";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  pad: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const innerW = Math.max(1, dw - pad * 2);
  const innerH = Math.max(1, dh - pad * 2);
  const scale = Math.min(innerW / iw, innerH / ih);
  const rw = iw * scale;
  const rh = ih * scale;
  const x = dx + (dw - rw) / 2;
  const y = dy + (dh - rh) / 2;
  ctx.drawImage(img, x, y, rw, rh);
}

/**
 * One atlas for the visor decal: layout matches `slotsForSetup` bands along U.
 * Tune slot bounds in Blender to match this atlas when the GLB is ready.
 */
export async function composeVisorDesignToDataUrl(
  setup: CustomizerSetupId,
  uploads: SlotUploads
): Promise<string | null> {
  const slots = slotsForSetup(setup);
  if (!slots.some((s) => uploads[s])) return null;

  const w = 2048;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#070707";
  ctx.fillRect(0, 0, w, h);

  const pad = 10;

  const paintEmpty = (x0: number, x1: number) => {
    const sx = x0 * w;
    const sw = (x1 - x0) * w;
    ctx.fillStyle = "#101010";
    ctx.fillRect(sx, 0, sw, h);
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.strokeRect(sx + 0.5, 0.5, sw - 1, h - 1);
  };

  const paintImage = async (x0: number, x1: number, dataUrl: string | null) => {
    const sx = x0 * w;
    const sw = (x1 - x0) * w;
    if (!dataUrl) {
      paintEmpty(x0, x1);
      return;
    }
    try {
      const img = await loadImage(dataUrl);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(sx, 0, sw, h);
      drawContain(ctx, img, sx, 0, sw, h, pad);
    } catch {
      paintEmpty(x0, x1);
    }
  };

  if (setup === "single") {
    // Use whichever side has an upload (left or right)
    await paintImage(0, 1, uploads.left ?? uploads.right);
  } else if (setup === "double") {
    await paintImage(0, 0.5, uploads.left);
    await paintImage(0.5, 1, uploads.right);
  } else {
    await paintImage(0, 1 / 3, uploads.left);
    await paintImage(1 / 3, 2 / 3, uploads.top);
    await paintImage(2 / 3, 1, uploads.right);
  }

  return canvas.toDataURL("image/png");
}
