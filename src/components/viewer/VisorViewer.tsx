"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useComposedCustomizerTexture } from "@/hooks/useComposedCustomizerTexture";
import type { VisorConfigMode } from "@/lib/shopify/types";
import { VisorEngravingPreview } from "@/components/product/VisorEngravingPreview";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { ViewerErrorBoundary } from "./ViewerErrorBoundary";
import { WebGLGate } from "./WebGLGate";

const VIEWER_H = 420;

const VISOR_GLB_PATH = "/models/visor-helmet.glb";

/** First 4 bytes of a binary GLB are ASCII `glTF` (0x67 0x6C 0x54 0x46). */
function isGlbMagic(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 4) return false;
  const u = new Uint8Array(buf);
  return u[0] === 0x67 && u[1] === 0x6c && u[2] === 0x54 && u[3] === 0x46;
}

/**
 * When `NEXT_PUBLIC_VISOR_PLACEHOLDER=0`, we only use the GLB after we confirm a real
 * binary GLB is served. HEAD/200-on-HTML proxies would otherwise make `useGLTF` parse
 * HTML and throw, which R3F rethrows into the outer error boundary.
 */
async function checkVisorGlbReachable(): Promise<boolean> {
  try {
    const ranged = await fetch(VISOR_GLB_PATH, {
      method: "GET",
      cache: "no-store",
      headers: { Range: "bytes=0-3" },
    });
    if (ranged.status === 405 || ranged.status === 501) {
      const getAll = await fetch(VISOR_GLB_PATH, { method: "GET", cache: "no-store" });
      if (!getAll.ok) return false;
      return isGlbMagic(await getAll.arrayBuffer());
    }
    if (!(ranged.ok || ranged.status === 206)) return false;
    return isGlbMagic(await ranged.arrayBuffer());
  } catch {
    return false;
  }
}

function useVisorGlbAvailable(requestGlb: boolean) {
  const [glbOk, setGlbOk] = useState<boolean | null>(() => (requestGlb ? null : false));

  useEffect(() => {
    if (!requestGlb) {
      setGlbOk(false);
      return;
    }
    let cancelled = false;
    setGlbOk(null);
    checkVisorGlbReachable()
      .then((ok) => {
        if (!cancelled) {
          if (!ok && process.env.NODE_ENV === "development") {
            console.warn(
              "[VYZR 3D]",
              `${VISOR_GLB_PATH} not reachable; using placeholder mesh. Add public/models/visor-helmet.glb or unset NEXT_PUBLIC_VISOR_PLACEHOLDER.`
            );
          }
          setGlbOk(ok);
        }
      })
      .catch(() => {
        if (!cancelled) setGlbOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestGlb]);

  return glbOk;
}

function ViewerLoading() {
  const t = useTranslations("Viewer");
  return (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-black/[0.03] text-sm text-muted">
      {t("loading")}
    </div>
  );
}

const VisorScene = dynamic(
  () => import("./VisorScene").then((m) => m.VisorScene),
  {
    ssr: false,
    loading: () => <ViewerLoading />,
  }
);

type Props = {
  forcePlaceholder?: boolean;
  configMode: VisorConfigMode;
  /** When `configMode` is `standard`, applied as the decal texture (unless overridden). */
  standardTextureUrl: string | null;
};

export function VisorViewer({
  forcePlaceholder,
  configMode,
  standardTextureUrl,
}: Props) {
  const t = useTranslations("Viewer");
  const setup = useCustomizerStore((s) => s.setup);
  const uploads = useCustomizerStore((s) => s.uploads);
  const composedUrl = useComposedCustomizerTexture(setup, uploads);

  const textureUrl = useMemo(() => {
    if (configMode === "standard" && standardTextureUrl) {
      return standardTextureUrl;
    }
    if (configMode === "custom_upload") {
      return composedUrl;
    }
    return null;
  }, [configMode, standardTextureUrl, composedUrl]);

  /**
   * Default: placeholder geometry (no GLB). With NEXT_PUBLIC_VISOR_PLACEHOLDER=0, the real GLB
   * is used only after we confirm `public/models/visor-helmet.glb` is reachable (HEAD check).
   */
  const requestGlb =
    forcePlaceholder !== true &&
    process.env.NEXT_PUBLIC_VISOR_PLACEHOLDER === "0";
  const glbOk = useVisorGlbAvailable(requestGlb);
  /**
   * Custom upload / template flow: always use the parametric visor mesh so uploads and
   * previews map reliably. Typical placeholder GLBs (e.g. demos) have no `Visor_Decal` mesh.
   * `standard` products can still use a real helmet GLB when configured.
   */
  const usePlaceholder =
    configMode === "custom_upload" || !requestGlb || glbOk !== true;

  const flatPreview = (
    <div className="absolute inset-0 z-0 h-full w-full">
      <VisorEngravingPreview
        embedded
        configMode={configMode}
        standardTextureUrl={standardTextureUrl}
        composedPreviewUrl={composedUrl}
      />
    </div>
  );

  return (
    <div
      id="product-viewer"
      className="relative isolate h-[420px] w-full scroll-mt-28 overflow-hidden rounded-2xl border border-black/10 bg-white bg-gradient-to-b from-black/[0.03] to-transparent shadow-sm [contain:layout_paint]"
      style={{ minHeight: VIEWER_H }}
    >
      <WebGLGate
        pending={<ViewerLoading />}
        fallback={
          <div className="flex h-full min-h-[420px] w-full flex-col">
            <p
              className="shrink-0 border-b border-black/10 bg-white/90 px-3 py-2 text-center text-[10px] leading-snug text-muted"
              role="status"
            >
              {t("webglUnavailableTitle")}
              <span className="text-black/40"> · </span>
              <span className="text-black/55">{t("webglUnavailableHint")}</span>
            </p>
            <div className="relative min-h-0 flex-1">{flatPreview}</div>
          </div>
        }
      >
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(100%,14rem)] font-mono text-[10px] uppercase leading-relaxed tracking-widest text-muted">
          {t("hints")}
        </div>
        <ViewerErrorBoundary
          key={[configMode, usePlaceholder, textureUrl ?? ""].join("|")}
          fallback={flatPreview}
        >
          <div className="absolute inset-0 z-0 h-full w-full cursor-grab touch-none active:cursor-grabbing">
            <VisorScene
              textureUrl={textureUrl}
              usePlaceholderModel={usePlaceholder}
              placement="center"
            />
          </div>
        </ViewerErrorBoundary>
      </WebGLGate>
    </div>
  );
}
