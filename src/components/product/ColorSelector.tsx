"use client";

import { COLOR_SWATCHES } from "@/lib/shop";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

/** Colour picker showing a swatch alongside each colour name. */
export function ColorSelector({ colors, selected, onSelect }: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const active = selected === color;
        return (
          <button
            key={color}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(color)}
            className={cn(
              "inline-flex items-center gap-2 border px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] transition-colors",
              active
                ? "border-black text-black"
                : "border-black/20 text-charcoal hover:border-black hover:text-black",
            )}
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-black/20"
              style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#b9b2a4" }}
            />
            {color}
          </button>
        );
      })}
    </div>
  );
}
