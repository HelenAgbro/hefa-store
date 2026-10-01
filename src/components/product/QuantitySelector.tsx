"use client";

import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  ariaLabel?: string;
}

/** Controlled quantity stepper with minus/plus buttons. */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  ariaLabel = "Quantity",
}: QuantitySelectorProps) {
  const buttonClass = size === "sm" ? "h-8 w-8 text-sm" : "h-11 w-11 text-base";
  const valueClass = size === "sm" ? "min-w-6 text-sm" : "min-w-8 text-base";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center border border-black/20"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "inline-flex items-center justify-center text-charcoal transition-colors hover:text-black disabled:opacity-40",
          buttonClass,
        )}
      >
        −
      </button>
      <span aria-live="polite" className={cn("text-center tabular-nums", valueClass)}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "inline-flex items-center justify-center text-charcoal transition-colors hover:text-black disabled:opacity-40",
          buttonClass,
        )}
      >
        +
      </button>
    </div>
  );
}
