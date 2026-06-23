"use client";

import { useTranslations } from "next-intl";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** When set, shown below the field once the customer has entered helmet details. */
  disclaimer?: string | null;
  hint?: string;
  required?: boolean;
};

export function HelmetNoteField({
  value,
  onChange,
  disclaimer,
  hint,
  required = true,
}: Props) {
  const t = useTranslations("Product");
  const showDisclaimer = Boolean(disclaimer?.trim() && value.trim());

  return (
    <div className="border-t border-white/20 pt-8">
      <label htmlFor="helmet-note" className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {t("helmetNoteLabel")}
      </label>
      <p className="mt-2 text-xs leading-relaxed text-muted">{hint ?? t("helmetNoteHint")}</p>
      <textarea
        id="helmet-note"
        name="helmet-note"
        rows={3}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("helmetNotePlaceholder")}
        className="mt-4 w-full resize-y rounded-lg border border-white/25 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {showDisclaimer ? (
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
