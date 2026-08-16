import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Windows dev: antivirus/proxy breaks HTTPS to cdn.shopify.com for `/_next/image`.
 * Pair with SHOPIFY_DEV_INSECURE_TLS=1 in .env.local (dev only — never on Vercel).
 */
if (
  process.env.NODE_ENV === "development" &&
  process.env.SHOPIFY_DEV_INSECURE_TLS?.trim() === "1"
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/**
 * Windows dev: antivirus/proxy breaks HTTPS to cdn.shopify.com for `/_next/image`.
 * Pair with SHOPIFY_DEV_INSECURE_TLS=1 in .env.local (dev only — never on Vercel).
 */
if (
  process.env.NODE_ENV === "development" &&
  process.env.SHOPIFY_DEV_INSECURE_TLS?.trim() === "1"
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/**
 * Windows dev: antivirus/proxy breaks HTTPS to cdn.shopify.com for `/_next/image`.
 * Pair with SHOPIFY_DEV_INSECURE_TLS=1 in .env.local (dev only — never on Vercel).
 */
if (
  process.env.NODE_ENV === "development" &&
  process.env.SHOPIFY_DEV_INSECURE_TLS?.trim() === "1"
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * `next dev` must never share `distDir` with `next build` / `next start`, or
 * Webpack chunks (./237.js, ./611.js) go missing while the runtime still loads them.
 *
 * Prefer NEXT_USE_DEV_DIST=1 (set by scripts/run-dev.cjs) so child processes inherit it.
 * argv[2]==="dev" is a fallback for plain `npx next dev`.
 */
function getDistDir(): string {
  if (process.env.NEXT_USE_DEV_DIST === "0") return ".next";
  if (
    process.env.NEXT_USE_DEV_DIST === "1" ||
    process.argv[2] === "dev"
  ) {
    return ".next-dev";
  }
  return ".next";
}

const distDir = getDistDir();

const nextConfig: NextConfig = {
  distDir,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/product/custom-visor-engraving",
        destination: "/product/your-own-designed-visor",
        permanent: true,
      },
    ];
  },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
