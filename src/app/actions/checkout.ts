"use server";

import { createCartCheckout, type CartCreateLine } from "@/lib/shopify/storefront";

export async function startShopifyCheckout(lines: CartCreateLine[]) {
  const url = await createCartCheckout(lines);
  return { checkoutUrl: url as string };
}
