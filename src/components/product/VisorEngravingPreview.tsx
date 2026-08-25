"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { VisorConfigMode } from "@/lib/shopify/types";

const VIEWER_H = 420;

type Props = {
  configMode: VisorConfigMode;
  /** Shopify / metafield preview for `standard` products */
  standardTextureUrl: string | null;
  /** `custom_upload`: composed atlas from per-slot uploads + setup */
  composedPreviewUrl: string | null;
  /** Inside `VisorViewer` error fallback: no border/id (parent supplies chrome). */
  embedded?: boolean;
};

function nonEmpty(s: string | null | undefined): string | null {
  const t = typeof s === "string" ? s.trim() : "";
  return t.length > 0 ? t : null;
}

/**
 * Lightweight “fake 3D” preview: helmet illustration + design clipped to the visor band.
 * For custom uploads, `composedPreviewUrl` matches the 3D atlas built from left / top / right slots.
 */
export function VisorEngravingPreview({
  configMode,
  standardTextureUrl,
  composedPreviewUrl,
  embedded = false,
}: Props) {
  const t = useTranslations("EngravingPreview");

  const designSrc = useMemo(() => {
    if (configMode === "standard") {
      return nonEmpty(standardTextureUrl);
    }
    return nonEmpty(composedPreviewUrl);
  }, [configMode, standardTextureUrl, composedPreviewUrl]);

  const shellClass = embedded
    ? "relative isolate h-full min-h-[420px] w-full overflow-hidden bg-white bg-gradient-to-b from-black/[0.03] to-transparent dark:bg-black dark:from-white/[0.03]"
    : "relative isolate h-[420px] w-full scroll-mt-28 overflow-hidden rounded-2xl border border-black/10 bg-white bg-gradient-to-b from-black/[0.03] to-transparent shadow-sm dark:border-white/10 dark:bg-black dark:from-white/[0.03]";

  return (
    <div
      {...(embedded ? {} : { id: "product-viewer" })}
      className={shellClass}
      style={embedded ? undefined : { minHeight: VIEWER_H }}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(100%,14rem)] font-mono text-[10px] uppercase leading-relaxed tracking-widest text-muted">
        {t("hints")}
      </div>

      <div className="flex h-full w-full items-center justify-center px-4 pb-6 pt-10">
        <div className="relative w-full max-w-[min(100%,380px)] translate-y-1">
          <HelmetGraphic className="relative z-10 h-auto w-full drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)]" />

          <div
            className="absolute left-[11%] right-[11%] top-[51%] z-20 flex h-[22%] -translate-y-1/2 items-center justify-center overflow-hidden rounded-[50%] bg-black/40 [clip-path:ellipse(50%_48%_at_50%_50%)]"
            aria-hidden={!designSrc}
          >
            {designSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL composite
              <img
                src={designSrc}
                alt=""
                className="h-[135%] w-[135%] max-w-none object-contain object-center opacity-[0.92] grayscale contrast-125 [mix-blend-mode:soft-light]"
              />
            ) : null}
          </div>

          <div
            className="pointer-events-none absolute left-[11%] right-[11%] top-[51%] z-30 h-[22%] -translate-y-1/2 rounded-[50%] [clip-path:ellipse(50%_48%_at_50%_50%)] [box-shadow:inset_0_0_28px_rgba(0,0,0,0.65),inset_0_-2px_12px_rgba(255,255,255,0.07)]"
            aria-hidden
          />
        </div>

        {!designSrc ? (
          <p className="pointer-events-none absolute bottom-6 left-1/2 z-40 w-[min(100%,20rem)] -translate-x-1/2 text-center text-xs text-muted">
            {configMode === "standard" ? t("emptyStandard") : t("empty")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function HelmetGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#0a0a0a"
        d="M160 22c-98 0-124 74-124 146v6l34-16c28-12 62-18 90-18s62 6 90 18l34 16v-6c0-72-26-146-124-146Z"
      />
      <path
        fill="#0a0a0a"
        d="M73 226c40 48 134 48 174 0l20 18c-48 58-166 58-214 0l20-18Z"
      />
      <path fill="#101010" d="M78 232c36 40 128 40 164 0l8 10c-36 34-144 34-180 0l8-10Z" />
      <ellipse
        cx="160"
        cy="198"
        rx="84"
        ry="40"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={2}
        fill="none"
      />
      <path
        stroke="rgba(255,255,255,0.09)"
        strokeWidth={1.2}
        d="M92 194c26-24 56-34 68-34s42 10 68 34"
      />
      <ellipse
        cx="250"
        cy="128"
        rx="8"
        ry="11"
        fill="rgba(255,255,255,0.06)"
        transform="rotate(-12 250 128)"
      />
    </svg>
  );
}
