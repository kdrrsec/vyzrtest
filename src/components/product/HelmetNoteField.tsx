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
    <div className="border-t border-black/10 pt-8 dark:border-white/10">
      <label htmlFor="helmet-note" className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
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
        className="mt-4 w-full resize-y rounded-lg border border-black/15 bg-black/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-white/15 dark:bg-white/[0.02]"
      />
      {showDisclaimer ? (
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
