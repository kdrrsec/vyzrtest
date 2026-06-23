import type { CartLineView } from "@/lib/shopify/storefront";

export type CartLineDetailRow = { label: string; value: string };

/** Human-readable rows for cart drawer (visor, setup, uploads, …). */
export function getCartLineDetailRows(line: CartLineView): CartLineDetailRow[] {
  const rows: CartLineDetailRow[] = [];
  const seen = new Set<string>();

  const add = (label: string, value: string) => {
    const v = value.trim();
    if (!v || v === "Default Title") return;
    const key = `${label.toLowerCase()}\0${v.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({ label: label.trim(), value: v });
  };

  for (const opt of line.selectedOptions) {
    add(opt.name, opt.value);
  }

  for (const attr of line.attributes) {
    add(attr.key, attr.value);
  }

  if (
    rows.length === 0 &&
    line.variantTitle &&
    line.variantTitle !== "Default Title"
  ) {
    add("", line.variantTitle);
  }

  return rows;
}
