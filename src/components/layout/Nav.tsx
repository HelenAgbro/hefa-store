import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavProps {
  className?: string;
}

/**
 * Desktop primary navigation.
 * Hidden on small screens — the MobileMenu component handles those.
 */
export function Nav({ className }: NavProps) {
  return (
    <nav aria-label="Primary" className={cn("hidden items-center gap-8 lg:flex", className)}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:text-burnt-orange"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
