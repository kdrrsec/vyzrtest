import { getLegalBlocks, type LegalBlock } from "@/lib/legal-document";

function LegalBlock({ block: b }: { block: LegalBlock }) {
  switch (b.t) {
    case "hr":
      return <hr className="my-10 border-black/10 dark:border-white/10" />;
    case "h1":
      return (
        <h1 className="text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
          {b.text}
        </h1>
      );
    case "h2":
      return (
        <h2 className="mt-10 text-base font-semibold uppercase tracking-[0.12em] text-foreground md:text-lg">
          {b.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-5 text-sm font-medium uppercase tracking-[0.14em] text-foreground/90">
          {b.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{b.text}</p>
      );
    case "ul":
      return (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
          {b.items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export function LegalArticle({ locale }: { locale: string }) {
  const blocks = getLegalBlocks(locale);
  return (
    <div>
      {blocks.map((b, i) => (
        <LegalBlock key={i} block={b} />
      ))}
    </div>
  );
}
