import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BookDropoffClient } from "./BookDropoffClient";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Book your drop-off | VYZR" };
}

export default async function BookDropoffPage() {
  const t = await getTranslations("Dropoff");
  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tightest text-foreground md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t("subtitle")}</p>
      <BookDropoffClient
        loadingLabel={t("loading")}
        ctaLabel={t("cta")}
        errorLabel={t("error")}
        noOrderLabel={t("noOrder")}
      />
    </section>
  );
}
