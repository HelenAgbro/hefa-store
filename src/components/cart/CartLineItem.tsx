"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCart, type CartItem } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";

interface CartLineItemProps {
  item: CartItem;
  /** Called before navigating (used to close the drawer). */
  onNavigate?: () => void;
}

/** A single cart line — reused by both the mini-cart drawer and the cart page. */
export function CartLineItem({ item, onNavigate }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const image = item.product.images?.[0] ?? `/images/products/${item.product.slug}-1.svg`;

  return (
    <div className="flex gap-4">
      <Link
        href={`/product/${item.product.slug}`}
        onClick={onNavigate}
        className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-charcoal"
      >
        <Image src={image} alt={item.product.name} fill className="object-cover" sizes="80px" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/product/${item.product.slug}`}
            onClick={onNavigate}
            className="text-sm font-medium text-black transition-colors hover:text-burnt-orange"
          >
            {item.product.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.product.name} from cart`}
            className="text-charcoal/60 transition-colors hover:text-burnt-orange"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
          {item.color} · Size {item.size}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
            size="sm"
            ariaLabel={`Quantity for ${item.product.name}`}
          />
          <span className="text-sm tabular-nums text-black">{formatNaira(item.lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
