type Props = {
  html: string;
};

/** Renders Shopify product description HTML on the dark product page. */
export function ProductDescription({ html }: Props) {
  const trimmed = html?.trim();
  if (!trimmed) return null;

  return (
    <div
      className="product-description text-sm leading-relaxed text-zinc-300 [&_a]:text-accent [&_a]:underline [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
}
