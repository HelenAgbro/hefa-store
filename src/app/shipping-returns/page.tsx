import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS } from "@/lib/checkout";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "HEFA delivery timelines, shipping costs and our 14-day returns policy.",
};

const RETURN_STEPS = [
  {
    title: "Request a return",
    body: "Message us within 14 days of delivery with your order reference and the reason for the return.",
  },
  {
    title: "Pack it as you received it",
    body: "Items should be unworn, unwashed and have their tags attached. Try things on over your own clothing, not directly against skin.",
  },
  {
    title: "Send it back",
    body: "Our first return delivery within Nigeria is free. We share collection instructions once your return is approved.",
  },
  {
    title: "Refund or exchange",
    body: "After inspection we issue a refund within 5–7 business days, or exchange for another size if stock allows.",
  },
];

/** Shipping and returns policy page. */
export default function ShippingReturnsPage() {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Policies
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Shipping &amp; Returns</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
            Everything about delivery, returns and exchanges — written plainly, without the small
            print games.
          </p>
        </Container>
      </section>

      {/* Shipping */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Shipping" title="Options and timelines" />

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/20 text-left text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
                  <th className="py-3 pr-4 font-medium">Method</th>
                  <th className="py-3 pr-4 font-medium">Timeline</th>
                  <th className="py-3 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {SHIPPING_METHODS.map((method) => (
                  <tr key={method.id} className="border-b border-black/10">
                    <td className="py-4 pr-4 text-black">{method.label}</td>
                    <td className="py-4 pr-4 text-charcoal/80">{method.description}</td>
                    <td className="py-4 tabular-nums text-black">
                      {method.price === 0 ? "Free" : formatNaira(method.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-charcoal/80">
            Standard delivery within Nigeria is free on orders over{" "}
            {formatNaira(FREE_SHIPPING_THRESHOLD)}. Studio pickup is available in Lagos only.
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xl">Nigeria</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                We deliver nationwide, including Lagos, Abuja, Port Harcourt, Kano, Ibadan and Enugu.
                Orders placed before 2pm on a business day ship the same day.
              </p>
            </div>
            <div>
              <h2 className="text-xl">International</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                We ship worldwide, typically within 7–14 business days depending on the
                destination. Any duties or import taxes are the responsibility of the recipient.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Returns */}
      <Section className="border-t border-black/10">
        <Container>
          <SectionHeading
            eyebrow="Returns"
            title="14 days, no interrogation"
            description="We accept returns within 14 days of delivery, provided items are unworn, unwashed and still have their tags attached."
          />

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {RETURN_STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-black/15 pt-5">
                <p className="text-xs uppercase tracking-[0.25em] text-burnt-orange">
                  Step {index + 1}
                </p>
                <h2 className="mt-3 text-lg">{step.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Exchanges + fit feedback */}
      <section className="bg-black text-cream">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl text-cream">Size exchanges</h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/75">
                If a size does not fit, tell us within 14 days and we will exchange it for another
                size where stock allows. Any price difference is settled on the replacement order.
              </p>
            </div>
            <div>
              <h2 className="text-2xl text-cream">Fit feedback</h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/75">
                Fit is the hardest part of trousers, and we treat your feedback as data. If
                something felt off, tell us — that is how our size guide and future cuts improve.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="accent" size="lg">
              Start a return
            </Button>
            <Button href="/faq" variant="light" size="lg">
              Read the FAQ
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
