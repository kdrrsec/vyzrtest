import type { CustomizerSetupId, SingleSide, SlotUploads, VisorSlotId } from "@/lib/customizerSetup";
import { slotsForSetup } from "@/lib/customizerSetup";

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
}

export async function uploadDesignDataUrl(
  dataUrl: string,
  slot: VisorSlotId,
  setup: CustomizerSetupId
): Promise<string> {
  const file = await dataUrlToFile(dataUrl, `${slot}-design`);
  const form = new FormData();
  form.set("file", file);
  form.set("slot", slot);
  form.set("setup", setup);

  const res = await fetch("/api/design-upload", { method: "POST", body: form });
  const raw = await res.text();
  let json: { url?: string; error?: string } = {};
  try {
    json = JSON.parse(raw) as { url?: string; error?: string };
  } catch {
    throw new Error(
      res.ok
        ? "Upload failed (invalid server response)."
        : "Design upload is unavailable. Check that BLOB_READ_WRITE_TOKEN is set in .env.local and restart the dev server."
    );
  }
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? "Upload failed.");
  }
  return json.url;
}

/** Upload each slot design and return public URLs (for Shopify line attributes). */
export async function uploadDesignsForCart(
  setup: CustomizerSetupId,
  uploads: SlotUploads,
  singleSide: SingleSide = "left"
): Promise<Record<VisorSlotId, string>> {
  const slots = slotsForSetup(setup, singleSide);
  const urls = {} as Record<VisorSlotId, string>;

  for (const slot of slots) {
    const dataUrl = uploads[slot];
    if (!dataUrl?.trim()) {
      throw new Error(`Missing design for ${slot}.`);
    }
    urls[slot] = await uploadDesignDataUrl(dataUrl, slot, setup);
  }

  return urls;
}
