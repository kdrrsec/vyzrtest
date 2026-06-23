import type { ProductVariant } from "@/lib/shopify/types";

export type VariantOptionGroup = {
  name: string;
  values: { value: string; variant: ProductVariant }[];
};

/** Build Shopify option groups (e.g. "Visor" → AGV K1 S, K3, …). */
export function getVariantOptionGroups(variants: ProductVariant[]): VariantOptionGroup[] {
  const available = variants.filter((v) => v.availableForSale);
  if (!available.length) return [];

  const optionNames = available[0].selectedOptions.map((o) => o.name);
  if (!optionNames.length) {
    return [
      {
        name: "Variant",
        values: available.map((v) => ({ value: v.title, variant: v })),
      },
    ];
  }

  return optionNames.map((name) => {
    const seen = new Set<string>();
    const values: { value: string; variant: ProductVariant }[] = [];
    for (const v of available) {
      const opt = v.selectedOptions.find((o) => o.name === name);
      const value = opt?.value?.trim() || v.title;
      if (seen.has(value)) continue;
      seen.add(value);
      values.push({ value, variant: v });
    }
    return { name, values };
  });
}

export function findVariantForSelections(
  variants: ProductVariant[],
  selections: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((v) => {
      if (!v.availableForSale) return false;
      return v.selectedOptions.every((o) => selections[o.name] === o.value);
    }) ?? null
  );
}

export function initialVariantSelections(variants: ProductVariant[]): Record<string, string> {
  const first = variants.find((v) => v.availableForSale) ?? variants[0];
  if (!first) return {};
  const out: Record<string, string> = {};
  for (const o of first.selectedOptions) {
    out[o.name] = o.value;
  }
  return out;
}

/** After picking one option value, align all other options to a matching variant. */
export function selectionsForOptionValue(
  variants: ProductVariant[],
  optionName: string,
  value: string
): Record<string, string> {
  const match = variants.find(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.some((o) => o.name === optionName && o.value === value)
  );
  if (!match) return { [optionName]: value };
  return Object.fromEntries(match.selectedOptions.map((o) => [o.name, o.value]));
}
