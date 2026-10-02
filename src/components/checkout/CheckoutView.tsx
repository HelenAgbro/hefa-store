"use client";

import { useActionState, useState } from "react";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import {
  getShippingCost,
  INITIAL_CHECKOUT_VALUES,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/checkout";
import { startCheckout, type CheckoutState } from "@/lib/checkout/actions";
import { formatNaira } from "@/lib/format";

const INITIAL_STATE: CheckoutState = { error: null };

/**
 * Checkout experience.
 *
 * Submitting hands the form to the startCheckout Server Action, which prices the
 * cart from the database, saves a pending order and redirects to Paystack. The
 * browser never decides a price.
 *
 * The cart travels as a hidden field, but only as product ids, colours, sizes and
 * quantities — see parseCartLines() in the action for why that is safe.
 */
export function CheckoutView() {
  const { items } = useCart();
  const [state, formAction, pending] = useActionState(startCheckout, INITIAL_STATE);

  const [values, setValues] = useState<CheckoutValues>(INITIAL_CHECKOUT_VALUES);

  /*
   * Field-level validation runs on the server, so its result arrives as part of
   * `state`. Rather than copying that into local state (which would need an
   * effect and cause an extra render pass), we track only which fields the
   * customer has edited and derive what to display.
   *
   * `edited` is reset during render whenever a new result arrives — the
   * documented way to react to a changed value without an effect.
   */
  const [lastState, setLastState] = useState(state);
  const [edited, setEdited] = useState<Set<string>>(() => new Set());

  if (state !== lastState) {
    setLastState(state);
    if (edited.size > 0) setEdited(new Set());
  }

  const errors: CheckoutErrors = {};
  for (const [field, message] of Object.entries(state.fieldErrors ?? {})) {
    if (message && !edited.has(field)) {
      errors[field as keyof CheckoutValues] = message;
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = getShippingCost(values.shippingMethod, subtotal);
  const total = subtotal + shipping;

  function handleChange(field: keyof CheckoutValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Editing a field clears its message, so the customer sees progress.
    setEdited((current) => {
      if (!current.has(field)) return current;
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }

  if (items.length === 0 && !state.error) {
    return <EmptyCart />;
  }

  const cartPayload = JSON.stringify(
    items.map((item) => ({
      productId: item.productId,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    })),
  );

  const errorCount = Object.keys(errors).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <form action={formAction} noValidate className="flex flex-col gap-10">
          {/* Identifies what was bought. No prices — those come from the database. */}
          <input type="hidden" name="cart" value={cartPayload} />

          {state.error ? (
            <p
              role="alert"
              className="border border-burnt-orange/40 bg-burnt-orange/5 px-4 py-3 text-sm text-burnt-orange"
            >
              {state.error}
            </p>
          ) : null}

          {errorCount > 0 && !state.error ? (
            <p
              role="alert"
              className="border border-burnt-orange/40 bg-burnt-orange/5 px-4 py-3 text-sm text-burnt-orange"
            >
              Please fix the {errorCount} highlighted {errorCount === 1 ? "field" : "fields"} below.
            </p>
          ) : null}

          <CheckoutForm values={values} errors={errors} subtotal={subtotal} onChange={handleChange} />

          <div className="flex flex-col gap-3">
            <Button type="submit" size="lg" fullWidth disabled={pending || items.length === 0}>
              {pending ? "Taking you to payment…" : `Pay ${formatNaira(total)}`}
            </Button>
            <p className="text-xs text-charcoal/60">
              You will be taken to Paystack to pay by card, bank transfer or USSD. Card details are
              entered on Paystack&apos;s secure page — they never reach this site.
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
