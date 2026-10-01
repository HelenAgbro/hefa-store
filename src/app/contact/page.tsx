import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Message the HEFA team about orders, sizing, press or wholesale.",
};

const DETAILS = [
  { label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
  { label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, "")}` },
  { label: "Studio", value: BRAND.location, href: null },
];

/** Contact page with an enquiry form and WhatsApp. */
export default function ContactPage() {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Get in touch
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Contact</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/80">
            Questions about sizing, an order, or working together? Send a message and we will reply
            within two business days.
          </p>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 py-10 sm:py-14 lg:grid-cols-2 lg:gap-20">
          {/* Form */}
          <div className="max-w-md">
            <p className="mb-6 border border-dashed border-black/20 bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-charcoal/70">
              <strong className="font-medium text-black">Demo only.</strong> Email delivery is not
              connected yet, so the form validates and confirms without sending anything.
            </p>
            <ContactForm />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-charcoal/60">
                Studio
              </h2>
              <dl className="mt-5 flex flex-col gap-4">
                {DETAILS.map((detail) => (
                  <div key={detail.label} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                    <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.18em] text-charcoal/60">
                      {detail.label}
                    </dt>
                    <dd className="text-sm text-black">
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="underline underline-offset-4 transition-colors hover:text-burnt-orange"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-black/10 p-6">
              <h2 className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-charcoal/60">
                WhatsApp
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
                Prefer to chat? Message us on WhatsApp for the quickest reply on sizing and order
                questions.
              </p>
              <Button
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
                className="mt-5"
              >
                Chat on WhatsApp
              </Button>
            </div>

            <div>
              <h2 className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-charcoal/60">
                Response times
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
                Monday to Friday, 9am–5pm WAT. Messages sent outside these hours are answered the
                next business day.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
