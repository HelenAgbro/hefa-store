import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Vertical rhythm wrapper for page sections.
 * Adds generous whitespace by default — a core part of the HEFA look.
 */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      {children}
    </section>
  );
}
