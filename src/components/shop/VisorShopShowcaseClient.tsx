"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { PLACEHOLDER } from "@/lib/placeholders";
import { PATHS } from "@/lib/routes";
import type { CatalogProduct } from "@/lib/shopify/storefront";

type SortKey = "newest" | "price-asc" | "price-desc" | "name-asc";

type Props = {
  products: CatalogProduct[];
  locale: string;
};

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function VisorShopShowcaseClient({ products, locale }: Props) {
  /** Root-scope keys avoid missing-message fallbacks like `Shop.filter` in some client bundles. */
  const t = useTranslations();
  const localeTag = locale === "nl" ? "nl-NL" : "en-GB";

  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set());

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) {
      for (const tag of p.tags ?? []) {
        const trimmed = tag.trim();
        if (trimmed) s.add(trimmed);
      }
    }
    return [...s].sort((a, b) => a.localeCompare(b, localeTag));
  }, [products, localeTag]);

  const filtersActive =
    query.trim().length > 0 || sort !== "newest" || selectedTags.size > 0;

  const displayed = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q) {
        const title = p.title.toLowerCase();
        const handle = p.handle.toLowerCase();
        if (!title.includes(q) && !handle.includes(q)) return false;
      }
      if (selectedTags.size > 0) {
        const ptags = new Set((p.tags ?? []).map((x) => x.trim().toLowerCase()));
        for (const tag of selectedTags) {
          if (!ptags.has(tag.toLowerCase())) return false;
        }
      }
      return true;
    });

    const copy = [...list];
    switch (sort) {
      case "price-asc":
        return copy.sort(
          (a, b) =>
            Number.parseFloat(a.priceRange.minVariantPrice.amount) -
            Number.parseFloat(b.priceRange.minVariantPrice.amount)
        );
      case "price-desc":
        return copy.sort(
          (a, b) =>
            Number.parseFloat(b.priceRange.minVariantPrice.amount) -
            Number.parseFloat(a.priceRange.minVariantPrice.amount)
        );
      case "name-asc":
        return copy.sort((a, b) => a.title.localeCompare(b.title, localeTag));
      default:
        return copy;
    }
  }, [products, query, sort, selectedTags, localeTag]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setSort("newest");
    setSelectedTags(new Set());
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md border border-black/25 bg-transparent px-3.5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-foreground transition hover:border-black/45"
          aria-expanded={filterOpen}
        >
          <FilterIcon className="opacity-90" />
          {t("Shop.filterCta")}
          {filtersActive ? (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-label={t("Shop.filtersActiveAria")}
            />
          ) : null}
        </button>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted">
          {filtersActive
            ? t("Shop.itemCountFiltered", { filtered: displayed.length, total: products.length })
            : t("Shop.itemCount", { count: products.length })}
        </p>
      </div>

      {filterOpen ? (
        <div
          className="mt-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm backdrop-blur-sm md:p-6"
          role="region"
          aria-label={t("Shop.filterPanelAria")}
        >
          <div className="grid gap-5 md:grid-cols-2 md:gap-8">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {t("Shop.searchLabel")}
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Shop.searchPlaceholder")}
                className="mt-2 w-full rounded-xl border border-black/15 bg-black/[0.02] px-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:border-accent/60 focus:outline-none"
                autoComplete="off"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {t("Shop.sortLabel")}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-black/15 bg-black/[0.02] px-4 py-2.5 text-sm text-foreground focus:border-accent/60 focus:outline-none"
              >
                <option value="newest">{t("Shop.sortNewest")}</option>
                <option value="price-asc">{t("Shop.sortPriceLow")}</option>
                <option value="price-desc">{t("Shop.sortPriceHigh")}</option>
                <option value="name-asc">{t("Shop.sortName")}</option>
              </select>
            </label>
          </div>

          {allTags.length > 0 ? (
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {t("Shop.tagsLabel")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const on = selectedTags.has(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={on}
                      className={
                        on
                          ? "rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-xs text-foreground"
                          : "rounded-full border border-black/15 bg-black/[0.03] px-3 py-1.5 text-xs text-muted transition hover:border-black/30 hover:text-foreground"
                      }
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {filtersActive ? (
            <div className="mt-6 flex justify-end border-t border-black/10 pt-4">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-mono uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
              >
                {t("Shop.clearFilters")}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {displayed.length === 0 ? (
        <p className="mt-10 text-sm text-muted">{t("Shop.noFilterResults")}</p>
      ) : (
        <div
          className="mt-8 -mx-4 flex snap-x snap-mandatory gap-x-5 gap-y-10 overflow-x-auto scroll-smooth px-4 pb-4 sm:gap-x-6 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-10 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-11 xl:grid-cols-4 xl:gap-x-7 xl:gap-y-12"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {displayed.map((p, idx) => {
            const money = new Intl.NumberFormat(localeTag, {
              style: "currency",
              currency: p.priceRange.minVariantPrice.currencyCode,
              maximumFractionDigits: 0,
            }).format(Number.parseFloat(p.priceRange.minVariantPrice.amount));
            const ph = [PLACEHOLDER.product1, PLACEHOLDER.product2, PLACEHOLDER.product3] as const;
            const thumbSrc = p.featuredImage?.url?.trim() || ph[idx % ph.length];

            return (
              <article
                key={p.id}
                id={p.handle}
                className="w-[min(78vw,300px)] shrink-0 snap-center scroll-mt-28 md:w-auto md:max-w-none md:snap-align-none"
              >
                <Link
                  href={`${PATHS.product(p.handle)}#product-viewer`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_32px_-8px_rgba(224,30,30,0.18)]"
                >
                  {/* Vierkante thumb: contain = hele product zichtbaar; lichte padding i.p.v. zware zoom/crop. */}
                  <div className="relative aspect-square w-full overflow-hidden bg-background">
                    <div className="absolute inset-0 p-[5%] transition-transform duration-300 group-hover:scale-[1.03]">
                      <Image
                        src={thumbSrc}
                        alt={p.featuredImage?.altText?.trim() || p.title}
                        fill
                        className="object-contain object-[50%_48%]"
                        sizes="(max-width: 768px) 78vw, (max-width: 1280px) 33vw, 22vw"
                        priority={false}
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full border border-accent/30 bg-background/80 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-accent backdrop-blur-sm">
                      {t("Shop.view3d")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <h2 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                      {p.title}
                    </h2>
                    <p className="ml-4 shrink-0 font-mono text-sm font-semibold text-accent">
                      {t("Shop.priceFrom", { price: money })}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
