"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { OrderPriceBreakdown } from "@/components/product/OrderPriceBreakdown";
import { VisorFulfillmentPicker } from "@/components/product/VisorFulfillmentPicker";
import { VisorSelectField } from "@/components/product/VisorSelectField";
import { getVisorById } from "@/lib/visorCatalog";
import type { CustomizerSetupId, SingleSide, VisorSlotId } from "@/lib/customizerSetup";
import { SETUP_PRICES_EUR, slotsForSetup } from "@/lib/customizerSetup";
import type { VisorFulfillmentId } from "@/lib/visorFulfillment";
import { useCustomizerStore } from "@/store/useCustomizerStore";

const SETUPS: CustomizerSetupId[] = ["single", "double", "full"];

const ACCEPT_IMAGES = "image/png,image/jpeg,image/jpg,image/svg+xml";

type EngravingPrice = {
  base: string;
  discounted: string;
  currency: string;
  showDiscount: boolean;
};

type DesignPickerProps = {
  fulfillment: VisorFulfillmentId;
  onFulfillmentChange: (value: VisorFulfillmentId) => void;
  selectedVisorId: string | null;
  onSelectedVisorIdChange: (id: string | null) => void;
  engravingPrice: EngravingPrice | null;
  designUploadConfigured?: boolean;
  calendlySlot?: ReactNode;
  checkoutSlot?: ReactNode;
};

function SlotSection({
  slot,
  title,
  hint,
  value,
  onFile,
  disabled,
}: {
  slot: VisorSlotId;
  title: string;
  hint: string;
  value: string | null;
  onFile: (slot: VisorSlotId, file: File | null) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Customizer");
  const inputId = `visor-upload-${slot}`;
  return (
    <section className="rounded-2xl border border-black/10 bg-black/[0.015] p-6 dark:border-white/10 dark:bg-white/[0.02] md:p-8">
      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-xs text-muted">{hint}</p>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <label htmlFor={inputId} className="block shrink-0">
          <span className="sr-only">{title}</span>
          <input
            id={inputId}
            type="file"
            accept={ACCEPT_IMAGES}
            disabled={disabled}
            className="block w-full max-w-xs cursor-pointer text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2.5 file:text-[11px] file:font-semibold file:uppercase file:tracking-wider file:text-background hover:file:bg-accent hover:file:text-white disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              onFile(slot, f);
              e.target.value = "";
            }}
          />
        </label>
        {value ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL from customer */}
            <img src={value} alt="" className="h-full w-full object-contain" />
          </div>
        ) : null}
      </div>
      {value ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p
            className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400"
            role="status"
            aria-live="polite"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-600/40 bg-emerald-500/10 text-xs leading-none text-emerald-700 dark:text-emerald-400"
              aria-hidden
            >
              ✓
            </span>
            <span>{t("slotDesignAdded")}</span>
          </p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onFile(slot, null)}
            className="text-xs font-medium text-muted underline-offset-4 transition hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("slotDesignRemove")}
          </button>
        </div>
      ) : null}
    </section>
  );
}

