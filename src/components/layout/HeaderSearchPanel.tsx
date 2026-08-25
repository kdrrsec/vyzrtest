"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition } from "react";
import { runProductSearch } from "@/app/actions/searchProducts";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/money";
import { PLACEHOLDER } from "@/lib/placeholders";
import { PATHS } from "@/lib/routes";
import type { SearchProductHit } from "@/lib/shopify/storefront";
import { useSiteChromeStore } from "@/store/useSiteChromeStore";

export function HeaderSearchPanel() {
  const t = useTranslations("Search");
  const tNav = useTranslations("Nav");
  const open = useSiteChromeStore((s) => s.searchOpen);
  const setOpen = useSiteChromeStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProductHit[]>([]);
  const [isPending, startTransition] = useTransition();

  const search = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    startTransition(() => {
      runProductSearch(trimmed).then(setResults);
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    const timer = setTimeout(() => search(query), 280);
    return () => clearTimeout(timer);
  }, [open, query, search]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      const id = window.requestAnimationFrame(() => {
        document.getElementById("header-search-input")?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[max(4rem,10vh)] backdrop-blur-sm dark:bg-black/60 md:pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0"
        aria-label={t("closeSearch")}
        onClick={() => setOpen(false)}
      />
      <div
        className="relative w-full max-w-xl rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-black"
        role="dialog"
        aria-modal="true"
        aria-label={t("dialogLabel")}
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
          <SearchGlyph className="h-5 w-5 shrink-0 text-muted" />
          <input
            id="header-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            aria-label={tNav("close")}
          >
            <CloseGlyph className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-3">
          {query.trim().length < 2 ? (
            <p className="px-2 py-6 text-center text-sm text-muted">{t("hintShort")}</p>
          ) : isPending && results.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted">{t("searching")}</p>
          ) : results.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted">{t("none")}</p>
          ) : (
            <ul className="space-y-1">
              {results.map((p) => (
                <li key={p.handle}>
                  <Link
                    href={PATHS.product(p.handle)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/[0.04] dark:bg-white/[0.06]">
                      <Image
                        src={p.featuredImage?.url?.trim() || PLACEHOLDER.thumb}
                        alt={p.featuredImage?.altText?.trim() || p.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{p.title}</p>
                      <p className="text-xs text-muted">
                        {formatMoney(
                          p.priceRange.minVariantPrice.amount,
                          p.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-5.2-5.2M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
