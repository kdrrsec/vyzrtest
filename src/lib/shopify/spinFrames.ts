/**
 * Product metafield (Storefront API): `custom.product_spin_frames`
 * Type: JSON — array of strings, each a full image URL (order = rotation sequence).
 * Minimum 2 URLs for the turntable to activate.
 */
export function parseProductSpinFrames(
  metafieldNodes: Array<{ key: string; value: string } | null | undefined>
): string[] | null {
  const byKey = new Map<string, string>();
  for (const m of metafieldNodes) {
    if (m?.key && typeof m.value === "string") byKey.set(m.key, m.value);
  }
  const raw = byKey.get("product_spin_frames")?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const urls = parsed
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      .map((s) => s.trim());
    return urls.length >= 2 ? urls : null;
  } catch {
    return null;
  }
}
