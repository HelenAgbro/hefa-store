import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FAQS, type FaqCategory } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about fit, orders, shipping and returns at HEFA.",
};

const CATEGORIES: FaqCategory[] = [
  "Fit & Sizing",
  "Orders & Payment",
  "Shipping & Delivery",
  "Returns",
];

/** Frequently asked questions page. */
export default function FaqPage() {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Need to know
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">FAQ</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
            Common questions about fit, orders, delivery and returns. Still stuck? Send us a
            message and we will help.
          </p>
        </Container>
      </section>

      <section>
        <Container className="flex flex-col gap-12 py-10 sm:py-14">
          {CATEGORIES.map((category) => {
            const items = FAQS.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-charcoal/60">
                  {category}
                </h2>
                <div className="mt-4">
                  <Accordion items={items} />
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      <Section className="border-t border-black/10 bg-cream">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl">Still have a question?</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-charcoal/70">
              Our team replies to every message, usually within two business days.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href="/contact" size="lg">
              Contact us
            </Button>
            <Button href="/shipping-returns" variant="outline" size="lg">
              Shipping &amp; returns
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
