"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  loadingLabel: string;
  ctaLabel: string;
  errorLabel: string;
  noOrderLabel: string;
};

export function BookDropoffClient({
  loadingLabel,
  ctaLabel,
  errorLabel,
  noOrderLabel,
}: Props) {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const orderName = params.get("order_name") ?? orderId ?? "";
  const email = params.get("email") ?? undefined;

  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch("/api/calendly-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, orderName, email }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.bookingUrl) throw new Error(data.error ?? "error");
        setBookingUrl(data.bookingUrl);
      })
      .catch(() => setError(errorLabel))
      .finally(() => setLoading(false));
  }, [orderId, orderName, email, errorLabel]);

  if (!orderId) {
    return (
      <p className="mt-8 text-sm text-muted">{noOrderLabel}</p>
    );
  }

  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
        <span className="ml-3 text-sm text-muted">{loadingLabel}</span>
      </div>
    );
  }

  if (error) {
    return <p className="mt-8 text-sm text-accent">{error}</p>;
  }

  return (
    <div className="mt-10">
      <a
        href={bookingUrl!}
        target="_blank"
        rel="noreferrer"
        className="btn-accent inline-flex px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em]"
      >
        {ctaLabel}
      </a>
      <p className="mt-4 text-xs text-muted">
        This link is personal and can only be used once.
      </p>
    </div>
  );
}
