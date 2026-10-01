import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getProductImages } from "@/lib/data/products";
import { formatNaira } from "@/lib/format";
import { SWATCH_TEXTURE } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

/**
 * Reusable product card used by the homepage "Featured" section, the shop
 * grid and related products. Renders the first product image when one exists,
 * and falls back to a branded colour swatch if it does not.
 */
export function ProductCard({ product }: ProductCardProps) {
  const image = getProductImages(product)[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ backgroundColor: product.swatch }}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 opacity-20" style={SWATCH_TEXTURE} />
        )}

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
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-black transition-colors group-hover:text-burnt-orange">
            {product.name}
          </h3>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
            {product.category} · {product.colors[0]}
          </p>
        </div>
        <p className="text-sm tabular-nums text-black">{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
