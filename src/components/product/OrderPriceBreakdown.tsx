"use client";

import { useTranslations } from "next-intl";
import { formatMoney } from "@/lib/money";
import type { VisorCatalogEntry } from "@/lib/visorCatalog";
import { VYZR_SUPPLIES_ENGRAVING_DISCOUNT_PERCENT } from "@/lib/visorFulfillment";

type Props = {
  engravingBase: string;
  engravingDiscounted: string;
  currency: string;
  showEngravingDiscount: boolean;
  visor?: VisorCatalogEntry | null;
};

export function OrderPriceBreakdown({
  engravingBase,
  engravingDiscounted,
  currency,
  showEngravingDiscount,
  visor,
}: Props) {
  const t = useTranslations("Product");

  const engraving = showEngravingDiscount ? engravingDiscounted : engravingBase;
  const engravingNum = Number.parseFloat(engraving) || 0;
  const visorNum = visor?.priceEUR ?? 0;
  const total = engravingNum + visorNum;

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm">
      <div className="flex justify-between gap-4 text-muted">
        <span>{t("priceLineEngraving")}</span>
        <span className="shrink-0 text-right text-white">
          {showEngravingDiscount ? (
            <>
              <span className="mr-2 text-white/40 line-through">
                {formatMoney(engravingBase, currency)}
              </span>
              {formatMoney(engravingDiscounted, currency)}
            </>
          ) : (
            formatMoney(engravingBase, currency)
          )}
        </span>
      </div>
      {showEngravingDiscount ? (
        <p className="text-[10px] uppercase tracking-wider text-accent">
          {t("engravingDiscountBadge", { percent: VYZR_SUPPLIES_ENGRAVING_DISCOUNT_PERCENT })}
        </p>
      ) : null}
      {visor ? (
        <div className="flex justify-between gap-4 text-muted">
          <span>{t("priceLineVisor")}</span>
          <span className="shrink-0 text-white">
            +{formatMoney(String(visor.priceEUR), currency)}
          </span>
        </div>
      ) : null}
      <div className="flex justify-between gap-4 border-t border-white/10 pt-2 font-medium text-white">
        <span>{t("priceLineTotal")}</span>
        <span className="shrink-0 text-lg">
          {formatMoney(String(total.toFixed(2)), currency)}
        </span>
      </div>
      {visor ? (
        <p className="text-xs text-muted">{t("priceBreakdownCheckoutNote")}</p>
      ) : null}
    </div>
  );
}
