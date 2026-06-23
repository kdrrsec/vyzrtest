/** Static example images in `/public/placeholders` for empty Shopify slots and UI mockups. */
export const PLACEHOLDER = {
  product1: "/placeholders/product-1.svg",
  product2: "/placeholders/product-2.svg",
  product3: "/placeholders/product-3.svg",
  /** Real photo in `/public` so `next/image` always renders (SVG hero looked empty in some builds). */
  hero: "/hero-photo.png",
  before: "/placeholders/before.svg",
  after: "/placeholders/after.svg",
  thumb: "/placeholders/thumb.svg",
} as const;
