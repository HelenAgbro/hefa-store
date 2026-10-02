import type { Metadata } from "next";
import { CheckoutResult } from "@/components/checkout/CheckoutResult";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Payment result",
  description: "The result of your HEFA payment.",
  robots: { index: false, follow: false },
};

/**
 * Where Paystack returns the customer after paying.
 *
 * The redirect itself proves nothing — anyone can visit this URL — so the page
 * asks Paystack directly (server-side) whether the transaction genuinely
 * succeeded before showing a confirmation. Confirmation emails will still be
 * driven by the webhook, which is the stronger signal.
 */
export default async function CheckoutVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Payment
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Order status</h1>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <CheckoutResult reference={reference ?? null} />
        </Container>
      </section>
    </>
  );
}