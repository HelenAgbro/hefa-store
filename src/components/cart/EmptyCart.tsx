import { Button } from "@/components/ui/Button";

/** Shown when the cart (or a filtered view) has no items. */
export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-black/20 px-6 py-20 text-center">
      <span className="font-serif text-3xl">Your cart is empty</span>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/70">
        Nothing here yet. Discover the debut collection and add your first piece.
      </p>
      <Button href="/shop" size="lg" className="mt-8">
        Shop pants
      </Button>
    </div>
  );
}
