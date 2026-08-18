import { getTranslations } from "next-intl/server";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export async function WhatsAppFab() {
  const t = await getTranslations("WhatsApp");
  const url = getWhatsAppUrl(t("messageGeneral"));
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_24px_rgba(37,211,102,0.35)] ring-1 ring-black/10 transition hover:scale-105 hover:shadow-[0_6px_28px_rgba(37,211,102,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:bottom-6 sm:right-6"
      aria-label={t("fabLabel")}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
