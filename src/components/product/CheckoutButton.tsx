"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { addLinesToCart, fetchCartTotalForCartId } from "@/app/actions/cart";
import type { CartCreateLine } from "@/lib/shopify/storefront";
import { useSiteChromeStore } from "@/store/useSiteChromeStore";

type LineAttribute = { key: string; value: string };

type Props = {
  variantId: string;
  disabled?: boolean;
  lineAttributes?: LineAttribute[];
  extraCartLines?: CartCreateLine[];
  applyVyzrSuppliesDiscount?: boolean;
  isDropoff?: boolean;
  /** Upload designs etc. before add-to-cart; overrides `lineAttributes` when set. */
  resolveLineAttributes?: () => Promise<LineAttribute[] | undefined>;
  children?: ReactNode;
  sentenceCase?: boolean;
};

export function CheckoutButton({
  variantId,
  disabled,
  lineAttributes,
  extraCartLines,
  applyVyzrSuppliesDiscount,
  isDropoff,
  resolveLineAttributes,
  children,
  sentenceCase,
}: Props) {
  const t = useTranslations("Checkout");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const setCartCount = useSiteChromeStore((s) => s.setCartCount);
  const setCartIdHint = useSiteChromeStore((s) => s.setCartIdHint);
  const setCartDrawerOpen = useSiteChromeStore((s) => s.setCartDrawerOpen);

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => {
          setError(null);
          setIsPending(true);
          void (async () => {
            try {
              let attributes = lineAttributes;
              if (resolveLineAttributes) {
                setIsUploading(true);
                attributes = await resolveLineAttributes();
              }
              const lines: CartCreateLine[] = [
                {
                  merchandiseId: variantId,
                  quantity: 1,
                  attributes,
                },
                ...(extraCartLines ?? []),
              ];
              const { totalQuantity, cartId, checkoutUrl } = await addLinesToCart(lines, {
                applyVyzrSuppliesDiscount: Boolean(applyVyzrSuppliesDiscount),
                isDropoff: Boolean(isDropoff),
              });
              setCartIdHint(cartId);
              const prev = useSiteChromeStore.getState().cartCount;
              const optimistic = prev + lines.reduce((s, l) => s + (l.quantity ?? 0), 0);
              let next = Math.max(totalQuantity, optimistic);
              try {
                const verified = await fetchCartTotalForCartId(cartId);
                next = Math.max(next, verified);
              } catch {
                /* keep next */
              }
              flushSync(() => setCartCount(next));

              if (isDropoff && checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
              }

              setCartDrawerOpen(true);
            } catch (e) {
              setError(e instanceof Error ? e.message : t("errorGeneric"));
            } finally {
              setIsUploading(false);
              setIsPending(false);
            }
          })();
        }}
        className={`btn-accent w-full px-6 py-4 text-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none ${
          sentenceCase ? "normal-case tracking-wide" : "uppercase tracking-[0.2em]"
        }`}
      >
        {isUploading ? t("uploading") : isPending ? t("adding") : (children ?? t("add"))}
      </button>
      {error ? (
        <p className="text-xs text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
