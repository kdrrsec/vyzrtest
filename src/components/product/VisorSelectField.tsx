"use client";

import { useTranslations } from "next-intl";
import {
  getVisorById,
  popularVisors,
  visorDisplayLabel,
  visorsByBrand,
} from "@/lib/visorCatalog";
import { formatMoney } from "@/lib/money";

type Props = {
  value: string | null;
  onChange: (id: string) => void;
  mode?: "supply" | "own";
  disclaimer?: string | null;
};

export function VisorSelectField({ value, onChange, mode = "supply", disclaimer }: Props) {
  const t = useTranslations("Product");
  const selected = getVisorById(value);
  const groups = visorsByBrand();
  const popular = popularVisors();
  const label = mode === "own" ? t("visorSelectLabelOwn") : t("visorSelectLabel");
  const hint = mode === "own" ? t("visorSelectHintOwn") : t("visorSelectHint");

  return (
    <div className="border-t border-white/20 pt-8">
      <label htmlFor="visor-select" className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {label}
      </label>
      <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>

      <select
        id="visor-select"
        name="visor-select"
        required
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 w-full cursor-pointer appearance-none rounded-lg border border-white/25 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value="" disabled className="bg-[#111] text-muted">
          {t("visorSelectPlaceholder")}
        </option>
        <optgroup label={t("visorSelectPopular")} className="bg-[#111]">
          {popular.map((v) => (
            <option key={v.id} value={v.id} className="bg-[#111]">
              {visorDisplayLabel(v)}
              {mode === "supply" ? ` — ${formatMoney(String(v.priceEUR), "EUR")}` : ""}
            </option>
          ))}
        </optgroup>
        {groups.map(({ brand, items }) => (
          <optgroup key={brand} label={brand} className="bg-[#111]">
            {items.map((v) => (
              <option key={v.id} value={v.id} className="bg-[#111]">
                {visorDisplayLabel(v)}
                {mode === "supply" ? ` — ${formatMoney(String(v.priceEUR), "EUR")}` : ""}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {selected ? (
        <p className="mt-3 text-sm text-white">
          <span className="text-muted">{t("visorSelectChosen")}: </span>
          {visorDisplayLabel(selected)}
          {mode === "supply" ? (
            <span className="ml-2 font-mono text-accent">
              +{formatMoney(String(selected.priceEUR), "EUR")}
            </span>
          ) : null}
        </p>
      ) : null}

      {disclaimer && selected ? (
        <p
          className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-100/90"
          role="note"
        >
          {disclaimer}
        </p>
      ) : null}
    </div>
  );
}
