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
    <div className="border-t border-white/20 pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
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
                  ? "border-accent bg-accent/[0.10] shadow-[0_0_0_1px_rgba(255,45,45,0.4),0_4px_24px_-4px_rgba(255,45,45,0.18)]"
                  : "border-white/25 bg-white/[0.04] hover:border-white/45 hover:bg-white/[0.07] hover:shadow-[0_4px_20px_-4px_rgba(255,255,255,0.06)] cursor-pointer"
              }`}
            >
              {/* Selection indicator dot */}
              <span
                className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 ${
                  active
                    ? "border-accent bg-accent shadow-[0_0_8px_rgba(255,45,45,0.5)]"
                    : "border-white/20 bg-transparent group-hover:border-white/40"
                }`}
              >
                {active ? (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                ) : null}
              </span>

              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                  badge
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                    : "invisible border-transparent"
                }`}
              >
                {badge ? t(badge) : "·"}
              </span>
              <span className={`mt-2.5 text-sm font-semibold leading-snug transition-colors ${active ? "text-white" : "text-white/80 group-hover:text-white"}`}>
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
        <p className="mt-4 rounded-xl border border-white/[0.12] bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-muted">
          {t("fulfillmentDropoffNote")}
        </p>
      ) : null}
    </div>
  );
}
