import { getDemoSpinFrames } from "@/lib/demoSpinFrames";
import { PLACEHOLDER } from "@/lib/placeholders";
import type { ShopifyProduct } from "@/lib/shopify/types";

/** Offline / misconfigured env fallback so UI stays reviewable without Shopify. */
export const DEMO_PRODUCT: ShopifyProduct = {
  id: "gid://shopify/Product/0",
  title: "Custom Visor Engraving (send-in)",
  handle: "your-own-designed-visor",
  description:
    "Send in your own visor; we laser-engrave your chosen design and return it. Configure here, then checkout on Shopify when connected.",
  featuredImage: {
    url: PLACEHOLDER.product1,
    altText: "Example visor product",
    width: 800,
    height: 600,
  },
  spinFrames: getDemoSpinFrames(),
  priceRange: {
    minVariantPrice: { amount: "49", currencyCode: "EUR" },
  },
  variants: [
    {
      id: "gid://shopify/ProductVariant/single",
      title: "Single side",
      sku: "VISOR-SINGLE",
      availableForSale: true,
      selectedOptions: [{ name: "Setup", value: "Single side" }],
      price: { amount: "49", currencyCode: "EUR" },
    },
    {
      id: "gid://shopify/ProductVariant/double",
      title: "Double side",
      sku: "VISOR-DOUBLE",
      availableForSale: true,
      selectedOptions: [{ name: "Setup", value: "Double side" }],
      price: { amount: "89", currencyCode: "EUR" },
    },
    {
      id: "gid://shopify/ProductVariant/full",
      title: "Full customization",
      sku: "VISOR-FULL",
      availableForSale: true,
      selectedOptions: [{ name: "Setup", value: "Full customization" }],
      price: { amount: "149", currencyCode: "EUR" },
    },
  ],
  visor: {
    mode: "custom_upload",
    standardPreviewUrl: null,
  },
};

/** Fixed design product (shop card → info + helmet/visor picker). */
export const DEMO_DESIGN_PRODUCT: ShopifyProduct = {
  id: "gid://shopify/Product/1",
  title: "Thorns and Roses Visor",
  handle: "thorns-and-roses-visor",
  description: `<p>Chrome visor included, unless you choose to send in your own visor. Tell us which helmet and visor you have before adding to cart.</p>
<ul>
<li>Right side and left side have the rose design.</li>
<li>Thorns wrap around whole visor</li>
</ul>
<p><strong>FOR DISPLAY AND OFF-ROAD USE ONLY</strong></p>`,
  featuredImage: {
    url: PLACEHOLDER.product2,
    altText: "Thorns and Roses visor design",
    width: 800,
    height: 600,
  },
  spinFrames: null,
  priceRange: {
    minVariantPrice: { amount: "89", currencyCode: "EUR" },
  },
  variants: [
    {
      id: "gid://shopify/ProductVariant/thorns-default",
      title: "Default Title",
      sku: "THORNS-DESIGN",
      availableForSale: true,
      selectedOptions: [{ name: "Title", value: "Default Title" }],
      price: { amount: "89", currencyCode: "EUR" },
    },
  ],
  visor: {
    mode: "standard",
    standardPreviewUrl: PLACEHOLDER.product2,
  },
};

const DEMO_BY_HANDLE: Record<string, ShopifyProduct> = {
  [DEMO_PRODUCT.handle]: DEMO_PRODUCT,
  [DEMO_DESIGN_PRODUCT.handle]: DEMO_DESIGN_PRODUCT,
};

export function getDemoProductByHandle(handle: string): ShopifyProduct | null {
  return DEMO_BY_HANDLE[handle] ?? null;
}
