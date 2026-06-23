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
    <div className="space-y-8 border-t border-white/20 pt-8">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
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
                        ? "w-full rounded-lg border border-white bg-white px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-black transition"
                        : "w-full rounded-lg border border-white/25 bg-transparent px-4 py-3.5 text-left text-sm font-medium uppercase tracking-wide text-white transition hover:border-white/45"
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
