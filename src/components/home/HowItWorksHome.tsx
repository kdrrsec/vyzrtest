import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WhatsAppBookLink } from "@/components/layout/WhatsAppBookLink";
import { PATHS } from "@/lib/routes";

type Props = {
  variant?: "home" | "page";
};

export async function HowItWorksHome({ variant = "home" }: Props) {
  const t = await getTranslations("HowItWorks");
  const isPage = variant === "page";
  const TitleTag = isPage ? "h1" : "h2";

  const steps = [
    { key: "1", title: t("step1Title"), body: t("step1Body") },
    { key: "2", title: t("step2Title"), body: t("step2Body") },
    { key: "3", title: t("step3Title"), body: t("step3Body") },
  ];

  const deliveryOptions: Array<{
    title: string;
    body: string;
    highlights: string[];
    showWhatsAppBook?: boolean;
  }> = [
    {
      title: t("delivery1Title"),
      body: t("delivery1Body"),
      highlights: [
        t("delivery1Highlight1"),
        t("delivery1Highlight2"),
        t("delivery1Highlight3"),
      ],
    },
    {
      title: t("delivery2Title"),
      body: t("delivery2Body"),
      highlights: [
        t("delivery2Highlight1"),
        t("delivery2Highlight2"),
        t("delivery2Highlight3"),
      ],
      showWhatsAppBook: true,
    },
  ];

  return (
    <section className={isPage ? "pt-4 pb-12" : "bg-black/[0.02] py-24"}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <TitleTag className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("homeTitle")}
        </TitleTag>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("homeLead")}</p>

        {/* Numbered process — order → ship → engrave */}
        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-accent/30 via-black/10 to-accent/30 md:block"
            aria-hidden
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.key} className="relative flex flex-col">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-background font-mono text-sm font-semibold text-accent shadow-[0_0_0_6px_rgba(250,250,250,1)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-foreground sm:text-[13px]">
                  {s.title}
                </p>
                <p className="mt-3 whitespace-pre-line text-sm font-normal leading-relaxed text-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {isPage ? (
          <div
            id="delivery-options"
            className="mt-16 scroll-mt-28 border-t border-black/[0.08] pt-14 md:mt-20 md:pt-16"
          >
            <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {t("deliveryTitle")}
            </h3>

            <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              {deliveryOptions.map((option) => (
                <article
                  key={option.title}
                  className="flex flex-col rounded-2xl border border-black/[0.08] bg-background p-6 shadow-sm md:p-8"
                >
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
                      {option.title}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      &ldquo;{option.body}&rdquo;
                    </p>
                  </div>
                  <ul className="mt-6 space-y-2.5 border-t border-black/10 pt-6">
                    {option.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-snug text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/90" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {option.showWhatsAppBook ? <WhatsAppBookLink /> : null}
                </article>
              ))}
            </div>

            <p
              className="mt-8 rounded-2xl border border-accent/25 bg-accent/[0.06] px-5 py-4 text-center text-sm font-medium leading-relaxed text-foreground/80 shadow-[0_0_20px_-8px_rgba(224,30,30,0.15)] md:mt-10 md:px-6 md:py-5"
              role="note"
            >
              <span className="text-accent">{t("deliveryImportantLead")}:</span>{" "}
              {t("deliveryImportantBody")}
            </p>
          </div>
        ) : (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.08] pt-8">
            <p className="text-sm text-muted">
              <span className="mr-2 text-accent">✓</span>
              {t("reviewNote")}
            </p>
            <Link
              href={`${PATHS.howItWorks}#delivery-options`}
              className="text-sm font-semibold text-accent transition hover:text-foreground"
            >
              {t("deliveryTitle")} →
            </Link>
          </div>
        )}

        {isPage ? (
          <>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted md:mt-12">
              <span className="mr-2 text-accent">✓</span>
              {t("reviewNote")}
            </p>
            <div className="mt-10 flex justify-center md:mt-12">
              <Link
                href={PATHS.shopVisors}
                className="btn-accent inline-flex px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                {t("pageCta")}
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
