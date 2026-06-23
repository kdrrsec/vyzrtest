"use server";

import { getShopifyConfig } from "@/lib/shopify/config";
import { searchProducts as shopifyProductSearch } from "@/lib/shopify/storefront";

export async function runProductSearch(query: string) {
  if (!getShopifyConfig()) return [];
  try {
    return await shopifyProductSearch(query, 8);
  } catch {
    return [];
  }
}
