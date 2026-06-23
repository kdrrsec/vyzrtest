/**
 * One-time setup: registers the VYZR drop-off redirect ScriptTag in Shopify.
 * The script runs on the order status (thank you) page and redirects
 * drop-off customers to /book-dropoff to get their personal Calendly link.
 *
 * Usage:
 *   node scripts/register-shopify-scripttag.cjs
 *
 * Safe to run multiple times â€” it checks for an existing tag first.
 */
const fs   = require("fs");
const path = require("path");

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

const env = {
  ...loadEnv(path.join(__dirname, "..", ".env.local")),
  ...process.env,
};

const store   = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token   = env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const version = env.SHOPIFY_ADMIN_API_VERSION || "2025-10";
const scriptSrc = "https://vyzrtest.vercel.app/vyzr-dropoff-redirect.js";

if (!store || !token) {
  console.error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const baseUrl = `https://${store}/admin/api/${version}`;
const headers = {
  "X-Shopify-Access-Token": token,
  "Content-Type": "application/json",
};

async function main() {
  // 1. Check if the script tag already exists
  const listRes  = await fetch(`${baseUrl}/script_tags.json?src=${encodeURIComponent(scriptSrc)}`, { headers });
  const listData = await listRes.json();
  const existing = (listData.script_tags || []).find(t => t.src === scriptSrc);

  if (existing) {
    console.log(`âœ“ ScriptTag already registered (id=${existing.id}). Nothing to do.`);
    return;
  }

  // 2. Create the script tag
  const createRes = await fetch(`${baseUrl}/script_tags.json`, {
    method:  "POST",
    headers,
    body: JSON.stringify({
      script_tag: {
        event:         "onload",
        src:           scriptSrc,
        display_scope: "order_status",
      },
    }),
  });

  const createData = await createRes.json();

  if (createData.script_tag) {
    console.log(`âœ“ ScriptTag registered successfully!`);
    console.log(`  ID:    ${createData.script_tag.id}`);
    console.log(`  Src:   ${createData.script_tag.src}`);
    console.log(`  Scope: ${createData.script_tag.display_scope}`);
  } else {
    console.error("âœ— Failed to create ScriptTag:");
    console.error(JSON.stringify(createData, null, 2));
    process.exit(1);
  }
}

main().catch(err => {
  console.error("âœ— Unexpected error:", err.message);
  process.exit(1);
});