/** Position-based customizer (custom_upload products). */
export function DesignPicker({
  fulfillment,
  onFulfillmentChange,
  selectedVisorId,
  onSelectedVisorIdChange,
  engravingPrice,
  designUploadConfigured = true,
  calendlySlot,
  checkoutSlot,
}: DesignPickerProps) {
  const t = useTranslations("Customizer");
  const tp = useTranslations("Product");

  const setup = useCustomizerStore((s) => s.setup);
  const singleSide = useCustomizerStore((s) => s.singleSide);
  const uploads = useCustomizerStore((s) => s.uploads);
  const setSetup = useCustomizerStore((s) => s.setSetup);
  const setSingleSide = useCustomizerStore((s) => s.setSingleSide);
  const setSlotUpload = useCustomizerStore((s) => s.setSlotUpload);

  const selectedVisor = useMemo(() => getVisorById(selectedVisorId), [selectedVisorId]);
  const visorSelectMode = fulfillment === "vyzr_supplies_visor" ? "supply" : "own";

  const onSlotFile = (slot: VisorSlotId, file: File | null) => {
    if (!designUploadConfigured) return;
    if (!file) {
      setSlotUpload(slot, null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") setSlotUpload(slot, r);
    };
    reader.readAsDataURL(file);
  };

  const slotTitle = (id: VisorSlotId) =>
    id === "left" ? t("slotLeftTitle") : id === "right" ? t("slotRightTitle") : t("slotTopTitle");
  const slotHint = (id: VisorSlotId) =>
    id === "left" ? t("slotLeftHint") : id === "right" ? t("slotRightHint") : t("slotTopHint");

  return (
    <div className="space-y-14 border-t border-black/10 pt-14 dark:border-white/10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">{t("kicker")}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("lead")}</p>
      </header>

      <VisorFulfillmentPicker value={fulfillment} onChange={onFulfillmentChange} />

      {/* Step 1 — setup */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tabular-nums text-foreground/40">01</span>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">{t("step1Title")}</h3>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SETUPS.map((id) => {
            const active = setup === id;
            const popular = id === "double";
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSetup(id)}
                className={`group relative flex flex-col rounded-2xl border px-5 py-6 text-left transition-all duration-200 md:min-h-[9.5rem] ${
                  active
                    ? "border-accent bg-accent/[0.08] shadow-[0_0_0_1px_rgba(224,30,30,0.35),0_4px_24px_-4px_rgba(224,30,30,0.15)]"
                    : "border-black/15 bg-black/[0.02] hover:border-black/25 hover:bg-black/[0.04] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] cursor-pointer dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-white/25 dark:hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200 ${
                    active
                      ? "border-accent bg-accent shadow-[0_0_8px_rgba(224,30,30,0.4)]"
                      : "border-black/20 group-hover:border-black/35 dark:border-white/20 dark:group-hover:border-white/35"
                  }`}
                >
                  {active ? <span className="block h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>

                {popular ? (
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/25 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/90 shadow-[0_0_0_1px_rgba(224,30,30,0.08),0_0_12px_-2px_rgba(224,30,30,0.15)] backdrop-blur-[2px] dark:bg-black">
                    {t("badgePopular")}
                  </span>
                ) : null}
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {t(`setupName_${id}`)}
                </span>
                <span
                  className={`mt-3 text-2xl font-semibold tabular-nums transition-colors ${active ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}
                >
                  €{SETUP_PRICES_EUR[id]}
                </span>
                <span className="mt-2 text-xs leading-relaxed text-muted">{t(`setupDesc_${id}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {setup === "single" ? (
        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">{t("singleSideTitle")}</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">{t("singleSideHint")}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-xs">
            {(["left", "right"] as SingleSide[]).map((side) => {
              const active = singleSide === side;
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => setSingleSide(side)}
                  className={`group relative flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "border-accent bg-accent/[0.08] text-foreground shadow-[0_0_0_1px_rgba(224,30,30,0.35)]"
                      : "border-black/15 bg-black/[0.02] text-foreground/60 hover:border-black/25 hover:bg-black/[0.04] hover:text-foreground cursor-pointer dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-white/25 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      active ? "border-accent bg-accent" : "border-black/25 group-hover:border-black/40 dark:border-white/25 dark:group-hover:border-white/40"
                    }`}
                  >
                    {active ? <span className="block h-1 w-1 rounded-full bg-white" /> : null}
                  </span>
                  {t(side === "left" ? "singleSideLeft" : "singleSideRight")}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Step 2 — upload designs (always visible so customers see this step exists; locked until a setup is picked) */}
      <div className="space-y-8">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tabular-nums text-foreground/40">02</span>
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground">{t("step2Title")}</h3>
        </div>
        {setup ? (
          <>
            <p className="max-w-2xl text-sm text-muted">{t("step2Lead")}</p>
            {!designUploadConfigured ? (
              <p
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300"
                role="note"
              >
                {tp("uploadNotConfigured")}
              </p>
            ) : null}
            <div className="space-y-10">
              {slotsForSetup(setup, singleSide).map((slot) => (
                <SlotSection
                  key={slot}
                  slot={slot}
                  title={slotTitle(slot)}
                  hint={slotHint(slot)}
                  value={uploads[slot]}
                  onFile={onSlotFile}
                  disabled={!designUploadConfigured}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-black/15 bg-black/[0.015] px-6 py-8 text-sm text-muted dark:border-white/15 dark:bg-white/[0.02]">
            {t("lockedHint")}
          </p>
        )}
      </div>

      <div className="space-y-0">
        <VisorSelectField
          value={selectedVisorId}
          onChange={(id) => onSelectedVisorIdChange(id)}
          mode={visorSelectMode}
          disclaimer={fulfillment === "vyzr_supplies_visor" ? tp("wrongVisorDisclaimer") : null}
        />
        {calendlySlot}
      </div>

      {engravingPrice?.showDiscount ? (
        <OrderPriceBreakdown
          engravingBase={engravingPrice.base}
          engravingDiscounted={engravingPrice.discounted}
          currency={engravingPrice.currency}
          showEngravingDiscount={engravingPrice.showDiscount}
          visor={fulfillment === "vyzr_supplies_visor" ? selectedVisor : null}
        />
      ) : null}

      {/* Step 3 — checkout (always visible so customers see the destination; locked until a setup is picked) */}
      <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-6 dark:border-white/10 dark:bg-white/[0.03] md:px-8 md:py-7">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs tabular-nums text-foreground/40">03</span>
              <h3 className="text-sm font-medium normal-case tracking-[0.14em] text-foreground">
                {t("step3Title")}
              </h3>
            </div>
            {setup ? (
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
                  {t("notePreview")}
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
                  {t("noteReview")}
                </li>
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">{t("lockedHint")}</p>
            )}
          </div>
          {setup && checkoutSlot ? (
            <div className="w-full shrink-0 md:w-auto md:max-w-sm md:min-w-[16rem]">{checkoutSlot}</div>
          ) : (
            <div
              className="w-full shrink-0 rounded-full border border-black/10 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-muted opacity-50 dark:border-white/10 md:w-auto md:max-w-sm md:min-w-[16rem]"
              aria-hidden
            >
              {t("addToCartLong")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
