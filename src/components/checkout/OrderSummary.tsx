"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getShippingCost, SHIPPING_METHODS } from "@/lib/checkout";
import { formatNaira } from "@/lib/format";

interface OrderSummaryProps {
  shippingMethod: string;
}

/** Read-only order summary: line items, subtotal, shipping and total. */
export function OrderSummary({ shippingMethod }: OrderSummaryProps) {
  const { items, subtotal, totalItems } = useCart();

  const shippingCost = getShippingCost(shippingMethod, subtotal);
  const total = subtotal + shippingCost;
  const method = SHIPPING_METHODS.find((item) => item.id === shippingMethod);

  return (
    <div className="border border-black/10 p-6">
      <h2 className="text-xl">Order summary</h2>

      <ul className="mt-6 flex flex-col divide-y divide-black/10">
        {items.map((item) => {
          const image = item.product.images?.[0] ?? `/images/products/${item.product.slug}-1.jpg`;
          return (
            <li key={item.id} className="flex gap-4 py-4 first:pt-0">
              <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-charcoal">
                <Image
                  src={image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm text-black">{item.product.name}</span>
                <span className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
                  {item.color} · Size {item.size} · Qty {item.quantity}
                </span>
              </div>
              <span className="text-sm tabular-nums text-black">{formatNaira(item.lineTotal)}</span>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-6 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-charcoal/70">
            Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
          </dt>
          <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-charcoal/70">
            Shipping{method ? ` · ${method.label}` : ""}
          </dt>
          <dd className="tabular-nums">{shippingCost === 0 ? "Free" : formatNaira(shippingCost)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-black/10 pt-4 text-base">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatNaira(total)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-charcoal/60">
        Taxes, if applicable, are calculated at the next step.
      </p>
    </div>
  );
}
