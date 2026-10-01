import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

/** Labelled select input with an inline validation message. */
export function Select({ id, label, error, className, children, ...props }: SelectProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/70">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-12 w-full border bg-cream px-4 text-sm text-black outline-none transition-colors",
          error ? "border-burnt-orange" : "border-black/20 focus:border-black",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-burnt-orange">
          {error}
        </p>
      ) : null}
    </div>
  );
}
