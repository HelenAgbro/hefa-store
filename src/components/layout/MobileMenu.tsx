"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { BRAND, NAV_LINKS } from "@/lib/constants";

/**
 * Mobile slide-out navigation.
 * A client component because it tracks open/closed state.
 */
export function MobileMenu() {
  const { openCart } = useCart();
  const [open, setOpen] = useState(false);

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the menu when the Escape key is pressed.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-10 w-10 items-center justify-center text-black transition-colors hover:text-burnt-orange lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
          />

          <div className="absolute top-0 right-0 flex h-full w-[82%] max-w-sm flex-col bg-cream px-6 py-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.3em]">{BRAND.name}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center text-black transition-colors hover:text-burnt-orange"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-10 flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-black/10 py-4 font-serif text-2xl text-black transition-colors hover:text-burnt-orange"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8 text-xs uppercase tracking-[0.18em]">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="text-charcoal transition-colors hover:text-burnt-orange"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openCart();
                }}
                className="text-left text-charcoal transition-colors hover:text-burnt-orange"
              >
                Cart
              </button>
              <p className="pt-2 text-[0.65rem] tracking-[0.12em] text-charcoal/60">{BRAND.location}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
