import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { DEMO_PRODUCT, getDemoProductByHandle } from "@/lib/demoProduct";
import { getShopifyConfig } from "@/lib/shopify/config";
import { getProductByHandle } from "@/lib/shopify/storefront";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, handle } = await params;
  const t = await getTranslations({ locale, namespace: "Product" });
  const configured = Boolean(getShopifyConfig());
  let title = t("metaFallbackTitle");

  if (configured) {
    try {
      const p = await getProductByHandle(handle);
      if (p) title = p.title;
    } catch {
      /* ignore */
    }
  }

  return { title };
}

export default async function ProductPage({ params }: Props) {
  const { locale, handle } = await params;
  setRequestLocale(locale);
  const configured = Boolean(getShopifyConfig());

  let product = DEMO_PRODUCT;

  if (configured) {
    try {
      const p = await getProductByHandle(handle);
      if (!p) notFound();
      product = p;
    } catch {
      product = DEMO_PRODUCT;
    }
  } else {
    const demo = getDemoProductByHandle(handle);
    if (!demo) notFound();
    product = demo;
  }

  return <ProductConfigurator product={product} />;
}
