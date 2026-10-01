import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Consistent section heading: optional eyebrow label + serif title + description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">{eyebrow}</p>
      ) : null}
      <h2 className="mt-4 text-3xl sm:text-4xl">{title}</h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-charcoal/80",
            centered ? "mx-auto max-w-xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
