/** Google Tag Manager container ID, e.g. GTM-XXXXXXX */
export function getGtmId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!raw) return null;
  return /^GTM-[A-Z0-9]+$/i.test(raw) ? raw.toUpperCase() : null;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push a custom event or variables into GTM's dataLayer (client only). */
export function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}
