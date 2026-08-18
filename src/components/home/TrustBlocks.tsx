import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@/lib/routes";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" aria-hidden>
      <rect x="5" y="10.5" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function VisorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" aria-hidden>
      <path
        d="M3.5 13c0-4 4-7.5 8.5-7.5S20.5 9 20.5 13c0 1-.7 1.6-1.7 1.6H5.2c-1 0-1.7-.6-1.7-1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 14.6v1.4a1.6 1.6 0 0 0 1.6 1.6h6.8A1.6 1.6 0 0 0 17 16v-1.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" aria-hidden>
      <path
        d="M12 3.5 19 6.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function TrustBlocks() {
  const t = await getTranslations("Trust");

  const blocks = [
    { icon: <LockIcon />, title: t("b1Title"), body: t("b1Body") },
    { icon: <VisorIcon />, title: t("b2Title"), body: t("b2Body") },
    { icon: <CheckShieldIcon />, title: t("b3Title"), body: t("b3Body") },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-foreground">
            {t("title")}
          </h2>
          <Link
            href={PATHS.customVisor}
            className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:text-foreground"
          >
            {t("link")}
          </Link>
        </div>

        <div className="mt-7 grid gap-x-6 gap-y-7 sm:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.title} className="flex gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/[0.08]" aria-hidden>
                {b.icon}
              </span>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground">
                  {b.title}
                </h3>
                <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-muted">
                  {b.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
