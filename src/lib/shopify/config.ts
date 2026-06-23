function firstNonEmptyEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const v = process.env[key];
    if (typeof v === "string") {
      const t = v.trim();
      if (t.length > 0) {
        return t;
      }
    }
  }
  return undefined;
}

/** Strip protocol/trailing slash so `https://shop.myshopify.com/` still works. */
function normalizeStoreDomain(raw: string): string {
  return raw
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .trim();
}

export function getShopifyConfig() {
  const rawDomain = firstNonEmptyEnv([
    "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STORE_DOMAIN",
  ]);
  const storeDomain = rawDomain ? normalizeStoreDomain(rawDomain) : undefined;

  /** Server-only name is preferred; NEXT_PUBLIC is accepted because many Headless setups use a public Storefront token. */
  const storefrontAccessToken = firstNonEmptyEnv([
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ]);

  if (!storeDomain || !storefrontAccessToken) {
    return null;
  }

  return {
    storeDomain,
    storefrontAccessToken,
    endpoint: `https://${storeDomain}/api/2024-10/graphql.json`,
  } as const;
}
