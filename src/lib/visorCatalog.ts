/**
 * Curated replacement visors for popular EU helmets.
 * Prices are indicative OEM clear-visor retail (EUR) — update in Shopify when you sync variants.
 * Optional `shopifyVariantId`: when set, that variant is added as a second cart line at checkout.
 */
export type VisorCatalogEntry = {
  id: string;
  brand: string;
  helmet: string;
  finish: string;
  priceEUR: number;
  popular?: boolean;
  /** Shopify ProductVariant GID — add when you create matching variants in admin. */
  shopifyVariantId?: string;
};

export const VISOR_CATALOG: VisorCatalogEntry[] = [
  { id: "agv-k1-clear", brand: "AGV", helmet: "K1 / K1 S", finish: "Clear", priceEUR: 44.95, popular: true },
  { id: "agv-k3-clear", brand: "AGV", helmet: "K3 / K3 SV", finish: "Clear", priceEUR: 54.95, popular: true },
  { id: "agv-k5-clear", brand: "AGV", helmet: "K5 S", finish: "Clear", priceEUR: 64.95, popular: true },
  { id: "shoei-nxr2-clear", brand: "Shoei", helmet: "NXR2 (RF-1400)", finish: "Clear", priceEUR: 74.95, popular: true },
  { id: "shoei-gt-air2-clear", brand: "Shoei", helmet: "GT-Air II", finish: "Clear", priceEUR: 84.95, popular: true },
  { id: "hjc-rpha11-clear", brand: "HJC", helmet: "RPHA 11", finish: "Clear", priceEUR: 54.95, popular: true },
  { id: "hjc-rpha70-clear", brand: "HJC", helmet: "RPHA 70", finish: "Clear", priceEUR: 59.95 },
  { id: "hjc-i10-clear", brand: "HJC", helmet: "i10", finish: "Clear", priceEUR: 39.95, popular: true },
  { id: "scorpion-r1-clear", brand: "Scorpion", helmet: "EXO-R1 Air", finish: "Clear", priceEUR: 54.95, popular: true },
  { id: "scorpion-520-clear", brand: "Scorpion", helmet: "EXO-520 EVO", finish: "Clear", priceEUR: 44.95 },
  { id: "ls2-thunder-clear", brand: "LS2", helmet: "Thunder / Storm", finish: "Clear", priceEUR: 34.95, popular: true },
  { id: "bell-qualifier-clear", brand: "Bell", helmet: "Qualifier DLX MIPS", finish: "Clear", priceEUR: 39.95 },
  { id: "shark-spartan-clear", brand: "Shark", helmet: "Spartan / Spartan GT", finish: "Clear", priceEUR: 49.95, popular: true },
  { id: "nolan-n87-clear", brand: "Nolan", helmet: "N87", finish: "Clear", priceEUR: 44.95 },
  { id: "schuberth-c4-clear", brand: "Schuberth", helmet: "C4 / C4 Pro", finish: "Clear", priceEUR: 89.95 },
];

export function getVisorById(id: string | null | undefined): VisorCatalogEntry | null {
  if (!id?.trim()) return null;
  return VISOR_CATALOG.find((v) => v.id === id) ?? null;
}

export function visorDisplayLabel(entry: VisorCatalogEntry): string {
  return `${entry.brand} ${entry.helmet} · ${entry.finish}`;
}

export function visorsByBrand(): { brand: string; items: VisorCatalogEntry[] }[] {
  const map = new Map<string, VisorCatalogEntry[]>();
  for (const v of VISOR_CATALOG) {
    const list = map.get(v.brand) ?? [];
    list.push(v);
    map.set(v.brand, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([brand, items]) => ({
      brand,
      items: [...items].sort((a, b) => a.priceEUR - b.priceEUR),
    }));
}

export function popularVisors(): VisorCatalogEntry[] {
  return VISOR_CATALOG.filter((v) => v.popular);
}
