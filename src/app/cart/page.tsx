import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the pieces in your HEFA cart before checkout.",
};

/**
 * Cart page.
 * The interactive contents live in the client `CartView`, which reads the
 * shared cart state (local browser state — no backend).
 */
export default function CartPage() {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Your selection
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Your Cart</h1>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <CartView />
        </Container>
      </section>
    </>
  );
}
