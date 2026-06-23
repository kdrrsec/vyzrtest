const DEFAULT_HANDLE =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_HANDLE ?? "your-own-designed-visor";

/**
 * App paths without locale prefix.
 * Use with `Link` from `@/i18n/navigation` so `/en/...` is applied when needed.
 */
export const PATHS = {
  home: "/",
  shopVisors: "/shop/visors",
  howItWorks: "/how-it-works",
  faq: "/faq",
  contact: "/contact",
  legal: "/legal",
  comingSoon: "/coming-soon",
  product: (handle: string) => `/product/${handle}`,
  /** Custom upload product (see `catalogSplit.ts` + `NEXT_PUBLIC_DEFAULT_PRODUCT_HANDLE`). */
  customVisor: `/product/${DEFAULT_HANDLE}`,
} as const;

/** @deprecated Use PATHS.shopVisors with i18n Link */
export function shopVisorsPath() {
  return PATHS.shopVisors;
}

/** @deprecated Use PATHS.product(handle) with i18n Link */
export function productPath(handle: string = DEFAULT_HANDLE) {
  return PATHS.product(handle);
}

export { DEFAULT_HANDLE };
