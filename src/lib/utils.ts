import type { CSSProperties } from "react";

/**
 * Join class names, skipping any falsy values.
 *
 * A tiny helper so we can build Tailwind class strings conditionally,
 * e.g. cn("base", isActive && "text-burnt-orange").
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Repeating-line texture used as a tasteful stand-in for fabric photography
 * until real product images are added.
 */
export const SWATCH_TEXTURE: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 14px)",
};
