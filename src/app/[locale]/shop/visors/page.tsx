import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VisorShopShowcase } from "@/components/shop/VisorShopShowcase";
import { filterCatalogForShop } from "@/lib/catalogSplit";
import { getShopifyConfig } from "@/lib/shopify/config";
import { getVisorCatalogPage } from "@/lib/shopify/storefront";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Shop" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ShopVisorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Shop");

  let description: string | null = t("fallbackDescription");
  let products: Awaited<ReturnType<typeof getVisorCatalogPage>>["products"] = [];

  if (getShopifyConfig()) {
    try {
      const data = await getVisorCatalogPage(48);
      products = filterCatalogForShop(data.products);
      const shopDesc = data.description?.trim();
      description = shopDesc || t("fallbackDescription");
    } catch {
      products = [];
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
        {t("eyebrow")}
      </p>
      {description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      ) : null}

      {!getShopifyConfig() ? (
        <p className="mt-10 text-sm text-muted">{t("noShopify")}</p>
      ) : products.length === 0 ? (
        <p className="mt-10 text-sm text-muted">{t("noProducts")}</p>
      ) : (
        <VisorShopShowcase products={products} locale={locale} />
      )}
    </div>
  );
}
