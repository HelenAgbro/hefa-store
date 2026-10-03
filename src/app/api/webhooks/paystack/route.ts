import { NextResponse, type NextRequest } from "next/server";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import { getOrderByReference, markPaid } from "@/lib/orders/repository";
import { verifyWebhookSignature } from "@/lib/paystack/client";
import { koboToNaira } from "@/lib/supabase/config";

/**
 * Paystack webhook — the authoritative "payment succeeded" signal.
 *
 * WHY THIS EXISTS AT ALL
 * ---------------------------------------------------------------------------
 * The checkout return page also confirms payments, but it only runs if the
 * customer's browser comes back. Somebody who pays and closes the tab would
 * otherwise leave a paid order sitting at 'pending' forever, with no receipt.
 * Paystack calls this endpoint server-to-server instead, so that case is covered.
 *
 * Both paths call the same idempotent markPaid(), so whichever arrives first
 * wins and the other is a no-op. Paystack retries a failing webhook for 72 hours,
 * so this endpoint must be safe to run any number of times.
 *
 * THE SIGNATURE CHECK IS THE POINT
 * ---------------------------------------------------------------------------
 * The URL is guessable. Without verifying the HMAC, anyone who found it could
 * mark orders paid for free. Paystack signs the *raw request body* with our
 * secret key, so the body is read as text and verified BEFORE it is parsed —
 * re-serialising it first would change the bytes and the check could never pass.
 */

/** Node, not Edge: the check uses node:crypto. */
export const runtime = "nodejs";

export const dynamic = "force-dynamic";

interface PaystackEvent {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    /** Amount in kobo, as Paystack recorded it. */
    amount?: number;
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn("[webhook] Rejected a request with a missing or invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(rawBody) as PaystackEvent;
  } catch {
    // Signed but unparseable: nothing to act on, and retrying will not help.
    return NextResponse.json({ received: true });
  }

  // Paystack sends several event types. Only a successful charge concerns us,
  // and anything else is acknowledged so it is not retried.
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ received: true });
  }

  try {
    // Look the order up BEFORE marking anything. We need its expected total to
    // check the charge against, and confirming first would mean a payment for
    // the wrong amount had already been counted as a real sale by the time we
    // noticed. The return page checks in this same order, for this same reason.
    const existing = await getOrderByReference(reference);

    if (!existing) {
      // A reference we do not recognise. Acknowledged rather than treated as an
      // error, because retrying for 72 hours would not conjure the order up.
      console.warn(`[webhook] No order found for reference ${reference}`);
      return NextResponse.json({ received: true });
    }

    const chargedKobo = event.data?.amount;
    if (typeof chargedKobo === "number" && koboToNaira(chargedKobo) !== existing.total) {
      console.error(
        `[webhook] Amount mismatch on ${reference}: expected ${existing.total}, charged ${koboToNaira(chargedKobo)}. Left unconfirmed for a human to resolve.`,
      );
      return NextResponse.json({ received: true, mismatch: true });
    }

    // We reuse our own reference for the Paystack transaction, so the two match.
    const { order, newlyPaid } = await markPaid(reference, reference);

    if (!order) {
      return NextResponse.json({ received: true });
    }

    if (!newlyPaid) {
      // Already confirmed, by an earlier webhook or by the return page.
      // This is the guard that stops one purchase sending several receipts.
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Best-effort: the order is already paid, so a mail failure is logged and
    // acknowledged rather than retried.
    const email = await sendOrderConfirmation(order);
    if (!email.sent) {
      console.warn(`[webhook] Receipt for ${reference} not sent: ${email.skippedReason}`);
    }

    return NextResponse.json({ received: true, emailSent: email.sent });
  } catch (error) {
    // A genuine database problem. Returning 500 lets Paystack retry, which is
    // safe precisely because markPaid() cannot mark an order twice.
    console.error(`[webhook] Could not record payment for ${reference}:`, error);
    return NextResponse.json({ error: "Could not record payment" }, { status: 500 });
  }
}
