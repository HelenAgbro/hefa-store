"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

/** Pill-style size picker. Controlled by the parent. */
export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const active = selected === size;
        return (
          <button
            key={size}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(size)}
            className={cn(
              "h-11 min-w-11 border px-3 text-xs tabular-nums transition-colors",
              active
                ? "border-black bg-black text-cream"
                : "border-black/20 text-charcoal hover:border-black hover:text-black",
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
