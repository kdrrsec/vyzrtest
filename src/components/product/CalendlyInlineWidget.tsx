"use client";

import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

type Props = {
  url: string;
  onEventScheduled?: () => void;
};

const SCRIPT_URL = "https://assets.calendly.com/assets/external/widget.js";
const CSS_URL = "https://assets.calendly.com/assets/external/widget.css";

export function CalendlyInlineWidget({ url, onEventScheduled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const initWidget = useCallback(() => {
    if (!containerRef.current || initializedRef.current) return;
    if (typeof window.Calendly === "undefined") return;
    initializedRef.current = true;
    window.Calendly.initInlineWidget({
      url,
      parentElement: containerRef.current,
    });
  }, [url]);

  useEffect(() => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_URL;
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      if (window.Calendly) {
        initWidget();
      } else {
        existing.addEventListener("load", initWidget, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", initWidget, { once: true });
    document.head.appendChild(script);
  }, [initWidget]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.event === "calendly.event_scheduled") {
        onEventScheduled?.();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEventScheduled]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl"
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
