"use client";

import { useMemo, useState } from "react";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import {
  filterProducts,
  getFilterOptions,
  sortProducts,
  type SortKey,
} from "@/lib/shop";
import type { CategoryName, Product } from "@/lib/types";

interface ShopCatalogProps {
  products: Product[];
}

/**
 * Interactive shop catalog.
 *
 * A client component because filtering and sorting are driven by user input.
 * The product data itself is still loaded locally (no backend).
 */
export function ShopCatalog({ products }: ShopCatalogProps) {
  const options = useMemo(() => getFilterOptions(products), [products]);

  const [category, setCategory] = useState<CategoryName | "all">("all");
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  const visibleProducts = useMemo(() => {
    const filtered = filterProducts(products, { category, size, color });
    return sortProducts(filtered, sort);
  }, [products, category, size, color, sort]);

  const hasActiveFilters = category !== "all" || size !== null || color !== null;

  function clearFilters() {
    setCategory("all");
    setSize(null);
    setColor(null);
  }

  return (
    <div className="flex flex-col gap-10">
      <ShopFilters
        categories={options.categories}
        sizes={options.sizes}
        colors={options.colors}
        category={category}
        size={size}
        color={color}
        sort={sort}
        resultCount={visibleProducts.length}
        hasActiveFilters={hasActiveFilters}
        onCategoryChange={setCategory}
        onSizeChange={setSize}
        onColorChange={setColor}
        onSortChange={setSort}
        onClear={clearFilters}
      />

      {visibleProducts.length > 0 ? (
        <ProductGrid products={visibleProducts} />
      ) : (
        <ProductEmptyState onClear={clearFilters} />
      )}
    </div>
  );
}
