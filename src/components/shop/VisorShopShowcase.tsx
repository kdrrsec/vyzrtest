import type { CatalogProduct } from "@/lib/shopify/storefront";
import { VisorShopShowcaseClient } from "./VisorShopShowcaseClient";

type Props = {
  products: CatalogProduct[];
  locale: string;
};

/**
 * Collection layout inspired by editorial product grids (e.g. large packshots, snap scroll on mobile).
 * Each card uses a visor-shaped mask so designs read as “on the visor” when photos are shot/mockup’d that way.
 * Deep link: `/shop/visors#<product-handle>` scrolls to a card (Shopify handle).
 */
export function VisorShopShowcase({ products, locale }: Props) {
  return <VisorShopShowcaseClient products={products} locale={locale} />;
}
