"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

/** Horizontal pixels of drag per frame step (Upfront-style scrub). */
const PX_PER_FRAME = 5;

type Props = {
  frames: string[];
  alt: string;
};

export function ProductSpinViewer({ frames, alt }: Props) {
  const t = useTranslations("Product");
  const [index, setIndex] = useState(0);
  const drag = useRef({
    active: false,
    pointerId: -1,
    lastX: 0,
    accum: 0,
  });
  const len = frames.length;
  const src = frames[Math.min(index, len - 1)] ?? "";

  const step = useCallback(
    (delta: number) => {
      if (len < 2) return;
      setIndex((i) => (i + delta + len * 1024) % len);
    },
    [len]
  );

  useEffect(() => {
    const next = frames[(index + 1) % len];
    const prev = frames[(index - 1 + len) % len];
    if (next) {
      const a = new Image();
      a.src = next;
    }
    if (prev) {
      const b = new Image();
      b.src = prev;
    }
  }, [index, frames, len]);

  useEffect(() => {
    const end = () => {
      drag.current.active = false;
      drag.current.pointerId = -1;
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      pointerId: e.pointerId,
      lastX: e.clientX,
      accum: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    d.accum += dx;
    while (d.accum >= PX_PER_FRAME) {
      d.accum -= PX_PER_FRAME;
      step(1);
    }
    while (d.accum <= -PX_PER_FRAME) {
      d.accum += PX_PER_FRAME;
      step(-1);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drag.current.active = false;
    drag.current.pointerId = -1;
  };

  if (len < 2 || !src) return null;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <div
        className="relative flex h-full min-h-[320px] w-full cursor-ew-resize touch-none select-none md:min-h-[360px]"
        role="img"
        aria-label={alt}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Many frame URLs — avoid next/image optimizer per swap */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain object-center p-4 md:p-6"
          draggable={false}
        />
      </div>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
        {t("spinHint")}
      </p>
    </div>
  );
}
