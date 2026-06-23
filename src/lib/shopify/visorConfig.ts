import type { ShopifyImage, VisorConfigMode, VisorProductConfig } from "./types";

/**
 * Product metafields (expose to Storefront API in Shopify Admin → Settings → Custom data → Products):
 * - `custom.visor_config_mode` or `custom.visor_modus` (single line): `standard` → fixed design + helmet note at checkout. Omit / other → custom upload UI.
 * - `custom.visor_preview_texture_url` or `custom.preview_gravure_url` (URL, optional): 3D preview when mode is standard.
 *   If empty, `featuredImage.url` is used for standard products.
 * - `custom.product_spin_frames` (JSON array of image URL strings): drag-to-rotate turntable when ≥2 URLs (see `spinFrames.ts`).
 */
export function buildVisorProductConfig(
  metafieldNodes: Array<{ key: string; value: string } | null | undefined>,
  featuredImage: ShopifyImage
): VisorProductConfig {
  const byKey = new Map<string, string>();
  for (const m of metafieldNodes) {
    if (m?.key && typeof m.value === "string") byKey.set(m.key, m.value);
  }

  const rawMode =
    (byKey.get("visor_config_mode") ?? byKey.get("visor_modus"))?.trim().toLowerCase() ??
    "";
  const mode: VisorConfigMode = rawMode === "standard" ? "standard" : "custom_upload";

  const metaPreview =
    byKey.get("visor_preview_texture_url")?.trim() ||
    byKey.get("preview_gravure_url")?.trim();
  const featuredUrl = featuredImage?.url?.trim() || null;

  const standardPreviewUrl =
    mode === "standard" ? metaPreview || featuredUrl || null : null;

  return { mode, standardPreviewUrl };
}
