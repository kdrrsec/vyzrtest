"use server";

import { cookies } from "next/headers";
import { getShopifyConfig } from "@/lib/shopify/config";
import {
  addLinesToExistingCart,
  applyCartDiscountCode,
  createCartWithLinesReturnMeta,
  getCartById,
  removeCartLinesByIds,
  setCartLineQuantityShopify,
  type CartCreateLine,
  type CartView,
} from "@/lib/shopify/storefront";
import { vyzrSuppliesDiscountCode } from "@/lib/visorFulfillment";

const COOKIE = "vyzr_cart_id";

function appendDropoffReturn(checkoutUrl: string): string {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      "https://vyzrtest.vercel.app";
    const returnTo = `${siteUrl}/thank-you?dropoff=1`;
    const url = new URL(checkoutUrl);
    url.searchParams.set("return_to", returnTo);
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}
const COOKIE_MAX_AGE = 60 * 60 * 24 * 60;

async function setCartCookie(cartId: string) {
  const jar = await cookies();
  jar.set(COOKIE, cartId, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

async function clearCartCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

async function resolveCartId(cartIdHint?: string | null): Promise<string | null> {
  const jar = await cookies();
  const fromCookie = jar.get(COOKIE)?.value?.trim();
  const hint = cartIdHint?.trim();
  if (fromCookie) return fromCookie;
  if (hint) return hint;
  return null;
}

/** When the cookie is missing but the client has a cart id from the last mutation, re-attach the cookie. */
async function healCartCookie(cartId: string): Promise<void> {
  const jar = await cookies();
  if (!jar.get(COOKIE)?.value) {
    await setCartCookie(cartId);
  }
}

export async function getCartDrawerState(cartIdHint?: string | null): Promise<
  { ok: true; cart: CartView } | { ok: false; reason: "no_shopify" | "empty" }
> {
  if (!getShopifyConfig()) {
    return { ok: false, reason: "no_shopify" };
  }
  const id = await resolveCartId(cartIdHint);
  if (!id) return { ok: false, reason: "empty" };

  const cart = await getCartById(id);
  if (!cart) {
    await clearCartCookie();
    return { ok: false, reason: "empty" };
  }
  await healCartCookie(cart.id);
  return { ok: true, cart };
}

export async function getCartItemCount(cartIdHint?: string | null): Promise<number> {
  const state = await getCartDrawerState(cartIdHint);
  if (!state.ok) return 0;
  return state.cart.totalQuantity;
}

/** Reliable count after add-to-bag: uses cart id directly (no cookie timing). */
export async function fetchCartTotalForCartId(cartId: string): Promise<number> {
  if (!getShopifyConfig() || !cartId?.trim()) return 0;
  const cart = await getCartById(cartId.trim());
  if (!cart) return 0;
  await healCartCookie(cart.id);
  return cart.totalQuantity;
}

export async function updateCartLineQuantity(
  lineId: string,
  nextQuantity: number,
  cartIdHint?: string | null
): Promise<{ totalQuantity: number }> {
  if (!getShopifyConfig()) {
    throw new Error("Shopify is not configured.");
  }
  const id = await resolveCartId(cartIdHint);
  if (!id) {
    throw new Error("No cart.");
  }
  await setCartLineQuantityShopify(id, lineId, nextQuantity);
  await healCartCookie(id);
  const cart = await getCartById(id);
  if (!cart) {
    await clearCartCookie();
    return { totalQuantity: 0 };
  }
  return { totalQuantity: cart.totalQuantity };
}

export async function clearShopifyCart(cartIdHint?: string | null): Promise<void> {
  if (!getShopifyConfig()) {
    throw new Error("Shopify is not configured.");
  }
  const id = await resolveCartId(cartIdHint);
  if (!id) {
    await clearCartCookie();
    return;
  }
  const cart = await getCartById(id);
  if (!cart) {
    await clearCartCookie();
    return;
  }
  const lineIds = cart.lines.map((l) => l.id);
  if (lineIds.length > 0) {
    await removeCartLinesByIds(cart.id, lineIds);
  }
  await clearCartCookie();
}

function addedLinesQty(lines: CartCreateLine[]): number {
  return lines.reduce((s, l) => s + (l.quantity ?? 0), 0);
}

type AddLinesOptions = {
  applyVyzrSuppliesDiscount?: boolean;
  /** When true, appends ?return_to=/book-dropoff to the checkout URL so
   *  Shopify redirects the customer to the booking page after payment. */
  isDropoff?: boolean;
};

export async function addLinesToCart(
  lines: CartCreateLine[],
  opts: AddLinesOptions = {}
): Promise<{
  totalQuantity: number;
  checkoutUrl: string;
  cartId: string;
}> {
  if (!getShopifyConfig()) {
    throw new Error("Shopify is not configured.");
  }

  const jar = await cookies();
  let cartId = jar.get(COOKIE)?.value;
  const addQty = addedLinesQty(lines);

  async function maybeApplyDiscount(id: string, checkoutUrl: string) {
    if (!opts.applyVyzrSuppliesDiscount) return checkoutUrl;
    const code = vyzrSuppliesDiscountCode();
    if (!code) return checkoutUrl;
    try {
      const updated = await applyCartDiscountCode(id, code);
      return updated.checkoutUrl;
    } catch {
      return checkoutUrl;
    }
  }

  if (cartId) {
    const existing = await getCartById(cartId);
    if (existing) {
      const prevQty = existing.totalQuantity;
      const { cart } = await addLinesToExistingCart(cartId, lines);
      await setCartCookie(cart.id);
      let checkoutUrl = await maybeApplyDiscount(cart.id, cart.checkoutUrl);
      if (opts.isDropoff) checkoutUrl = appendDropoffReturn(checkoutUrl);
      const totalQuantity = Math.max(cart.totalQuantity, prevQty + addQty);
      return {
        totalQuantity,
        checkoutUrl,
        cartId: cart.id,
      };
    }
    await clearCartCookie();
    cartId = undefined;
  }

  const created = await createCartWithLinesReturnMeta(lines);
  await setCartCookie(created.id);
  let checkoutUrl = await maybeApplyDiscount(created.id, created.checkoutUrl);
  if (opts.isDropoff) checkoutUrl = appendDropoffReturn(checkoutUrl);
  const totalQuantity = Math.max(created.totalQuantity, addQty);
  return {
    totalQuantity,
    checkoutUrl,
    cartId: created.id,
  };
}
