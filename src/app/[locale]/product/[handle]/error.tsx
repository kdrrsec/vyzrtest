"use client";

import { useTranslations } from "next-intl";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ProductError");

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-white">{t("title")}</h1>
      <p className="mt-4 text-sm text-muted">
        {error.message || t("fallback")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full border border-white/25 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:border-accent"
      >
        {t("retry")}
      </button>
    </div>
  );
}
