import { NextResponse, type NextRequest } from "next/server";
import { getApiSession } from "@/lib/api-auth";
import {
  CheckoutError,
  parseCartLines,
  parseCheckoutValues,
  startCheckoutCore,
} from "@/lib/checkout/core";
import { createOrderAccessToken } from "@/lib/orders/access-token";
import { OrderError, createOrder } from "@/lib/orders/repository";
import { initializeTransaction, PaystackError } from "@/lib/paystack/client";
import { isPaystackConfigured, siteUrl } from "@/lib/supabase/config";

/**
 * Start checkout for the mobile app.
 *
 *   POST /api/checkout   { values, lines, callbackUrl? }  ->  { authorizationUrl, reference, token, total }
 *
 * Same server flow as the website form: validate, re-price from the database,
 * save a pending order, ask Paystack for a payment URL. Guests allowed.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getApiSession();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "That request was not understood." }, { status: 400 });
  }

  const rawValues = body.values;
  const valuesRecord =
    typeof rawValues === "object" && rawValues !== null
      ? (rawValues as Record<string, unknown>)
      : {};
  const callbackUrl =
    typeof body.callbackUrl === "string" && body.callbackUrl.length > 0
      ? body.callbackUrl
      : `${siteUrl}/checkout/verify?reference={reference}&token={token}`;

  try {
    const started = await startCheckoutCore({
      values: parseCheckoutValues(valuesRecord),
      lines: parseCartLines(body.lines),
      userId: session?.user.id ?? null,
      callbackUrl,
      createOrder,
      initializeTransaction,
      createAccessToken: createOrderAccessToken,
      paystackConfigured: isPaystackConfigured,
    });
    return NextResponse.json(started, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json(
        { error: error.message, fieldErrors: error.fieldErrors ?? null },
        { status: 400 },
      );
    }
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof PaystackError) {
      console.error("[api/checkout] Paystack did not start the transaction:", error);
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("[api/checkout] Could not start checkout:", error);
    const message =
      error instanceof Error && error.message.includes("SUPABASE_SERVICE_ROLE_KEY")
        ? "Checkout is not fully configured yet."
        : "We could not start your order. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
