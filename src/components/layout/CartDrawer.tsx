"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  clearShopifyCart,
  getCartDrawerState,
  updateCartLineQuantity,
} from "@/app/actions/cart";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/money";
import { PLACEHOLDER } from "@/lib/placeholders";
import { PATHS } from "@/lib/routes";
import { getCartLineDetailRows } from "@/lib/cartLineDetails";
import type { CartLineView } from "@/lib/shopify/storefront";
import { useSiteChromeStore } from "@/store/useSiteChromeStore";

export function CartDrawer() {
  const t = useTranslations("Cart");
  const tNav = useTranslations("Nav");
  const open = useSiteChromeStore((s) => s.cartDrawerOpen);
  const setOpen = useSiteChromeStore((s) => s.setCartDrawerOpen);
  const setCount = useSiteChromeStore((s) => s.setCartCount);
  const cartIdHint = useSiteChromeStore((s) => s.cartIdHint);
  const setCartIdHint = useSiteChromeStore((s) => s.setCartIdHint);

  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);
  const [qtyLineBusy, setQtyLineBusy] = useState<string | null>(null);
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [reason, setReason] = useState<"no_shopify" | "empty" | null>(null);
  const [lines, setLines] = useState<CartLineView[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    getCartDrawerState(cartIdHint ?? undefined)
      .then((state) => {
        if (state.ok) {
          setLines(state.cart.lines);
          setCheckoutUrl(state.cart.checkoutUrl);
          setCount(state.cart.totalQuantity);
          setReason(null);
        } else {
          setLines([]);
          setCheckoutUrl(null);
          setReason(state.reason);
        }
      })
      .finally(() => setLoading(false));
  }, [cartIdHint, setCount]);

  useEffect(() => {
    if (!open) return;
    /* Defer so httpOnly cart cookie from the prior server action is committed before
       getCartDrawerState runs (avoids empty flash and header count stuck at 0). */
    const t = window.setTimeout(() => refresh(), 0);
    return () => window.clearTimeout(t);
  }, [open, refresh]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const empty = !loading && (reason === "empty" || lines.length === 0);

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label={t("closeCart")}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-black/10 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <h2
            id="cart-drawer-title"
            className="font-mono text-xs uppercase tracking-[0.25em] text-foreground"
          >
            {t("title")}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            {!loading && !empty && reason !== "no_shopify" ? (
              <button
                type="button"
                disabled={clearing}
                onClick={() => {
                  setClearError(null);
                  setClearing(true);
                  void clearShopifyCart(cartIdHint ?? undefined)
                    .then(() => {
                      setLines([]);
                      setCheckoutUrl(null);
                      setReason("empty");
                      setCount(0);
                      setCartIdHint(null);
                    })
                    .catch(() => setClearError(t("clearError")))
                    .finally(() => setClearing(false));
                }}
                className="rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted transition hover:bg-black/5 hover:text-accent disabled:opacity-40"
              >
                {clearing ? t("clearing") : t("clear")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-muted transition hover:bg-black/5 hover:text-foreground"
              aria-label={tNav("close")}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          {clearError ? (
            <p className="mb-4 text-sm text-accent" role="alert">
              {clearError}
            </p>
          ) : null}
          {qtyError ? (
            <p className="mb-4 text-sm text-accent" role="alert">
              {qtyError}
            </p>
          ) : null}
          {loading ? (
            <p className="text-sm text-muted">{t("loading")}</p>
          ) : reason === "no_shopify" ? (
            <p className="text-sm text-muted">{t("noShopify")}</p>
          ) : empty ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <p className="text-lg font-medium text-foreground">{t("emptyTitle")}</p>
              <p className="mt-2 max-w-xs text-sm text-muted">{t("emptyBody")}</p>
              <Link
                href={PATHS.shopVisors}
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex rounded-full border border-black/15 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-accent"
              >
                {t("continue")}
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 border-b border-black/10 pb-6">
                  <Link
                    href={PATHS.product(line.handle)}
                    onClick={() => setOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black/[0.04]"
                  >
                    <Image
                      src={line.image?.url?.trim() || PLACEHOLDER.thumb}
                      alt={line.image?.altText?.trim() || line.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={PATHS.product(line.handle)}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-foreground hover:text-accent"
                    >
                      {line.title}
                    </Link>
                    <CartLineDetails line={line} variantFallback={t("variantFallback")} />
                    <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/80">
                      <span className="text-muted">{t("qty")}</span>
                      <div className="inline-flex items-stretch rounded-full border border-black/15">
                        <button
                          type="button"
                          aria-label={t("decreaseQty")}
                          disabled={qtyLineBusy === line.id}
                          onClick={() => {
                            setQtyError(null);
                            setQtyLineBusy(line.id);
                            void updateCartLineQuantity(
                              line.id,
                              line.quantity - 1,
                              cartIdHint ?? undefined
                            )
                              .then(() => refresh())
                              .catch((e: unknown) =>
                                setQtyError(
                                  e instanceof Error ? e.message : t("qtyUpdateError")
                                )
                              )
                              .finally(() => setQtyLineBusy(null));
                          }}
                          className="px-2.5 py-1 text-sm leading-none text-foreground transition hover:bg-black/5 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="flex min-w-[2rem] items-center justify-center border-x border-black/15 px-1 tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t("increaseQty")}
                          disabled={qtyLineBusy === line.id}
                          onClick={() => {
                            setQtyError(null);
                            setQtyLineBusy(line.id);
                            void updateCartLineQuantity(
                              line.id,
                              line.quantity + 1,
                              cartIdHint ?? undefined
                            )
                              .then(() => refresh())
                              .catch((e: unknown) =>
                                setQtyError(
                                  e instanceof Error ? e.message : t("qtyUpdateError")
                                )
                              )
                              .finally(() => setQtyLineBusy(null));
                          }}
                          className="px-2.5 py-1 text-sm leading-none text-foreground transition hover:bg-black/5 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-foreground/40">·</span>
                      <span>
                        {formatMoney(line.price.amount, line.price.currencyCode)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!empty && checkoutUrl && !loading && reason !== "no_shopify" ? (
          <div className="border-t border-black/10 bg-white/95 px-5 py-5">
            <a
              href={checkoutUrl}
              className="btn-accent flex w-full items-center justify-center py-4 text-center text-xs font-semibold uppercase tracking-[0.2em]"
            >
              {t("checkout")}
            </a>
            <p className="mt-3 text-center text-[10px] text-muted">{t("checkoutNote")}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function CartLineDetails({
  line,
  variantFallback,
}: {
  line: CartLineView;
  variantFallback: string;
}) {
  const rows = getCartLineDetailRows(line);
  if (!rows.length) return null;

  return (
    <ul className="mt-1.5 space-y-0.5">
      {rows.map((row, i) => {
        const label = row.label || variantFallback;
        return (
          <li key={`${label}-${row.value}-${i}`} className="text-xs text-muted">
            <span className="text-foreground/45">{label}: </span>
            {row.value}
          </li>
        );
      })}
    </ul>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
