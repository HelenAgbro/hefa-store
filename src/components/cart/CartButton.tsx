"use client";

import { useCart } from "@/context/CartContext";

/** Header cart icon that opens the mini-cart drawer and shows the item count. */
export function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={totalItems > 0 ? `Open cart, ${totalItems} items` : "Open cart"}
      className="relative inline-flex text-charcoal transition-colors hover:text-burnt-orange"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
        <path d="M9 7a3 3 0 0 1 6 0" strokeLinecap="round" />
      </svg>
      {totalItems > 0 ? (
        <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-burnt-orange px-1 text-[0.6rem] font-medium text-cream">
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
