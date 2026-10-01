"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Newsletter sign-up.
 *
 * DEMO ONLY: the form does not send anything anywhere. It simply shows a
 * local confirmation so the interaction can be tested. A real mailing
 * service will be connected in a later phase.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-cream">
      <Container className="border-t border-black/10 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Newsletter
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Be first to know</h2>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
            Join the HEFA list for early access to new collections, lookbooks and private sales.
          </p>

          {submitted ? (
            <p role="status" className="mt-8 text-sm text-forest">
              Thank you — you have been added to the list. (Demo only: no email was sent.)
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="h-14 w-full border border-black/20 bg-transparent px-4 text-sm text-black outline-none transition-colors placeholder:text-charcoal/50 focus:border-black"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
