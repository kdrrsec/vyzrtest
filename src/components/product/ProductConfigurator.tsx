"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendlyInlineWidget } from "@/components/product/CalendlyInlineWidget";
import { CheckoutButton } from "@/components/product/CheckoutButton";
import { DesignPicker } from "@/components/product/DesignPicker";
import { OrderPriceBreakdown } from "@/components/product/OrderPriceBreakdown";
import { ProductDescription } from "@/components/product/ProductDescription";
import { ProductHeroImage } from "@/components/product/ProductHeroImage";
import { VisorFulfillmentPicker } from "@/components/product/VisorFulfillmentPicker";
import { VisorSelectField } from "@/components/product/VisorSelectField";
import { buildCustomUploadLineAttributes } from "@/lib/designUpload/lineAttributes";
import { uploadDesignsForCart } from "@/lib/designUpload/client";
import { formatMoney } from "@/lib/money";
import { slotsForSetup } from "@/lib/customizerSetup";
import { pickVariantForCustomizerSetup } from "@/lib/pickVariantForCustomizerSetup";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { getVisorById } from "@/lib/visorCatalog";
import {
  buildFulfillmentLineAttributes,
  discountedEngravingAmount,
  fulfillmentHasEngravingDiscount,
  type VisorFulfillmentId,
} from "@/lib/visorFulfillment";
import { useCustomizerStore } from "@/store/useCustomizerStore";

function firstAvailableVariant(product: ShopifyProduct) {
  return product.variants.find((v) => v.availableForSale) ?? product.variants[0] ?? null;
}

type Props = {
  product: ShopifyProduct;
  designUploadConfigured?: boolean;
};

