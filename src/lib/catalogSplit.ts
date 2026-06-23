import { DEFAULT_HANDLE } from "@/lib/routes";
import type { CatalogProduct } from "@/lib/shopify/storefront";

/**
 * When true (default), custom-upload products stay out of /shop and are linked via
 * homepage CTAs + nav. Set `NEXT_PUBLIC_SEPARATE_CUSTOM_VISOR=0` to revert.
 */
export function separateCustomFromShop(): boolean {
  const raw = process.env.NEXT_PUBLIC_SEPARATE_CUSTOM_VISOR?.trim().toLowerCase();
  if (raw === "0" || raw === "false" || raw === "off") return false;
  return true;
}

export function getCustomVisorHandle(): string {
  return DEFAULT_HANDLE;
}

export function customVisorPath(withCustomizerAnchor = false): string {
  const base = `/product/${getCustomVisorHandle()}`;
  return withCustomizerAnchor ? `${base}#customizer-section` : base;
}

/** Keep only fixed designs in shop / featured grids when split mode is on. */
export function filterCatalogForShop(products: CatalogProduct[]): CatalogProduct[] {
  if (!separateCustomFromShop()) return products;
  const customHandle = getCustomVisorHandle();
  return products.filter((p) => p.handle !== customHandle);
}
