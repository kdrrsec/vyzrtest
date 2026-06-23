/** Digits-only WhatsApp number from `NEXT_PUBLIC_WHATSAPP_NUMBER` (e.g. 31612345678). */
export function getWhatsAppNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function getWhatsAppUrl(message?: string): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  const text = message?.trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
