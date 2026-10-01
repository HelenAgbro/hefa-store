"use client";

import { useState, type FormEvent } from "react";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import {
  INITIAL_CHECKOUT_VALUES,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/checkout";

/**
 * Checkout experience.
 *
 * DEMO ONLY: nothing is submitted anywhere — there is no payment gateway and
 * no order is created. Validation runs entirely in the browser.
 */
export function CheckoutView() {
  const { items } = useCart();
  const [values, setValues] = useState<CheckoutValues>(INITIAL_CHECKOUT_VALUES);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  function handleChange(field: keyof CheckoutValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear the error for a field as soon as the customer edits it.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitted(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Nothing to check out yet.
  if (items.length === 0 && !submitted) {
    return <EmptyCart />;
  }

  // Demo confirmation after a valid submit.
  if (submitted) {
    return (
      <div className="mx-auto max-w-xl border border-black/10 p-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Order placed (demo)
        </p>
        <h2 className="mt-4 text-3xl">Thank you{values.firstName ? `, ${values.firstName}` : ""}.</h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
          This is a demonstration checkout — no payment was taken and no order was created. In
          production you would now receive an order confirmation by email.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/shop" size="lg">
            Continue shopping
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => setSubmitted(false)}>
            Back to checkout
          </Button>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Demo notice */}
      <p className="border border-dashed border-black/20 bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-charcoal/70">
        <strong className="font-medium text-black">Demo checkout.</strong> Payments and order
        processing are not connected yet. Nothing here will charge you or create a real order.
      </p>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
          {errorCount > 0 ? (
            <p
              role="alert"
              className="border border-burnt-orange/40 bg-burnt-orange/5 px-4 py-3 text-sm text-burnt-orange"
            >
              Please fix the {errorCount} highlighted {errorCount === 1 ? "field" : "fields"} below.
            </p>
          ) : null}

          <CheckoutForm values={values} errors={errors} subtotal={subtotal} onChange={handleChange} />

          <div className="flex flex-col gap-3">
            <Button type="submit" size="lg" fullWidth>
              Place order (demo)
            </Button>
            <p className="text-xs text-charcoal/60">
              Demo only — no order will be created and no payment will be taken.
            </p>
          </div>
        </form>

        <aside className="h-fit lg:sticky lg:top-28">
          <OrderSummary shippingMethod={values.shippingMethod} />
        </aside>
      </div>
    </div>
  );
}