export function ProductConfigurator({
  product,
  designUploadConfigured = true,
}: Props) {
  const t = useTranslations("Product");
  const tc = useTranslations("Customizer");
  const reset = useCustomizerStore((s) => s.reset);
  const setup = useCustomizerStore((s) => s.setup);
  const singleSide = useCustomizerStore((s) => s.singleSide);
  const uploads = useCustomizerStore((s) => s.uploads);

  const isStandard = product.visor.mode === "standard";
  const isCustomUpload = product.visor.mode === "custom_upload";

  const [fulfillment, setFulfillment] = useState<VisorFulfillmentId>("own_visor");
  const [selectedVisorId, setSelectedVisorId] = useState<string | null>(null);
  const [calendlyBooked, setCalendlyBooked] = useState(false);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_DROPOFF_URL ?? null;

  useEffect(() => {
    setSelectedVisorId(null);
    setFulfillment("own_visor");
    setCalendlyBooked(false);
  }, [product.id]);

  const onFulfillmentChange = (next: VisorFulfillmentId) => {
    setFulfillment(next);
    setSelectedVisorId(null);
    setCalendlyBooked(false);
  };

  const selectedVisor = useMemo(
    () => getVisorById(selectedVisorId),
    [selectedVisorId]
  );

  const isDropoff = fulfillment === "dropoff_visor";
  const applyVyzrSuppliesDiscount = fulfillment === "vyzr_supplies_visor";

  const variant = useMemo(() => {
    if (isCustomUpload) {
      return pickVariantForCustomizerSetup(product.variants, setup);
    }
    if (isStandard) {
      return firstAvailableVariant(product);
    }
    return firstAvailableVariant(product);
  }, [product.variants, isCustomUpload, isStandard, setup]);

  useEffect(() => {
    reset();
  }, [product.id, reset]);

  const customUploadReady = useMemo(() => {
    if (!isCustomUpload) return true;
    if (!setup) return false;
    return slotsForSetup(setup, singleSide).every((slot) => {
      const u = uploads[slot];
      return typeof u === "string" && u.trim().length > 0;
    });
  }, [isCustomUpload, setup, singleSide, uploads.left, uploads.right, uploads.top]);

  const fulfillmentLabels = useMemo(
    () => ({
      attrFulfillment: t("attrFulfillment"),
      attrFulfillmentOwn: t("attrFulfillmentOwn"),
      attrFulfillmentVyzr: t("attrFulfillmentVyzr"),
      attrFulfillmentDropoff: t("attrFulfillmentDropoff"),
      attrDropoffBooking: t("attrDropoffBooking"),
      attrHelmet: t("attrHelmet"),
      attrVisorModel: t("attrVisorModel"),
      attrVisorPrice: t("attrVisorPrice"),
    }),
    [t]
  );

  const fulfillmentReady = useMemo(() => Boolean(selectedVisor), [selectedVisor]);

  const extraCartLines = useMemo(() => {
    if (fulfillment !== "vyzr_supplies_visor" || !selectedVisor?.shopifyVariantId) {
      return undefined;
    }
    return [{ merchandiseId: selectedVisor.shopifyVariantId, quantity: 1 }];
  }, [fulfillment, selectedVisor]);

  const lineAttributes = useMemo(() => {
    if (!isStandard) return undefined;
    return buildFulfillmentLineAttributes(fulfillment, {
      selectedVisor,
      labels: fulfillmentLabels,
    });
  }, [isStandard, fulfillment, selectedVisor, fulfillmentLabels]);

  const resolveCustomLineAttributes = useCallback(async () => {
    if (!isCustomUpload || !setup) return undefined;
    const urls = await uploadDesignsForCart(setup, uploads, singleSide);
    const uploadAttrs = buildCustomUploadLineAttributes(
      setup,
      urls,
      {
        setupKey: t("attrSetup"),
        setupSummary: tc(`setupSummary_${setup}`),
        slotLeft: tc("cartSlot_left"),
        slotRight: tc("cartSlot_right"),
        slotTop: tc("cartSlot_top"),
      },
      singleSide
    );
    const fulfillmentAttrs = buildFulfillmentLineAttributes(fulfillment, {
      selectedVisor,
      labels: fulfillmentLabels,
    });
    return [...fulfillmentAttrs, ...uploadAttrs];
  }, [
    isCustomUpload,
    setup,
    singleSide,
    uploads,
    fulfillment,
    selectedVisor,
    fulfillmentLabels,
    t,
    tc,
  ]);

  const engravingPrice = useMemo(() => {
    if (!variant) return null;
    const base = variant.price.amount;
    const discounted = discountedEngravingAmount(base, fulfillment);
    const currency = variant.price.currencyCode;
    const showDiscount =
      fulfillmentHasEngravingDiscount(fulfillment) && discounted !== base;
    return {
      base,
      discounted,
      currency,
      showDiscount,
    };
  }, [variant, fulfillment]);

  const price = useMemo(() => {
    if (isCustomUpload) {
      if (setup && engravingPrice) {
        if (engravingPrice.showDiscount) {
          return formatMoney(engravingPrice.discounted, engravingPrice.currency);
        }
        return formatMoney(engravingPrice.base, engravingPrice.currency);
      }
      const priced = product.variants.filter((v) => {
        const n = Number.parseFloat(v.price.amount);
        return !Number.isNaN(n) && n >= 0;
      });
      if (priced.length) {
        const code = priced[0].price.currencyCode;
        if (priced.every((v) => v.price.currencyCode === code)) {
          const nums = priced.map((v) => Number.parseFloat(v.price.amount));
          const min = Math.min(...nums);
          const max = Math.max(...nums);
          if (min === max) {
            return formatMoney(String(min), code);
          }
          return `${formatMoney(String(min), code)} – ${formatMoney(String(max), code)}`;
        }
      }
      return formatMoney(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
      );
    }
    if (engravingPrice) {
      if (engravingPrice.showDiscount) {
        return formatMoney(engravingPrice.discounted, engravingPrice.currency);
      }
      return formatMoney(engravingPrice.base, engravingPrice.currency);
    }
    return formatMoney(
      product.priceRange.minVariantPrice.amount,
      product.priceRange.minVariantPrice.currencyCode
    );
  }, [
    isCustomUpload,
    product.variants,
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode,
    setup,
    engravingPrice,
  ]);

  const calendlySlot =
    isDropoff && selectedVisorId && calendlyUrl ? (
      <div className="border-t border-black/10 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
          {t("calendlyStepTitle")}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{t("calendlyStepHint")}</p>
        {calendlyBooked ? (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-4">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-600/40 bg-emerald-500/10 text-xs text-emerald-700"
            >
              ✓
            </span>
            <p className="text-sm text-emerald-700">{t("calendlyBooked")}</p>
          </div>
        ) : (
          <div className="mt-5">
            <CalendlyInlineWidget
              url={calendlyUrl}
              onEventScheduled={() => setCalendlyBooked(true)}
            />
          </div>
        )}
      </div>
    ) : null;

  const checkoutDisabledForCalendly = isDropoff && !!calendlyUrl && !calendlyBooked;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <ProductHeroImage product={product} />

        <div>
          <h1 className="text-4xl font-semibold tracking-tightest text-foreground md:text-5xl">
            {product.title}
          </h1>
          <div className="mt-6">
            {engravingPrice &&
            (fulfillment === "vyzr_supplies_visor" || engravingPrice.showDiscount) ? (
              <OrderPriceBreakdown
                engravingBase={engravingPrice.base}
                engravingDiscounted={engravingPrice.discounted}
                currency={engravingPrice.currency}
                showEngravingDiscount={engravingPrice.showDiscount}
                visor={fulfillment === "vyzr_supplies_visor" ? selectedVisor : null}
              />
            ) : (
              <p className="text-2xl font-light text-foreground">{price}</p>
            )}
            {isCustomUpload && !setup ? (
              <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
                {t("pricePickSetup")}
              </p>
            ) : null}
          </div>

          {isStandard ? (
            <div className="mt-8 space-y-0">
              <VisorFulfillmentPicker value={fulfillment} onChange={onFulfillmentChange} />
              <VisorSelectField
                value={selectedVisorId}
                onChange={setSelectedVisorId}
                mode={fulfillment === "vyzr_supplies_visor" ? "supply" : "own"}
                disclaimer={
                  fulfillment === "vyzr_supplies_visor" ? t("wrongVisorDisclaimer") : null
                }
              />
              {calendlySlot}
              {product.description?.trim() ? (
                <div className="border-t border-black/10 pt-8">
                  <ProductDescription html={product.description} />
                </div>
              ) : null}
            </div>
          ) : (
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {t("bullet1")}
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {t("bullet2")}
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {t("bullet3")}
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {t("bullet4")}
              </li>
            </ul>
          )}

          <div className="mt-10">
            {isCustomUpload ? (
              <button
                type="button"
                onClick={() => {
                  document.getElementById("customizer-section")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="w-full rounded-full border border-black/15 bg-black/[0.02] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-accent/60 hover:text-accent"
              >
                {t("goToCustomizer")}
              </button>
            ) : variant ? (
              <CheckoutButton
                variantId={variant.id}
                lineAttributes={lineAttributes}
                extraCartLines={extraCartLines}
                applyVyzrSuppliesDiscount={applyVyzrSuppliesDiscount}
                isDropoff={isDropoff}
                disabled={!fulfillmentReady || checkoutDisabledForCalendly}
              />
            ) : (
              <p className="text-sm text-accent">{t("unavailable")}</p>
            )}
          </div>

          {isStandard && !fulfillmentReady ? (
            <p className="mt-3 text-xs text-muted">{t("visorSelectRequired")}</p>
          ) : null}
          {isStandard && fulfillmentReady && checkoutDisabledForCalendly ? (
            <p className="mt-3 text-xs text-muted">{t("calendlyRequired")}</p>
          ) : null}

          <p className="mt-4 text-xs text-muted">{t("bagHint")}</p>
        </div>
      </div>

      {isCustomUpload ? (
        <div id="customizer-section" className="mt-16 scroll-mt-28 lg:mt-20">
          <DesignPicker
            fulfillment={fulfillment}
            onFulfillmentChange={onFulfillmentChange}
            selectedVisorId={selectedVisorId}
            onSelectedVisorIdChange={setSelectedVisorId}
            engravingPrice={engravingPrice}
            designUploadConfigured={designUploadConfigured}
            calendlySlot={calendlySlot}
            checkoutSlot={
              variant ? (
                <CheckoutButton
                  variantId={variant.id}
                  resolveLineAttributes={resolveCustomLineAttributes}
                  extraCartLines={extraCartLines}
                  applyVyzrSuppliesDiscount={applyVyzrSuppliesDiscount}
                  isDropoff={isDropoff}
                  disabled={
                    !customUploadReady ||
                    !fulfillmentReady ||
                    !designUploadConfigured ||
                    checkoutDisabledForCalendly
                  }
                  sentenceCase
                >
                  {tc("addToCartLong")}
                </CheckoutButton>
              ) : null
            }
          />
        </div>
      ) : null}

      <ProductPageTrust />
    </div>
  );
}

function ProductPageTrust() {
  const t = useTranslations("Product");

  return (
    <section className="mt-20 border-t border-black/10 pt-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-foreground">{t("trustBuyTitle")}</h2>
          <p className="mt-3 text-sm text-muted">{t("trustBuyBody")}</p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-foreground">{t("trustAfterTitle")}</h2>
          <blockquote className="mt-3 text-sm text-muted">
            &ldquo;{t("trustQuote")}&rdquo;
          </blockquote>
          <p className="mt-2 text-xs text-muted">{t("trustNote")}</p>
        </div>
      </div>
    </section>
  );
}
