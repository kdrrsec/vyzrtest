import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HowItWorksHome } from "@/components/home/HowItWorksHome";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowItWorks" });
  return { title: t("metaTitle") };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HowItWorks");
  const highlights = [t("pagePointCheckout"), t("pagePointTracking"), t("pagePointReview")];

  return (
    <div className="pb-16 pt-6">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
          {t("pageEyebrow")}
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t("pageLead")}</p>
        <div className="mt-6 flex max-w-3xl flex-wrap gap-2">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-accent/20 bg-accent/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide text-foreground/80 shadow-[0_0_8px_rgba(224,30,30,0.06)] transition duration-200 hover:border-accent/50 hover:bg-accent/[0.08] hover:shadow-[0_0_14px_rgba(224,30,30,0.15)]"
            >
              {item}
            </span>
          ))}
        </div>
        <Link
          href={PATHS.shopVisors}
          className="btn-accent mt-8 inline-flex px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          {t("pageCta")}
        </Link>
      </div>
      <HowItWorksHome variant="page" />
    </div>
  );
}
