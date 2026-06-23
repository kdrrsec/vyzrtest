import type { CustomizerSetupId } from "@/lib/customizerSetup";
import { SETUP_PRICES_EUR } from "@/lib/customizerSetup";
import type { ProductVariant } from "@/lib/shopify/types";

const SKU_MARKERS: Record<CustomizerSetupId, string[]> = {
  single: ["SINGLE", "1SIDE", "ONE-SIDE"],
  double: ["DOUBLE", "2SIDE", "TWO-SIDE"],
  full: ["FULL", "3SIDE", "TRIPLE"],
};

const TITLE_OR_OPTION_KEYWORDS: Record<CustomizerSetupId, string[]> = {
  single: ["single", "een kant", "one side", "1-side", "één"],
  double: ["double", "dubbel", "twee", "two side", "2-side"],
  full: ["full", "volledig", "complete", "triple"],
};

function matchSetupInPool(
  pool: ProductVariant[],
  setup: CustomizerSetupId
): ProductVariant | null {
  const skuUpper = (sku: string | null | undefined) => (sku ?? "").toUpperCase();
  for (const marker of SKU_MARKERS[setup]) {
    const hit = pool.find((v) => skuUpper(v.sku).includes(marker));
    if (hit) return hit;
  }

  const keywords = TITLE_OR_OPTION_KEYWORDS[setup];
  const textMatches = (text: string) => {
    const t = text.trim().toLowerCase();
    return keywords.some((k) => t.includes(k));
  };

  for (const v of pool) {
    for (const opt of v.selectedOptions ?? []) {
      if (textMatches(opt.value) || textMatches(`${opt.name} ${opt.value}`)) {
        return v;
      }
    }
  }

  for (const v of pool) {
    if (textMatches(v.title)) return v;
  }

  const target = SETUP_PRICES_EUR[setup];
  return (
    pool.find((v) => {
      if (v.price.currencyCode !== "EUR") return false;
      const n = Number.parseFloat(v.price.amount);
      return !Number.isNaN(n) && Math.abs(n - target) < 0.005;
    }) ?? null
  );
}

/**
 * Picks the Shopify variant to add for a visor customizer setup.
 *
 * Shopify is the source of truth for money: each matched variant must have the
 * correct price in Admin. Order of matching: SKU markers → option values →
 * variant title → exact EUR amount ({@link SETUP_PRICES_EUR}).
 *
 * Matching runs on **available** variants first, then on **all** variants so
 * the correct row is still found if Shopify marks some variants unavailable
 * while prices are configured (fix in Admin: enable sales on each variant).
 */
export function pickVariantForCustomizerSetup(
  variants: ProductVariant[],
  setup: CustomizerSetupId | null
): ProductVariant | null {
  if (!variants.length) return null;

  const available = variants.filter((v) => v.availableForSale);
  if (!setup) {
    return available[0] ?? variants[0] ?? null;
  }

  const fromAvailable = matchSetupInPool(available, setup);
  if (fromAvailable) return fromAvailable;

  const fromAll = matchSetupInPool(variants, setup);
  if (fromAll) return fromAll;

  return available[0] ?? variants[0] ?? null;
}
