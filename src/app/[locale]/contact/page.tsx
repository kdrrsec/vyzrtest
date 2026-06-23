import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("metaTitle") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="sr-only">{t("srTitle")}</h1>
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
        {t("eyebrow")}
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-14 border-t border-white/20 pt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {t("detailsTitle")}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-muted">{t("detailsBody")}</p>
        <div className="mt-8">
          <Link
            href={PATHS.faq}
            className="inline-flex rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-accent"
          >
            {t("openProduct")}
          </Link>
          <p className="mt-3 text-xs text-zinc-500">{t("ctaReplyNote")}</p>
        </div>
      </div>
    </div>
  );
}
