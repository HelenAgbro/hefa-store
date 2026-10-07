"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  CheckoutError,
  parseCartLines,
  parseCheckoutValues,
  startCheckoutCore,
  type CheckoutState,
} from "@/lib/checkout/core";

/** Re-exported so the checkout form keeps importing from this file. */
export type { CheckoutState };
import { createOrderAccessToken } from "@/lib/orders/access-token";
import { OrderError, createOrder } from "@/lib/orders/repository";
import { initializeTransaction, PaystackError } from "@/lib/paystack/client";
import { isPaystackConfigured, siteUrl } from "@/lib/supabase/config";

/**
 * Checkout submission.
 *
 * The whole flow runs on the server. The parsing and pricing live in
 * src/lib/checkout/core.ts, shared with the mobile JSON route — this action
 * only translates the browser's FormData into that core's input and turns the
 * core's answer into either field errors or a redirect to Paystack.
 */

/* CheckoutState, limits, and cart parsing live in @/lib/checkout/core.ts — shared with the mobile JSON route. */

/** Read the checkout form fields (everything except the hidden cart payload). */
function parseValues(formData: FormData): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key !== "cart") values[key] = value;
  }
  return values;
}

/** Place the order and send the customer to Paystack. */
export async function startCheckout(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  // Link the order to the account when the customer happens to be signed in;
  // guests still check out, with a null user_id.
  const user = await getCurrentUser();

  let authorizationUrl: string;
  try {
    const started = await startCheckoutCore({
      values: parseCheckoutValues(parseValues(formData)),
      lines: parseCartLines(formData.get("cart")),
      userId: user?.id ?? null,
      callbackUrl: `${siteUrl}/checkout/verify?reference={reference}&token={token}`,
      createOrder,
      initializeTransaction,
      createAccessToken: createOrderAccessToken,
      paystackConfigured: isPaystackConfigured,
    });
    authorizationUrl = started.authorizationUrl;
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { error: error.message, fieldErrors: error.fieldErrors };
    }
    // OrderError messages are written to be read by the customer.
    if (error instanceof OrderError) return { error: error.message };

    console.error("[checkout] Could not start checkout:", error);
    if (error instanceof PaystackError) return { error: error.message };
    return {
      error:
        error instanceof Error && error.message.includes("SUPABASE_SERVICE_ROLE_KEY")
          ? "Checkout is not fully configured yet — please contact us to place your order."
          : "We could not start your order. Please try again in a moment.",
    };
  }

  // Outside the try/catch above: redirect() signals control flow by throwing,
  // and catching it would turn a redirect into a crash.
  redirect(authorizationUrl);
}