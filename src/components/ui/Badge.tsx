import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "accent" | "light";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONES: Record<BadgeTone, string> = {
  default: "bg-black text-cream",
  accent: "bg-burnt-orange text-cream",
  light: "bg-cream text-black",
};

/** Small reusable label, e.g. "New" or "Best seller". */
export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
