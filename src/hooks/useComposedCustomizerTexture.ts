"use client";

import { useEffect, useState } from "react";
import { composeVisorDesignToDataUrl } from "@/lib/composeVisorDesignTexture";
import type { CustomizerSetupId, SlotUploads } from "@/lib/customizerSetup";

export function useComposedCustomizerTexture(
  setup: CustomizerSetupId | null,
  uploads: SlotUploads
): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!setup) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    void composeVisorDesignToDataUrl(setup, uploads).then((next) => {
      if (!cancelled) setUrl(next);
    });
    return () => {
      cancelled = true;
    };
  }, [setup, uploads.left, uploads.right, uploads.top]);

  return url;
}
