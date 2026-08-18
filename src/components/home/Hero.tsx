import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { separateCustomFromShop } from "@/lib/catalogSplit";
import { getHeroMedia } from "@/lib/heroMedia";
import { PATHS } from "@/lib/routes";

export async function Hero() {
  const t = await getTranslations("Home");
  const media = getHeroMedia();
  const splitCustom = separateCustomFromShop();

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="relative min-h-[min(80vh,740px)] w-full sm:min-h-[min(86vh,800px)]">
        {/* Background media */}
        {media.kind === "video" ? (
          <video
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.poster}
            aria-label={t("heroImageAlt")}
          >
            <source src={media.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={media.src}
            alt={t("heroImageAlt")}
            fill
            className="object-cover object-center opacity-90"
            sizes="100vw"
            priority
          />
        )}

        {/* Gunmetal gradient overlays */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-background/5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
          aria-hidden
        />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-20 sm:px-8 md:pb-16 lg:px-10">
          <div className="max-w-2xl text-left">
            {/* Eyebrow */}
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
              {t("heroEyebrow")}
            </p>

            {/* Headline */}
            <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tightest text-foreground md:text-6xl lg:text-7xl">
              {t("heroTitle")}
            </h1>

            {/* Lead */}
            <p className="mt-4 max-w-sm font-mono text-xs leading-relaxed tracking-[0.1em] text-muted">
              {t("heroMeta")}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {splitCustom ? (
                <>
                  <Link
                    href={PATHS.customVisor}
                    className="btn-accent inline-flex px-8 py-4 text-sm font-semibold tracking-wide"
                  >
                    {t("heroCtaCustom")}
                  </Link>
                  <Link
                    href={PATHS.shopVisors}
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-8 py-4 text-sm font-semibold tracking-wide text-foreground backdrop-blur-sm transition hover:border-accent/60 hover:text-accent"
                  >
                    {t("heroCtaShop")}
                  </Link>
                </>
              ) : (
                <Link
                  href={PATHS.shopVisors}
                  className="btn-accent inline-flex px-8 py-4 text-sm font-semibold tracking-wide"
                >
                  {t("heroCta")}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom accent rule */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent/40 via-accent/10 to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
