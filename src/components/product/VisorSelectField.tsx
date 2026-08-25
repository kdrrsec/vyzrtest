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
    <div className="border-t border-black/10 pt-8 dark:border-white/10">
      <label htmlFor="visor-select" className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
        {label}
      </label>
      <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>

      <select
        id="visor-select"
        name="visor-select"
        required
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 w-full cursor-pointer appearance-none rounded-lg border border-black/15 bg-black/[0.02] px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-white/15 dark:bg-white/[0.02]"
      >
        <option value="" disabled className="bg-white text-muted dark:bg-black">
          {t("visorSelectPlaceholder")}
        </option>
        <optgroup label={t("visorSelectPopular")} className="bg-white dark:bg-black">
          {popular.map((v) => (
            <option key={v.id} value={v.id} className="bg-white dark:bg-black">
              {visorDisplayLabel(v)}
              {mode === "supply" ? ` · ${formatMoney(String(v.priceEUR), "EUR")}` : ""}
            </option>
          ))}
        </optgroup>
        {groups.map(({ brand, items }) => (
          <optgroup key={brand} label={brand} className="bg-white dark:bg-black">
            {items.map((v) => (
              <option key={v.id} value={v.id} className="bg-white dark:bg-black">
                {visorDisplayLabel(v)}
                {mode === "supply" ? ` · ${formatMoney(String(v.priceEUR), "EUR")}` : ""}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {selected ? (
        <p className="mt-3 text-sm text-foreground">
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
          className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300"
          role="note"
        >
          {disclaimer}
        </p>
      ) : null}
    </div>
  );
}
