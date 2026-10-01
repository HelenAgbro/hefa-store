import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "light" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  /** Visual style. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size. Defaults to "md". */
  size?: ButtonSize;
  /** When set, renders a Next.js <Link> instead of a native <button>. */
  href?: string;
  /** Stretch to fill the parent width. */
  fullWidth?: boolean;
  className?: string;
  /** Native button attributes (ignored when `href` is set). */
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-label"?: string;
  /** Link attributes (only used when `href` is set). */
  target?: string;
  rel?: string;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 border font-medium uppercase tracking-[0.18em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border-black bg-black text-cream hover:border-charcoal hover:bg-charcoal",
  outline: "border-black bg-transparent text-black hover:bg-black hover:text-cream",
  light: "border-cream/60 bg-transparent text-cream hover:bg-cream hover:text-black",
  ghost: "border-transparent bg-transparent text-black hover:text-burnt-orange",
  accent: "border-burnt-orange bg-burnt-orange text-cream hover:border-ochre hover:bg-ochre",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.6rem]",
  md: "h-11 px-6 text-xs",
  lg: "h-14 px-8 text-xs",
};

/**
 * The single reusable button for the whole site.
 * Renders as a link when `href` is provided, otherwise a native button.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  fullWidth = false,
  className,
  type = "button",
  disabled = false,
  onClick,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
