import { getShopifyConfig } from "./config";
import { shopifyFetchInit } from "./fetch";
import {
  CART_CREATE,
  CART_CREATE_EMPTY,
  CART_DISCOUNT_CODES_UPDATE,
  CART_GET,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  COLLECTION_BY_HANDLE,
  PRODUCT_BY_HANDLE,
  PRODUCTS_FEATURED,
  PRODUCTS_SEARCH,
} from "./queries";
import type { ShopifyProduct } from "./types";
import { parseProductSpinFrames } from "./spinFrames";
import { buildVisorProductConfig } from "./visorConfig";

type GraphqlResponse<T> = { data?: T; errors?: { message: string }[] };

/** Shopify sometimes returns `totalQuantity` 0 while line quantities are correct. */
export function effectiveCartLineQuantitySum(cart: {
  totalQuantity: number;
  lines?: { nodes: { quantity: number }[] } | null;
}): number {
  const fromApi = cart.totalQuantity ?? 0;
  const nodes = cart.lines?.nodes ?? [];
  const fromLines = nodes.reduce((s, n) => s + (n.quantity ?? 0), 0);
  return Math.max(fromApi, fromLines);
}

type StorefrontFetchOptions = {
  cache?: RequestCache;
  /** Next.js Data Cache revalidation in seconds */
  revalidate?: number;
};

