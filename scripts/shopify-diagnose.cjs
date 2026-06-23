/**
 * Quick Shopify Storefront diagnostic (reads .env.local from project root).
 * Usage: node scripts/shopify-diagnose.cjs
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = { ...loadEnv(path.join(root, ".env.example")), ...loadEnv(envPath) };

const domain = (
  env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  env.SHOPIFY_STORE_DOMAIN ||
  ""
).replace(/^https?:\/\//i, "").replace(/\/.*$/, "");

const token =
  env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  "";

const collectionHandle = (env.NEXT_PUBLIC_SHOPIFY_VISORS_COLLECTION_HANDLE || "").trim();
const separateCustom = !["0", "false", "off"].includes(
  (env.NEXT_PUBLIC_SEPARATE_CUSTOM_VISOR || "1").trim().toLowerCase()
);

const QUERY = `
  query Diagnose($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        availableForSale
        metafields(
          identifiers: [
            { namespace: "custom", key: "visor_config_mode" },
            { namespace: "custom", key: "visor_modus" },
          ]
        ) {
          key
          value
        }
      }
    }
  }
`;

function resolveMode(metafields) {
  const byKey = new Map();
  for (const m of metafields || []) {
    if (m?.key) byKey.set(m.key, m.value);
  }
  const raw = (
    byKey.get("visor_config_mode") ??
    byKey.get("visor_modus") ??
    ""
  )
    .trim()
    .toLowerCase();
  return raw === "standard" ? "standard" : "custom_upload";
}

async function main() {
  console.log("=== Shopify diagnose ===\n");
  console.log("Domain:", domain || "(missing)");
  console.log("Token:", token ? `${token.slice(0, 6)}â€¦${token.slice(-4)} (${token.length} chars)` : "(missing)");
  console.log("Collection handle env:", collectionHandle || "(none â€” uses all products)");
  console.log("SEPARATE_CUSTOM_VISOR (filter shop):", separateCustom ? "ON (only standard)" : "OFF (all products)\n");

  if (!domain || !token) {
    console.error("\nFAIL: Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local");
    process.exit(1);
  }

  const endpoint = `https://${domain}/api/2024-10/graphql.json`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: QUERY, variables: { first: 50 } }),
  });

  console.log("\nHTTP status:", res.status, res.statusText);

  const json = await res.json();
  if (json.errors?.length) {
    console.error("\nGraphQL errors:");
    for (const e of json.errors) console.error(" -", e.message);
    process.exit(1);
  }

  const nodes = json.data?.products?.nodes ?? [];
  console.log("\nProducts returned from Storefront API:", nodes.length);

  if (nodes.length === 0) {
    console.log("\nLikely causes:");
    console.log(" - No products published to Headless / Online Store sales channel");
    console.log(" - Invalid or revoked Storefront access token");
    process.exit(0);
  }

  const rows = nodes.map((p) => ({
    handle: p.handle,
    title: p.title,
    forSale: p.availableForSale,
    mode: resolveMode(p.metafields),
  }));

  const standard = rows.filter((r) => r.mode === "standard");
  const custom = rows.filter((r) => r.mode === "custom_upload");

  console.log("\nBy visor_config_mode metafield:");
  console.log(" - standard (shown in /shop when filter ON):", standard.length);
  console.log(" - custom_upload (hidden from /shop when filter ON):", custom.length);

  if (separateCustom && standard.length === 0 && custom.length > 0) {
    console.log("\n*** LIKELY CAUSE: Shop filter hides all products ***");
    console.log("Products exist in Shopify but none have metafield custom.visor_config_mode = standard");
    console.log("Fix in Shopify Admin per product, OR set NEXT_PUBLIC_SEPARATE_CUSTOM_VISOR=0 in .env.local");
  }

  console.log("\nProduct list:");
  for (const r of rows) {
    const shop = separateCustom ? (r.mode === "standard" ? "SHOP" : "hidden") : "SHOP";
    console.log(`  [${shop}] ${r.handle} â€” ${r.title} (mode=${r.mode}, forSale=${r.forSale})`);
  }

  const defaultHandle = env.NEXT_PUBLIC_DEFAULT_PRODUCT_HANDLE || "your-own-designed-visor";
  const match = nodes.find((p) => p.handle === defaultHandle);
  console.log(`\nDefault product handle (${defaultHandle}):`, match ? "found" : "NOT FOUND");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
