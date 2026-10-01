"use client";

import { useState } from "react";
import { ColorSelector } from "@/components/product/ColorSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { SizeGuide } from "@/components/product/SizeGuide";
import { SizeSelector } from "@/components/product/SizeSelector";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

interface ProductPurchasePanelProps {
  product: Product;
}

/**
 * Colour, size and quantity selectors plus the "Add to cart" action.
 * Adding an item opens the mini-cart drawer (handled in CartContext).
 */
export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function handleAddToCart() {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    setError(null);
    addItem({ productId: product.id, color, size, quantity });
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Colour */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">Color</h2>
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">{color}</span>
        </div>
        <div className="mt-3">
          <ColorSelector colors={product.colors} selected={color} onSelect={setColor} />
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">Size</h2>
          <SizeGuide />
        </div>
        <div className="mt-3">
          <SizeSelector
            sizes={product.sizes}
            selected={size}
            onSelect={(value) => {
              setSize(value);
              setError(null);
            }}
          />
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-xs text-burnt-orange">
            {error}
          </p>
        ) : null}
      </div>

      {/* Quantity + add to cart */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">Quantity</span>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
        <Button
          type="button"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to cart" : "Sold out"}
        </Button>
      </div>
    </div>
  );
}
