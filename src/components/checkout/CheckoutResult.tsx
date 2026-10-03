import { ClearCartOnSuccess } from "@/components/checkout/ClearCart";
import { Button } from "@/components/ui/Button";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { formatNaira } from "@/lib/format";
import { markPaid, getOrderByReference } from "@/lib/orders/repository";
import { verifyTransaction } from "@/lib/paystack/client";
import { isEmailDeliverableToCustomers } from "@/lib/supabase/config";
import type { Order } from "@/lib/types";

/**
 * Confirms (or denies) a payment by asking Paystack what actually happened.
 *
 * The customer arrives here by following a redirect, which proves nothing — the
 * URL could have been typed by hand. So this component:
 *
 *   1. loads our own order (the amount we expected)
 *   2. asks Paystack whether the transaction succeeded, and for how much
 *   3. refuses to confirm if the two amounts disagree
 *   4. marks the order paid, which is safe to repeat
 *
 * Step 4 is a convenience, not the source of truth: the webhook does the same
 * thing independently, and markPaid() only ever moves an order that is still
 * pending. So if the webhook is unreachable — which it is on localhost without a
 * tunnel — the order is still marked correctly here.
 */
export async function CheckoutResult({ reference }: { reference: string | null }) {
  if (!reference) {
    return (
      <Shell
        heading="We could not find your order"
        body="This page opens automatically after payment. If you have just paid, contact us with the reference you were given and we will look it up."
      />
    );
  }

  // Our record of what was expected.
  let order: Order | null = null;
  try {
    order = await getOrderByReference(reference);
  } catch (error) {
    console.error("[checkout] Could not load the order:", error);
  }

  if (!order) {
    return (
      <Shell
        heading="We could not find that order"
        body="Check the reference you were given, or contact us with the email address you used and we will look it up."
      />
    );
  }

  // Paystack's own record of what happened.
  let status: string;
  let chargedNaira: number;

  try {
    const transaction = await verifyTransaction(reference);
    status = transaction.status;
    chargedNaira = transaction.amountNaira;
  } catch (error) {
    console.error("[checkout] Could not verify with Paystack:", error);
    return (
      <Shell
        heading="We could not confirm your payment yet"
        body={
          isEmailDeliverableToCustomers
            ? "We are checking with our payment provider. Your order is safe — if the payment went through you will receive a confirmation email shortly. Please do not pay again."
            : "We are checking with our payment provider. Your order is safe — note your reference and contact us if you do not hear from us. Please do not pay again."
        }
      />
    );
  }

  if (status !== "success") {
    return (
      <Shell
        heading="Your payment was not completed"
        body={
          status === "abandoned"
            ? "You closed the payment window before finishing. Nothing was charged."
            : "The payment did not go through and nothing was charged."
        }
      />
    );
  }

  // A successful charge for the wrong amount means something is wrong upstream.
  // Never confirm it — and never let it count as revenue.
  if (chargedNaira !== order.total) {
    console.error(
      `[checkout] Amount mismatch on ${order.reference}: expected ${order.total}, charged ${chargedNaira}`,
    );
    return (
      <Shell
        heading="We need to check this payment"
        body="The amount paid does not match this order. We have not confirmed it automatically — our team will be in touch shortly, and nothing further is needed from you."
      />
    );
  }

  // Safe to repeat: only a still-pending order is moved, so exactly one caller —
  // here or the webhook, whichever arrives first — sees newlyPaid. That flag is
  // what stops one purchase sending two receipts.
  const { newlyPaid } = await markPaid(order.reference, reference);

  // Best-effort. The payment is already confirmed, so a mail failure must not
  // change what the customer is told.
  if (newlyPaid) {
    const email = await sendOrderConfirmation(order);
    if (!email.sent) {
      console.warn(`[checkout] Receipt for ${order.reference} not sent: ${email.skippedReason}`);
    }
  }

  return <Success order={order} />;
}

/** The confirmed-payment receipt. */
function Success({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-2xl">
      <ClearCartOnSuccess />

      <div className="border border-black/10 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Payment received
        </p>
        <h2 className="mt-4 text-3xl">Thank you, we have your order.</h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
          {isEmailDeliverableToCustomers ? (
            <>
              A confirmation email is on its way to{" "}
              <strong className="font-medium text-black">{order.email}</strong>. Keep your
              reference for any questions about this order.
            </>
          ) : (
            <>
              Confirmation emails are not switched on yet, so please keep this page or note your
              reference — it is how we will find your order.
            </>
          )}
        </p>

        <dl className="mt-8 grid gap-4 border-y border-black/10 py-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-charcoal/50">Reference</dt>
            <dd className="mt-1 font-medium text-black">{order.reference}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-charcoal/50">Status</dt>
            <dd className="mt-1 font-medium text-black">Paid</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-charcoal/50">Delivering to</dt>
            <dd className="mt-1 text-black">
              {order.city}, {order.region}
              <span className="block text-charcoal/70">{order.address1}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-charcoal/50">Shipping</dt>
            <dd className="mt-1 text-black">{order.shippingLabel}</dd>
          </div>
        </dl>

        <ul className="mt-6 flex flex-col gap-3 text-sm">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex justify-between gap-4"
            >
              <span className="text-charcoal/80">
                {item.productName}
                <span className="text-charcoal/60">
                  {item.color ? ` · ${item.color}` : ""}
                  {item.size ? ` · ${item.size}` : ""} ×{item.quantity}
                </span>
              </span>
              <span className="tabular-nums text-black">{formatNaira(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm">
          <Row label="Subtotal" value={formatNaira(order.subtotal)} />
          <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatNaira(order.shipping)} />
          <Row label="Total paid" value={formatNaira(order.total)} strong />
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/shop" size="lg">
          Continue shopping
        </Button>
      </div>
    </div>
  );
}

/** One label/value line in the totals block. */
function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={strong ? "font-medium text-black" : "text-charcoal/70"}>{label}</dt>
      <dd className={strong ? "text-lg font-medium tabular-nums text-black" : "tabular-nums text-black"}>
        {value}
      </dd>
    </div>
  );
}

/** Message panel for every path that is not a confirmed payment. */
function Shell({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="mx-auto max-w-xl border border-black/10 p-8 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
        Order status
      </p>
      <h2 className="mt-4 text-3xl">{heading}</h2>
      <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/cart" size="lg">
          Back to cart
        </Button>
        <Button href="/shop" size="lg" variant="outline">
          Continue shopping
        </Button>
      </div>
    </div>
  );
}