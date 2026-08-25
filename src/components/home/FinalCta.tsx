import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

export async function FinalCta() {
  const t = await getTranslations("FinalCta");

  return (
    <section className="bg-black/[0.02] py-16 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Short brand hook, kept brief so the section reads as a lead-in to the CTA, not a content page */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">VYZR</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
            {t("body")}
          </p>
        </div>

        {/* CTA banner: the page's closing conversion moment */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-accent/20 bg-accent/[0.04]">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/[0.08] blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col items-start gap-6 px-7 py-9 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href={PATHS.howItWorks} className="text-muted transition hover:text-accent">
                {t("linkHow")}
              </Link>
              <Link href={PATHS.faq} className="text-muted transition hover:text-accent">
                {t("linkFaq")}
              </Link>
            </div>
            <Link
              href={PATHS.customVisor}
              className="btn-accent shrink-0 inline-flex px-7 py-3.5 text-sm font-semibold tracking-wide"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
