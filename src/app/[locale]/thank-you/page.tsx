import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ThankYou");
  return { title: t("metaTitle") };
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("ThankYou");
  const params = await searchParams;
  const isDropoff = params.dropoff === "1";

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10 text-3xl">
        ✓
      </span>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        {t("eyebrow")}
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-tightest text-foreground md:text-4xl">
        {t("title")}
      </h1>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        {isDropoff ? t("subtitleDropoff") : t("subtitleGeneral")}
      </p>

      {isDropoff ? (
        <p className="mt-3 text-xs text-muted">{t("appointmentNote")}</p>
      ) : null}

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href={PATHS.home}
          className="btn-accent inline-flex px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em]"
        >
          {t("backHome")}
        </Link>
        <Link
          href={PATHS.shopVisors}
          className="inline-flex px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted transition hover:text-foreground"
        >
          {t("browseShop")}
        </Link>
      </div>
    </section>
  );
}
