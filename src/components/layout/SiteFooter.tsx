import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LOGO_SRC } from "@/lib/logo";
import { PATHS } from "@/lib/routes";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");

  return (
    <footer className="mt-24 border-t border-white/[0.08]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-start md:justify-between md:px-6">
        <div>
          <Link
            href={PATHS.home}
            className="inline-block outline-none ring-offset-2 ring-offset-black focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={tNav("home")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- same asset as header; may be SVG/PNG from env */}
            <img
              src={LOGO_SRC}
              alt="VYZR"
              className="h-12 w-auto max-w-[16rem] object-contain object-left sm:h-14 md:h-16"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted">{t("tagline")}</p>
          <Link
            href={PATHS.shopVisors}
            className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent hover:text-white"
          >
            {t("shopVisor")}
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm text-muted">
          <Link href={PATHS.shopVisors} className="font-medium text-white hover:text-accent">
            {t("shop")}
          </Link>
          <Link href={PATHS.howItWorks} className="hover:text-white">
            {t("howItWorks")}
          </Link>
          <Link href={PATHS.faq} className="hover:text-white">
            {t("faq")}
          </Link>
          <Link href={PATHS.contact} className="hover:text-white">
            {t("orders")}
          </Link>
          <Link href={PATHS.legal} className="hover:text-white">
            {t("legalPolicies")}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/[0.07] py-6 text-center text-xs text-muted">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
