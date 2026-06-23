import type { Metadata } from "next";
import { FeaturedDesigns } from "@/components/home/FeaturedDesigns";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorksHome } from "@/components/home/HowItWorksHome";
import { TrustBlocks } from "@/components/home/TrustBlocks";
import { filterCatalogForShop } from "@/lib/catalogSplit";
import { getShopifyConfig } from "@/lib/shopify/config";
import { getFeaturedProducts } from "@/lib/shopify/storefront";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = [];

  if (getShopifyConfig()) {
    try {
      featured = filterCatalogForShop(await getFeaturedProducts(3));
    } catch {
      featured = [];
    }
  }

  return (
    <>
      <Hero />
      <FeaturedDesigns products={featured} />
      <HowItWorksHome />
      <TrustBlocks />
      <FinalCta />
    </>
  );
}
