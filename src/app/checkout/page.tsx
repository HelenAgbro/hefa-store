import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your HEFA order — customer details, shipping and order summary.",
};

/**
 * Checkout page.
 * Visual only for now: no payment gateway and no order creation.
 */
export default function CheckoutPage() {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Almost there
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Checkout</h1>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <CheckoutView />
        </Container>
      </section>
    </>
  );
}
