import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

export async function TrustBlocks() {
  const t = await getTranslations("Trust");

  const blocks = [
    { title: t("b1Title"), body: t("b1Body") },
    { title: t("b2Title"), body: t("b2Body") },
    { title: t("b3Title"), body: t("b3Body") },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-8 md:flex-row md:items-end">
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <Link
            href={PATHS.shopVisors}
            className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:text-foreground"
          >
            {t("link")}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 md:px-6 md:py-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
                {b.title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted md:text-sm">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
