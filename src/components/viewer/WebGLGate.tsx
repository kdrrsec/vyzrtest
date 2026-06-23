"use client";

import { type ReactNode, useEffect, useState } from "react";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl" as "webgl")
    );
  } catch {
    return false;
  }
}

type Props = {
  /** Shown while checking (matches dynamic `VisorScene` loading state). */
  pending: ReactNode;
  /** Shown when WebGL is unavailable. */
  fallback: ReactNode;
  children: ReactNode;
};

/**
 * Avoids mounting R3F when WebGL is missing (embedded browsers, strict environments),
 * preventing a generic error boundary from masking the real issue.
 */
export function WebGLGate({ pending, fallback, children }: Props) {
  const [phase, setPhase] = useState<"pending" | "ok" | "no">("pending");

  useEffect(() => {
    setPhase(detectWebGL() ? "ok" : "no");
  }, []);

  if (phase === "pending") return <>{pending}</>;
  if (phase === "no") return <>{fallback}</>;
  return <>{children}</>;
}
