import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

/**
 * Responsive grid of product cards.
 * 2 columns on mobile, 3 on large screens, 4 on extra-large screens.
 */
export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
