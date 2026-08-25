"use client";

import { useTranslations } from "next-intl";
import type { VariantOptionGroup } from "@/lib/variantOptions";

type Props = {
  groups: VariantOptionGroup[];
  selections: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
};

export function StandardVariantPicker({ groups, selections, onSelect }: Props) {
  const t = useTranslations("Product");

  if (!groups.length) return null;

  return (
    <div className="space-y-8 border-t border-black/10 pt-8 dark:border-white/10">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
            {group.name === "Variant" ? t("variantPickerLabel") : group.name}
          </p>
          <ul className="mt-4 flex flex-col gap-2" role="listbox" aria-label={group.name}>
            {group.values.map(({ value, variant }) => {
              const selected = selections[group.name] === value;
              return (
                <li key={variant.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(group.name, value)}
                    className={
                      selected
                        ? "w-full rounded-lg border border-foreground bg-foreground px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-background transition"
                        : "w-full rounded-lg border border-black/20 bg-transparent px-4 py-3.5 text-left text-sm font-medium uppercase tracking-wide text-foreground transition hover:border-black/35 dark:border-white/20 dark:hover:border-white/35"
                    }
                  >
                    {value}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
