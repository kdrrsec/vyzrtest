import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

export async function FinalCta() {
  const t = await getTranslations("FinalCta");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Main CTA banner */}
        <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-white/[0.03]">
          {/* Accent glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/[0.06] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-96 rounded-full bg-accent/[0.04] blur-2xl"
            aria-hidden
          />

          <div className="relative px-7 py-12 md:px-12 md:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              VYZR
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted">
              {t("body")}
            </p>

            {/* Feature blocks */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { title: t("h3_1"), body: t("h3_1Body") },
                { title: t("h3_2"), body: t("h3_2Body") },
                { title: t("h3_3"), body: t("h3_3Body") },
              ].map((block) => (
                <div
                  key={block.title}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-5"
                >
                  <div className="mb-3 h-0.5 w-6 bg-accent/70" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                    {block.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{block.body}</p>
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href={PATHS.customVisor} className="text-muted transition hover:text-accent">
                  {t("linkCustomize")}
                </Link>
                <Link href={PATHS.howItWorks} className="text-muted transition hover:text-accent">
                  {t("linkHow")}
                </Link>
                <Link href={PATHS.faq} className="text-muted transition hover:text-accent">
                  {t("linkFaq")}
                </Link>
              </div>
              <Link
                href={PATHS.shopVisors}
                className="btn-accent shrink-0 inline-flex px-7 py-3.5 text-sm font-semibold tracking-wide"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
