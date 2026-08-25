import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NewsletterSignup } from "@/components/coming-soon/NewsletterSignup";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ComingSoon" });
  return { title: t("metaTitle") };
}

export default async function ComingSoonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ComingSoon");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="sr-only">{t("srTitle")}</h1>
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">{t("eyebrow")}</p>

      <div className="mt-8 text-center">
        <p className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{t("title")}</p>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted">{t("body")}</p>
      </div>

      <div className="mt-14">
        <NewsletterSignup />
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-4 border-t border-black/10 pt-14 text-sm dark:border-white/10">
        <Link href={PATHS.home} className="text-muted underline-offset-4 transition hover:text-foreground hover:underline">
          {t("backHome")}
        </Link>
        <Link href={PATHS.shopVisors} className="text-accent underline-offset-4 hover:underline">
          {t("openShop")}
        </Link>
      </div>
    </div>
  );
}
