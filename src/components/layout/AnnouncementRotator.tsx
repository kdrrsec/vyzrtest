"use client";

import { useEffect, useState } from "react";

/** Single-line strip height (matches pre-rotator bar ~leading-tight 10px) */
const SLIDE_PX = 20;
const INTERVAL_MS = 5200;

const lineClass = "site-announce-text site-announce-text--slide";

const lineClassStatic = "site-announce-text";

type Props = {
  slideA: string;
  slideB: string;
};

export function AnnouncementRotator({ slideA, slideB }: Props) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % 2), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <p className={lineClassStatic}>
        {slideA}
        <span className="mx-2 text-white/35" aria-hidden>
          ·
        </span>
        {slideB}
      </p>
    );
  }

  const active = index === 0 ? slideA : slideB;

  return (
    <div className="relative mx-auto w-full">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {active}
      </p>
      <div
        className="overflow-hidden"
        style={{ height: SLIDE_PX }}
        aria-hidden="true"
      >
        <div
          className="flex flex-col transition-transform duration-[650ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none"
          style={{
            height: SLIDE_PX * 2,
            transform: `translateY(-${index * SLIDE_PX}px)`,
          }}
        >
          <p className={lineClass} style={{ height: SLIDE_PX }}>
            {slideA}
          </p>
          <p className={lineClass} style={{ height: SLIDE_PX }}>
            {slideB}
          </p>
        </div>
      </div>
    </div>
  );
}
