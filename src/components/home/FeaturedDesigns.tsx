import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { separateCustomFromShop, getCustomVisorHandle } from "@/lib/catalogSplit";
import { PLACEHOLDER } from "@/lib/placeholders";
import { DEFAULT_HANDLE, PATHS } from "@/lib/routes";

type Item = {
  title: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

export async function FeaturedDesigns({ products }: { products: Item[] }) {
  const t = await getTranslations("Featured");
  const splitCustom = separateCustomFromShop();
  const customHandle = getCustomVisorHandle();

  const fallback: Item[] = [
    {
      title: t("fallbackTitle1"),
      handle: splitCustom ? "thorns-and-roses-visor" : DEFAULT_HANDLE,
      featuredImage: { url: PLACEHOLDER.product1, altText: null },
      priceRange: { minVariantPrice: { amount: "49", currencyCode: "EUR" } },
    },
    {
      title: t("fallbackTitle2"),
      handle: splitCustom ? "thorns-and-roses-visor" : DEFAULT_HANDLE,
      featuredImage: { url: PLACEHOLDER.product2, altText: null },
      priceRange: { minVariantPrice: { amount: "49", currencyCode: "EUR" } },
    },
    {
      title: t("fallbackTitle3"),
      handle: splitCustom ? "thorns-and-roses-visor" : DEFAULT_HANDLE,
      featuredImage: { url: PLACEHOLDER.product3, altText: null },
      priceRange: { minVariantPrice: { amount: "59", currencyCode: "EUR" } },
    },
  ];

  const source = products.length ? products : fallback;
  const list = splitCustom
    ? source.filter((p) => p.handle !== customHandle)
    : source;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              {t("subtitle")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t("title")}
            </h2>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            {/* Primary action for this section: see the full range of designs */}
            <Link
              href={PATHS.shopVisors}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/15 bg-white/60 px-6 py-3 text-center text-sm font-semibold tracking-wide text-foreground transition hover:border-accent/60 hover:text-accent"
            >
              {t("cta")}
            </Link>
            {splitCustom ? (
              <Link
                href={PATHS.customVisor}
                className="font-mono text-xs uppercase tracking-[0.16em] text-muted transition hover:text-accent"
              >
                {t("ctaCustom")}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Product grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, index) => {
            const ph = [PLACEHOLDER.product1, PLACEHOLDER.product2, PLACEHOLDER.product3] as const;
            const imgUrl = p.featuredImage?.url?.trim() || ph[index % ph.length];
            const price = new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: p.priceRange.minVariantPrice.currencyCode,
              maximumFractionDigits: 0,
            }).format(Number.parseFloat(p.priceRange.minVariantPrice.amount));

            return (
              <Link
                key={`${p.handle}-${index}`}
                href={`${PATHS.product(p.handle)}#product-viewer`}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02] transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_32px_-8px_rgba(224,30,30,0.18)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-background">
                  <Image
                    src={imgUrl}
                    alt={p.featuredImage?.altText?.trim() || p.title}
                    fill
                    className="object-cover opacity-85 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {/* Corner accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full border border-accent/30 bg-background/80 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-accent backdrop-blur-sm">
                    {t("badge")}
                  </span>
                </div>

                {/* Card body */}
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="ml-4 shrink-0 font-mono text-sm font-semibold text-accent">
                    {price}
                  </p>
                </div>

                {/* Red bottom line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
