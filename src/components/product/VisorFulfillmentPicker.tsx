"use client";

import { useTranslations } from "next-intl";
import type { VisorFulfillmentId } from "@/lib/visorFulfillment";
import {
  fulfillmentHasEngravingDiscount,
  VYZR_SUPPLIES_ENGRAVING_DISCOUNT_PERCENT,
} from "@/lib/visorFulfillment";

type Props = {
  value: VisorFulfillmentId;
  onChange: (value: VisorFulfillmentId) => void;
};

const OPTIONS: VisorFulfillmentId[] = [
  "own_visor",
  "vyzr_supplies_visor",
  "dropoff_visor",
];

function badgeKey(id: VisorFulfillmentId): string | null {
  if (id === "vyzr_supplies_visor") return "fulfillmentBadge";
  if (id === "dropoff_visor") return "fulfillmentBadgeDropoff";
  return null;
}

export function VisorFulfillmentPicker({ value, onChange }: Props) {
  const t = useTranslations("Product");

  return (
    <div className="border-t border-black/10 pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
        {t("fulfillmentLabel")}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{t("fulfillmentHint")}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((id) => {
          const active = value === id;
          const badge = badgeKey(id);
          const discounted = fulfillmentHasEngravingDiscount(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`group relative flex flex-col items-start rounded-2xl border px-4 py-5 text-left transition-all duration-200 ${
                active
                  ? "border-accent bg-accent/[0.08] shadow-[0_0_0_1px_rgba(224,30,30,0.35),0_4px_24px_-4px_rgba(224,30,30,0.15)]"
                  : "border-black/15 bg-black/[0.02] hover:border-black/25 hover:bg-black/[0.04] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] cursor-pointer"
              }`}
            >
              {/* Selection indicator dot */}
              <span
                className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 ${
                  active
                    ? "border-accent bg-accent shadow-[0_0_8px_rgba(224,30,30,0.4)]"
                    : "border-black/20 bg-transparent group-hover:border-black/35"
                }`}
              >
                {active ? (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                ) : null}
              </span>

              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                  badge
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                    : "invisible border-transparent"
                }`}
              >
                {badge ? t(badge) : "·"}
              </span>
              <span className={`mt-2.5 text-sm font-semibold leading-snug transition-colors ${active ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>
                {t(`fulfillment_${id}_title`)}
              </span>
              <span className="mt-1.5 text-xs leading-relaxed text-muted">
                {t(`fulfillment_${id}_body`)}
              </span>
              {discounted ? (
                <span className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-wider text-accent">
                  {t("fulfillmentDiscount", { percent: VYZR_SUPPLIES_ENGRAVING_DISCOUNT_PERCENT })}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {value === "dropoff_visor" ? (
        <p className="mt-4 rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3 text-xs leading-relaxed text-muted">
          {t("fulfillmentDropoffNote")}
        </p>
      ) : null}
    </div>
  );
}
