"use client";

import Image from "next/image";
import { ProductSpinViewer } from "@/components/product/ProductSpinViewer";
import { PLACEHOLDER } from "@/lib/placeholders";
import type { ShopifyProduct } from "@/lib/shopify/types";

/** Product hero: optional 360° drag-to-scrub (`spinFrames`), else featured image. */
export function ProductHeroImage({ product }: { product: ShopifyProduct }) {
  const spin =
    product.spinFrames && product.spinFrames.length >= 2 ? product.spinFrames : null;
  const src = product.featuredImage?.url?.trim() || null;
  const alt = product.featuredImage?.altText?.trim() || product.title;

  return (
    <div
      id="product-viewer"
      className="relative isolate h-[420px] w-full min-h-[420px] scroll-mt-28 overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-sm"
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/[0.04] ring-1 ring-inset ring-black/10">
        {spin ? (
          <ProductSpinViewer frames={spin} alt={alt} />
        ) : (
          <>
            <Image
              src={src || PLACEHOLDER.product1}
              alt={alt}
              fill
              className="object-contain object-center p-4 md:p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </>
        )}
      </div>
    </div>
  );
}