async function storefrontRequest<V>(
  query: string,
  variables?: Record<string, unknown>,
  opts: StorefrontFetchOptions = {}
): Promise<V> {
  const config = getShopifyConfig();
  if (!config) {
    throw new Error("Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.");
  }

  const { cache = "default", revalidate } = opts;

  const res = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    ...shopifyFetchInit(),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront HTTP ${res.status}`);
  }

  const json = (await res.json()) as GraphqlResponse<V>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Empty Shopify response");
  }
  return json.data;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  type R = {
    product: {
      id: string;
      title: string;
      handle: string;
      description: string;
      featuredImage: ShopifyProduct["featuredImage"];
      metafields: ({
        key: string;
        value: string;
      } | null)[];
      priceRange: ShopifyProduct["priceRange"];
      variants: { nodes: ShopifyProduct["variants"] };
    } | null;
  };

  const data = await storefrontRequest<R>(PRODUCT_BY_HANDLE, { handle }, {
    cache: "no-store",
  });

  const p = data.product;
  if (!p) return null;

  const visor = buildVisorProductConfig(p.metafields ?? [], p.featuredImage);
  const spinFrames = parseProductSpinFrames(p.metafields ?? []);

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: p.description,
    featuredImage: p.featuredImage,
    spinFrames,
    priceRange: p.priceRange,
    variants: p.variants.nodes,
    visor,
  };
}

export type CatalogProduct = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

export async function getFeaturedProducts(first = 4) {
  type R = {
    products: {
      nodes: CatalogProduct[];
    };
  };

  const data = await storefrontRequest<R>(PRODUCTS_FEATURED, { first }, {
    revalidate: 60,
  });

  return data.products.nodes;
}

export async function getCatalogProducts(first = 24): Promise<CatalogProduct[]> {
  type R = { products: { nodes: CatalogProduct[] } };
  const data = await storefrontRequest<R>(PRODUCTS_FEATURED, { first }, {
    revalidate: 60,
  });
  return data.products.nodes;
}

/** Visor shop listing: optional Shopify collection (`NEXT_PUBLIC_SHOPIFY_VISORS_COLLECTION_HANDLE`), else all best-selling products. */
export async function getVisorCatalogPage(first = 24): Promise<{
  title: string;
  description: string | null;
  products: CatalogProduct[];
}> {
  const handle =
    typeof process.env.NEXT_PUBLIC_SHOPIFY_VISORS_COLLECTION_HANDLE === "string"
      ? process.env.NEXT_PUBLIC_SHOPIFY_VISORS_COLLECTION_HANDLE.trim()
      : "";

  type CollR = {
    collection: {
      title: string;
      description: string;
      products: { nodes: CatalogProduct[] };
    } | null;
  };

  if (handle) {
    try {
      const data = await storefrontRequest<CollR>(
        COLLECTION_BY_HANDLE,
        { handle, first },
        { revalidate: 60 }
      );
      const c = data.collection;
      if (c?.products.nodes.length) {
        return {
          title: c.title,
          description: c.description || null,
          products: c.products.nodes,
        };
      }
    } catch {
      /* fallback below */
    }
  }

  const products = await getCatalogProducts(first);
  return {
    title: "",
    description: null,
    products,
  };
}

export type CartCreateLine = {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
};

export async function createCartCheckout(lines: CartCreateLine[]): Promise<string> {
  type R = {
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  };

  const data = await storefrontRequest<R>(
    CART_CREATE,
    {
      lines: lines.map((l) => ({
        merchandiseId: l.merchandiseId,
        quantity: l.quantity,
        attributes: l.attributes,
      })),
    },
    { cache: "no-store" }
  );

  const errs = data.cartCreate.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }

  const url = data.cartCreate.cart?.checkoutUrl;
  if (!url) {
    throw new Error("No checkout URL returned");
  }

  return url;
}

export type SearchProductHit = {
  handle: string;
  title: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

export async function searchProducts(query: string, first = 8): Promise<SearchProductHit[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  type R = {
    products: {
      nodes: SearchProductHit[];
    };
  };

  const data = await storefrontRequest<R>(
    PRODUCTS_SEARCH,
    { query: q, first },
    { cache: "no-store" }
  );

  return data.products.nodes;
}

export type CartLineView = {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  selectedOptions: { name: string; value: string }[];
  attributes: { key: string; value: string }[];
  handle: string;
  price: { amount: string; currencyCode: string };
  image: { url: string; altText: string | null } | null;
};

export type CartView = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLineView[];
};

type CartGetResult = {
  cart: {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    lines: {
      nodes: {
        id: string;
        quantity: number;
        attributes: { key: string; value: string }[];
        merchandise: {
          title: string;
          selectedOptions: { name: string; value: string }[];
          price: { amount: string; currencyCode: string };
          product: { title: string; handle: string };
          image: { url: string; altText: string | null } | null;
        } | null;
      }[];
    };
  } | null;
};

function normalizeCartFromQuery(cart: NonNullable<CartGetResult["cart"]>): CartView {
  const lines: CartLineView[] = [];
  for (const n of cart.lines.nodes) {
    const m = n.merchandise;
    if (!m || !("product" in m)) continue;
    lines.push({
      id: n.id,
      quantity: n.quantity,
      title: m.product.title,
      variantTitle: m.title,
      selectedOptions: m.selectedOptions ?? [],
      attributes: n.attributes ?? [],
      handle: m.product.handle,
      price: m.price,
      image: m.image,
    });
  }
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: effectiveCartLineQuantitySum(cart),
    lines,
  };
}

export async function getCartById(cartId: string): Promise<CartView | null> {
  const data = await storefrontRequest<{ cart: CartGetResult["cart"] }>(
    CART_GET,
    { id: cartId },
    { cache: "no-store" }
  );

  if (!data.cart) return null;
  return normalizeCartFromQuery(data.cart);
}

export async function createEmptyCart(): Promise<string> {
  type R = {
    cartCreate: {
      cart: { id: string } | null;
      userErrors: { message: string }[];
    };
  };

  const data = await storefrontRequest<R>(CART_CREATE_EMPTY, undefined, { cache: "no-store" });
  const errs = data.cartCreate.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
  const id = data.cartCreate.cart?.id;
  if (!id) throw new Error("Could not create cart");
  return id;
}

export async function applyCartDiscountCode(
  cartId: string,
  discountCode: string
): Promise<Pick<CartView, "id" | "checkoutUrl">> {
  type R = {
    cartDiscountCodesUpdate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { message: string }[];
    };
  };

  const code = discountCode.trim();
  if (!code) throw new Error("Missing discount code.");

  const data = await storefrontRequest<R>(
    CART_DISCOUNT_CODES_UPDATE,
    { cartId, discountCodes: [code] },
    { cache: "no-store" }
  );

  const errs = data.cartDiscountCodesUpdate.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }

  const cart = data.cartDiscountCodesUpdate.cart;
  if (!cart) throw new Error("Discount could not be applied.");

  return { id: cart.id, checkoutUrl: cart.checkoutUrl };
}

export async function addLinesToExistingCart(
  cartId: string,
  lines: CartCreateLine[]
): Promise<{ cart: Pick<CartView, "id" | "checkoutUrl" | "totalQuantity"> }> {
  type R = {
    cartLinesAdd: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        lines: { nodes: { quantity: number }[] };
      } | null;
      userErrors: { message: string }[];
    };
  };

  const data = await storefrontRequest<R>(
    CART_LINES_ADD,
    {
      cartId,
      lines: lines.map((l) => ({
        merchandiseId: l.merchandiseId,
        quantity: l.quantity,
        attributes: l.attributes,
      })),
    },
    { cache: "no-store" }
  );

  const errs = data.cartLinesAdd.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
  const cart = data.cartLinesAdd.cart;
  if (!cart) throw new Error("Cart update failed");

  const totalQuantity = effectiveCartLineQuantitySum(cart);
  return { cart: { id: cart.id, checkoutUrl: cart.checkoutUrl, totalQuantity } };
}

export async function removeCartLinesByIds(cartId: string, lineIds: string[]): Promise<void> {
  if (lineIds.length === 0) return;

  type R = {
    cartLinesRemove: {
      cart: { id: string; totalQuantity: number } | null;
      userErrors: { message: string }[];
    };
  };

  const data = await storefrontRequest<R>(
    CART_LINES_REMOVE,
    { cartId, lineIds },
    { cache: "no-store" }
  );

  const errs = data.cartLinesRemove.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
}

/** Set line quantity; if `quantity` &lt; 1, the line is removed (Storefront API disallows 0 on update). */
export async function setCartLineQuantityShopify(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<void> {
  if (quantity < 1) {
    await removeCartLinesByIds(cartId, [lineId]);
    return;
  }

  type R = {
    cartLinesUpdate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        lines: { nodes: { quantity: number }[] };
      } | null;
      userErrors: { message: string }[];
    };
  };

  const data = await storefrontRequest<R>(
    CART_LINES_UPDATE,
    { cartId, lines: [{ id: lineId, quantity }] },
    { cache: "no-store" }
  );

  const errs = data.cartLinesUpdate.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
  if (!data.cartLinesUpdate.cart) {
    throw new Error("Cart update failed");
  }
}

export async function createCartWithLinesReturnMeta(lines: CartCreateLine[]): Promise<{
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}> {
  type R = {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        lines: { nodes: { quantity: number }[] };
      } | null;
      userErrors: { message: string }[];
    };
  };

  const data = await storefrontRequest<R>(
    CART_CREATE,
    {
      lines: lines.map((l) => ({
        merchandiseId: l.merchandiseId,
        quantity: l.quantity,
        attributes: l.attributes,
      })),
    },
    { cache: "no-store" }
  );

  const errs = data.cartCreate.userErrors;
  if (errs.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
  const c = data.cartCreate.cart;
  if (!c) throw new Error("No cart returned");
  const totalQuantity = effectiveCartLineQuantitySum(c);
  return { id: c.id, checkoutUrl: c.checkoutUrl, totalQuantity };
}
