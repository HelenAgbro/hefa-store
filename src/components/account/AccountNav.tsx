"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Settings", href: "/account/settings" },
];

/** Account sidebar navigation with active-link highlighting. */
export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account"
      className="flex gap-5 overflow-x-auto border-b border-black/10 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0"
    >
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap py-3 text-sm transition-colors lg:border-b lg:border-black/10",
              active ? "text-black" : "text-charcoal/70 hover:text-black",
            )}
          >
            {item.label}
          </Link>
        );
      })}

      <Link
        href="/login"
        className="whitespace-nowrap py-3 text-xs uppercase tracking-[0.18em] text-charcoal/50 transition-colors hover:text-burnt-orange lg:mt-2 lg:border-t lg:border-black/10 lg:pt-5"
      >
        Sign out
      </Link>
    </nav>
  );
}
