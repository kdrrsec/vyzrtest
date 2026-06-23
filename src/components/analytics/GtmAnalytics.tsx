"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { pushDataLayer } from "@/lib/gtm";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const INACTIVE_MS = 30_000;

function useGtmPageViews() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GTM_ID) return;
    pushDataLayer({
      event: "page_view",
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);
}

/** Fires once per page when the user has no interaction for 30s (configure tags in GTM). */
function useGtmInactivity() {
  const pathname = usePathname();
  const firedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!GTM_ID) return;

    firedRef.current = false;

    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (firedRef.current) return;
        firedRef.current = true;
        pushDataLayer({
          event: "user_inactive",
          inactive_seconds: INACTIVE_MS / 1000,
          page_path: pathname,
        });
      }, INACTIVE_MS);
    };

    const onActivity = () => {
      if (firedRef.current) return;
      schedule();
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach((name) => window.addEventListener(name, onActivity, { passive: true }));
    schedule();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((name) => window.removeEventListener(name, onActivity));
    };
  }, [pathname]);
}

export function GtmAnalytics() {
  useGtmPageViews();
  useGtmInactivity();

  return null;
}
