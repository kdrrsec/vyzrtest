import { Agent } from "undici";

/**
 * Local dev on Windows sometimes fails Shopify HTTPS with UNABLE_TO_VERIFY_LEAF_SIGNATURE
 * (antivirus / corporate TLS inspection). Set SHOPIFY_DEV_INSECURE_TLS=1 in .env.local only.
 * Never enable in production.
 */
export function shopifyFetchInit(): RequestInit {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.SHOPIFY_DEV_INSECURE_TLS?.trim() !== "1"
  ) {
    return {};
  }

  return {
    // Node fetch (undici) — not in DOM RequestInit types
    dispatcher: new Agent({ connect: { rejectUnauthorized: false } }),
  } as RequestInit;
}
