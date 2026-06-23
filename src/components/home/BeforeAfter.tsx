import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PLACEHOLDER } from "@/lib/placeholders";
import { PATHS } from "@/lib/routes";

export async function BeforeAfter() {
  const t = await getTranslations("BeforeAfter");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-2xl font-semibold tracking-tight text-white">{t("title")}</h2>
          <Link
            href={PATHS.shopVisors}
            className="text-xs font-mono uppercase tracking-[0.2em] text-accent hover:text-white"
          >
            {t("link")}
          </Link>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted">{t("body")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden rounded-2xl border border-white/20 bg-black">
            <Image
              src={PLACEHOLDER.before}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="relative w-full bg-black/60 px-4 py-3 text-center text-sm font-medium text-white backdrop-blur-sm">
              {t("before")}
            </div>
          </div>
          <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden rounded-2xl border border-accent/30 bg-black">
            <Image
              src={PLACEHOLDER.after}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="relative w-full border-t border-accent/20 bg-black/50 px-4 py-3 text-center text-sm font-medium text-white backdrop-blur-sm">
              {t("after")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
