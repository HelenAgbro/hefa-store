"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";

/** Slide-out mini-cart, available on every page. */
export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, totalItems } = useCart();

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="text-sm uppercase tracking-[0.18em]">
            Your cart{totalItems > 0 ? ` (${totalItems})` : ""}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-charcoal transition-colors hover:text-burnt-orange"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-serif text-2xl">Your cart is empty</p>
            <p className="max-w-xs text-sm leading-relaxed text-charcoal/70">
              Add a piece from the collection to get started.
            </p>
            <Button href="/shop" variant="outline" size="md" className="mt-2" onClick={closeCart}>
              Shop pants
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-black/10">
                {items.map((item) => (
                  <li key={item.id} className="py-5">
                    <CartLineItem item={item} onNavigate={closeCart} />
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-black/10 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-charcoal/70">Subtotal</span>
                <span className="tabular-nums">{formatNaira(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-charcoal/60">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button href="/checkout" size="lg" fullWidth onClick={closeCart}>
                  Checkout
                </Button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-center text-xs uppercase tracking-[0.18em] text-charcoal/70 underline underline-offset-4 transition-colors hover:text-burnt-orange"
                >
                  View cart
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
