import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalArticle } from "@/components/legal/LegalArticle";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  const date = new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">{t("eyebrow")}</p>
      <article className="mt-6">
        <LegalArticle locale={locale} />
        <p className="mt-14 border-t border-black/10 pt-8 text-xs font-medium uppercase tracking-wider text-muted dark:border-white/10">
          {t("lastUpdated", { date })}
        </p>
      </article>
      <Link
        href={PATHS.home}
        className="mt-10 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent hover:text-foreground"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
