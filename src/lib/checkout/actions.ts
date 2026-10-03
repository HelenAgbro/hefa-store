"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import type { CartLine } from "@/lib/cart";
import {
  INITIAL_CHECKOUT_VALUES,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/checkout";
import { createOrderAccessToken } from "@/lib/orders/access-token";
import { OrderError, createOrder } from "@/lib/orders/repository";
import { initializeTransaction, PaystackError } from "@/lib/paystack/client";
import { isPaystackConfigured, siteUrl } from "@/lib/supabase/config";

/**
 * Checkout submission.
 *
 * The whole flow runs on the server:
 *
 *   1. re-validate the form
 *   2. rebuild the cart from a hidden field, keeping only ids/quantities
 *   3. price it from the database (never from the browser)
 *   4. save a 'pending' order
 *   5. ask Paystack for a payment URL and redirect the customer there
 *
 * The browser only ever sends product ids, colours, sizes and quantities — never
 * a price or a total — so there is nothing in the payload worth tampering with.
 */

/** State consumed by useActionState in the checkout form. */
export interface CheckoutState {
  error: string | null;
  /** Per-field messages, so the form can highlight the exact inputs. */
  fieldErrors?: CheckoutErrors;
}

/** Guard rails on what the browser may send. */
const MAX_CART_LINES = 50;
const MAX_QUANTITY_PER_LINE = 10;

/** Read the checkout form fields. */
function parseValues(formData: FormData): CheckoutValues {
  const read = (key: keyof CheckoutValues) => String(formData.get(key) ?? "").trim();

  return {
    firstName: read("firstName"),
    lastName: read("lastName"),
    email: read("email"),
    phone: read("phone"),
    address1: read("address1"),
    address2: read("address2"),
    city: read("city"),
    region: read("region"),
    postalCode: read("postalCode"),
    country: read("country"),
    shippingMethod: read("shippingMethod") || INITIAL_CHECKOUT_VALUES.shippingMethod,
  };
}

/**
 * Rebuild the cart lines from the hidden field.
 *
 * Everything here is discarded except the four values that identify *what* was
 * bought — no price or amount survives, because those are recomputed from the
 * products table in priceCart().
 */
function parseCartLines(raw: FormDataEntryValue | null): CartLine[] | null {
  if (typeof raw !== "string" || raw.length === 0) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_CART_LINES) {
    return null;
  }

  const lines: CartLine[] = [];

  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) return null;

    const candidate = entry as Record<string, unknown>;
    const productId = typeof candidate.productId === "string" ? candidate.productId : "";
    if (!productId) return null;

    lines.push({
      id: `${productId}::${String(candidate.color ?? "")}::${String(candidate.size ?? "")}`,
      productId,
      color: String(candidate.color ?? ""),
      size: String(candidate.size ?? ""),
      quantity: Math.min(
        MAX_QUANTITY_PER_LINE,
        Math.max(1, Math.floor(Number(candidate.quantity) || 1)),
      ),
    });
  }

  return lines;
}

/** Place the order and send the customer to Paystack. */
export async function startCheckout(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  if (!isPaystackConfigured) {
    return { error: "Payments are not set up yet. Please contact us to place an order." };
  }

  const values = parseValues(formData);
  const fieldErrors = validateCheckout(values);

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please correct the highlighted fields.", fieldErrors };
  }

  const lines = parseCartLines(formData.get("cart"));
  if (!lines) {
    return { error: "We could not read your cart. Please refresh the page and try again." };
  }

  // Link the order to the account when the customer happens to be signed in;
  // guests still check out, with a null user_id.
  const user = await getCurrentUser();

  let order;
  try {
    order = await createOrder({ lines, values, userId: user?.id ?? null });
  } catch (error) {
    // OrderError messages are written to be read by the customer.
    if (error instanceof OrderError) return { error: error.message };

    console.error("[checkout] Could not create order:", error);
    return {
      error:
        error instanceof Error && error.message.includes("SUPABASE_SERVICE_ROLE_KEY")
          ? "Checkout is not fully configured yet — please contact us to place your order."
          : "We could not start your order. Please try again in a moment.",
    };
  }

  let authorizationUrl: string;
  try {
    const transaction = await initializeTransaction({
      // Reusing our reference means a payment can always be traced to an order.
      reference: order.reference,
      amount: order.total,
      email: order.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: order.phone,
      // The token is what lets the return page prove the visitor was actually
      // redirected here, rather than having guessed a four-digit reference.
      callbackUrl: `${siteUrl}/checkout/verify?reference=${encodeURIComponent(order.reference)}&token=${createOrderAccessToken(order.reference)}`,
    });

    authorizationUrl = transaction.authorization_url;
  } catch (error) {
    // The order stays 'pending'. That is deliberate and harmless — it is never
    // counted as revenue, and it means a retry can reuse the same reference.
    console.error("[checkout] Paystack did not start the transaction:", error);
    return {
      error:
        error instanceof PaystackError
          ? error.message
          : "We could not reach the payment provider. Please try again.",
    };
  }

  // Outside the try/catch above: redirect() signals control flow by throwing,
  // and catching it would turn a redirect into a crash.
  redirect(authorizationUrl);
}