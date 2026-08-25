import { getTranslations } from "next-intl/server";

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-black/45 dark:text-white/45" aria-hidden>
      <path
        d="M3.5 7.5 12 3l8.5 4.5V16L12 21 3.5 16Z M12 3v18 M3.5 7.5 12 12l8.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-black/45 dark:text-white/45" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 10h17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-black/45 dark:text-white/45" aria-hidden>
      <path
        d="M6 7.5h10.5a4 4 0 0 1 0 8H8.5 M6 7.5 8.5 5 M6 7.5 8.5 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function BottomTrustStrip() {
  const t = await getTranslations("BottomTrust");

  const items = [
    { icon: <BoxIcon />, title: t("shippingTitle"), body: t("shippingBody") },
    { icon: <CardIcon />, title: t("paymentTitle"), body: t("paymentBody") },
    { icon: <ReturnIcon />, title: t("deliveryTitle"), body: t("deliveryBody") },
  ];

  return (
    <section className="border-t border-black/10 py-8 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="text-center lg:text-left">
              <p className="inline-flex items-center justify-center" aria-hidden>
                {item.icon}
              </p>
              <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
