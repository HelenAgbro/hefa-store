import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
}

/** Labelled textarea with an inline validation message. */
export function Textarea({ id, label, error, className, ...props }: TextareaProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/70">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full resize-y border bg-transparent px-4 py-3 text-sm text-black outline-none transition-colors placeholder:text-charcoal/40",
          error ? "border-burnt-orange" : "border-black/20 focus:border-black",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-burnt-orange">
          {error}
        </p>
      ) : null}
    </div>
  );
}
