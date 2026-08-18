import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return { title: t("metaTitle") };
}

const FAQ_IDS = [1, 2, 3, 4, 5, 6] as const;

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
        {t("heading")}
      </h1>
      <p className="mt-4 text-sm text-muted">{t("intro")}</p>
      <div className="mt-12 space-y-10">
        {FAQ_IDS.map((n) => (
          <div key={n} className="border-b border-black/10 pb-10">
            <h2 className="text-lg font-medium text-foreground">{t(`q${n}`)}</h2>
            <p className="mt-3 whitespace-pre-line text-sm text-muted">{t(`a${n}`)}</p>
          </div>
        ))}
      </div>
      <Link
        href={PATHS.shopVisors}
        className="btn-accent mt-14 inline-flex px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em]"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
