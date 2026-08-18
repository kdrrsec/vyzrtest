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
    <section className={isPage ? "pt-4 pb-12" : "py-20"}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <TitleTag className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("homeTitle")}
        </TitleTag>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("homeLead")}</p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.key} className="border-t border-black/10 pt-6">
              <p className="text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-accent [text-shadow:0_0_16px_rgba(224,30,30,0.18)] sm:text-[13px]">
                {s.title}
              </p>
              <p className="mt-4 whitespace-pre-line text-sm font-normal leading-relaxed text-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div
          id="delivery-options"
          className="mt-16 scroll-mt-28 border-t border-black/10 pt-14 md:mt-20 md:pt-16"
        >
          <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {t("deliveryTitle")}
          </h3>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
            {deliveryOptions.map((option) => (
              <article
                key={option.title}
                className="flex flex-col rounded-2xl border border-black/10 bg-black/[0.015] p-6 md:p-8"
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

        <p
          className={`mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted ${
            isPage ? "mt-10 md:mt-12" : "mt-8"
          }`}
        >
          <span className="mr-2 text-accent">✓</span>
          {t("reviewNote")}
        </p>

        {isPage ? (
          <div className="mt-10 flex justify-center md:mt-12">
            <Link
              href={PATHS.shopVisors}
              className="btn-accent inline-flex px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              {t("pageCta")}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
