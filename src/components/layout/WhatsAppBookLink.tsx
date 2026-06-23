import { getTranslations } from "next-intl/server";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export async function WhatsAppBookLink() {
  const t = await getTranslations("WhatsApp");
  const url = getWhatsAppUrl(t("messageDropOff"));
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5dde8a] transition hover:border-[#25D366]/60 hover:bg-[#25D366]/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:w-auto"
    >
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      {t("bookVia")}
    </a>
  );
}
