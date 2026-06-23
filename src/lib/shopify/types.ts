export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
} | null;

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  sku: string | null;
  selectedOptions: { name: string; value: string }[];
};

/** Set via Shopify product metafield `custom.visor_config_mode` (Storefront-exposed). */
export type VisorConfigMode = "standard" | "custom_upload";

export type VisorProductConfig = {
  mode: VisorConfigMode;
  /** When `mode === "standard"`: decal source for the 3D preview (metafield or featured image). */
  standardPreviewUrl: string | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: ShopifyImage;
  /** 360° turntable: ≥2 image URLs in order (Shopify metafield `custom.product_spin_frames`). */
  spinFrames: string[] | null;
  priceRange: {
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  visor: VisorProductConfig;
};
