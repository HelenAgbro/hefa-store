import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/format";
import { SWATCH_TEXTURE } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

/**
 * Reusable product card. Used by the homepage "Featured" section now,
 * and reused by the shop grid in a later step.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ backgroundColor: product.swatch }}
      >
        <div
          className="absolute inset-0 opacity-20 transition-transform duration-500 group-hover:scale-105"
          style={SWATCH_TEXTURE}
        />

        {product.badge ? (
          <div className="absolute top-4 left-4 z-10">
            <Badge tone="light">{product.badge}</Badge>
          </div>
        ) : null}

        {!product.inStock ? (
          <div className="absolute top-4 right-4 z-10">
            <Badge tone="default">Sold out</Badge>
          </div>
        ) : null}

        <span className="absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-[0.18em] text-cream/70">
          {product.colors[0]}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-black transition-colors group-hover:text-burnt-orange">
            {product.name}
          </h3>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
            {product.category}
          </p>
        </div>
        <p className="text-sm tabular-nums text-black">{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
