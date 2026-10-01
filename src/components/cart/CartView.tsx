"use client";

import Link from "next/link";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";

/** Full cart page body: line items + order summary, or the empty state. */
export function CartView() {
  const { items, subtotal, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div className="divide-y divide-black/10 border-y border-black/10">
        {items.map((item) => (
          <div key={item.id} className="py-6">
            <CartLineItem item={item} />
          </div>
        ))}
      </div>

      <aside className="h-fit border border-black/10 p-6 lg:sticky lg:top-28">
        <h2 className="text-xl">Order summary</h2>

        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-charcoal/70">
              Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
            </dt>
            <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-charcoal/70">Shipping</dt>
            <dd className="text-charcoal/60">Calculated at checkout</dd>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-4 text-base">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
          </div>
        </dl>

        <Button href="/checkout" size="lg" fullWidth className="mt-7">
          Checkout
        </Button>

        <Link
          href="/shop"
          className="mt-4 block text-center text-xs uppercase tracking-[0.18em] text-charcoal/70 underline underline-offset-4 transition-colors hover:text-burnt-orange"
        >
          Continue shopping
        </Link>

        <button
          type="button"
          onClick={clearCart}
          className="mt-4 block w-full text-center text-xs uppercase tracking-[0.18em] text-charcoal/50 transition-colors hover:text-burnt-orange"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}
