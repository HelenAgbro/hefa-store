import { createHmac, timingSafeEqual } from "node:crypto";
import {
  PAYSTACK_API_BASE,
  isPaystackSecretConfigured,
  koboToNaira,
  paystackSecretKey,
} from "@/lib/supabase/config";

/**
 * Paystack REST client — SERVER ONLY.
 *
 * Every call here authenticates with the secret key, so this module must never be
 * imported from a "use client" file. It deliberately uses `fetch` directly rather
 * than a wrapper so the signing step stays visible.
 *
 * Paystack always answers HTTP 200 and signals failure inside the body
 * (`{ status: false, message: "..." }`), so every response is checked.
 */

/** A failure we can show the customer, as opposed to an unexpected crash. */
export class PaystackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaystackError";
  }
}

function requireSecretKey(): string {
  if (!isPaystackSecretConfigured || !paystackSecretKey) {
    throw new PaystackError(
      "Payments are not configured: PAYSTACK_SECRET_KEY is missing from .env.local.",
    );
  }
  return paystackSecretKey;
}

/** Call the Paystack API and unwrap its envelope. */
async function paystackFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${PAYSTACK_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireSecretKey()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    // Payment state must never be served from a cache.
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | { status?: boolean; message?: string; data?: T }
    | null;

  if (!response.ok || !payload) {
    throw new PaystackError(
      `Paystack returned HTTP ${response.status}. Please try again.`,
    );
  }

  if (payload.status === false) {
    throw new PaystackError(payload.message ?? "Paystack rejected the request.");
  }

  if (payload.data === undefined) {
    throw new PaystackError("Paystack returned an unexpected response.");
  }

  return payload.data;
}

export interface InitializeTransactionInput {
  /** Must be unique. We reuse the order reference so payments are traceable. */
  reference: string;
  /** Whole Naira. Converted to kobo here. */
  amount: number;
  email: string;
  /** Where Paystack sends the customer once they finish. */
  callbackUrl: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface InitializedTransaction {
  authorization_url: string;
  access_code: string;
  reference: string;
  /** Amount in kobo, as Paystack recorded it. */
  amount: number;
  status: string;
}

/**
 * Start a payment and get back the URL to send the customer to.
 *
 * The amount is converted to kobo here, so callers work in whole Naira and
 * cannot forget the x100.
 */
export async function initializeTransaction(
  input: InitializeTransactionInput,
): Promise<InitializedTransaction> {
  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new PaystackError("The order total is not a valid amount.");
  }

  const data = await paystackFetch<InitializedTransaction>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      // Paystack expects the smallest currency unit.
      amount: amount * 100,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      ...(input.firstName ? { first_name: input.firstName } : {}),
      ...(input.lastName ? { last_name: input.lastName } : {}),
      ...(input.phone ? { phone: input.phone } : {}),
      // Keeps card details entirely on Paystack's servers — we never see them.
      channels: ["card", "bank", "ussd"],
    }),
  });

  return data;
}

export interface VerifiedTransaction {
  reference: string;
  status: "success" | "failed" | "abandoned" | "ongoing" | string;
  /** Amount actually charged, in kobo. */
  amount: number;
  /** Whole Naira, for comparing with our stored order total. */
  amountNaira: number;
  paidAt: string | null;
  email: string | null;
}

/**
 * Ask Paystack whether a transaction actually succeeded.
 *
 * This is the authoritative check, and the reason the return page can safely
 * confirm an order: we are not trusting the browser's redirect, we are asking
 * Paystack directly.
 */
export async function verifyTransaction(reference: string): Promise<VerifiedTransaction> {
  const data = await paystackFetch<{
    reference: string;
    status: string;
    amount: number;
    paid_at: string | null;
    email: string | null;
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);

  return {
    reference: data.reference,
    status: data.status,
    amount: data.amount,
    amountNaira: koboToNaira(data.amount),
    paidAt: data.paid_at,
    email: data.email,
  };
}

/**
 * Check a webhook's `x-paystack-signature` header.
 *
 * Paystack signs the **raw request body** with HMAC-SHA512 using your secret key
 * and sends the hex digest. Comparing that proves the event genuinely came from
 * Paystack — without this, anyone who guessed the URL could mark orders paid for
 * free.
 *
 * The comparison is timing-safe so the check cannot be probed byte by byte.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !paystackSecretKey) return false;

  const expected = createHmac("sha512", paystackSecretKey).update(rawBody, "utf8").digest("hex");

  const received = Buffer.from(signature, "utf8");
  const computed = Buffer.from(expected, "utf8");

  // timingSafeEqual throws when lengths differ, so check first.
  if (received.length !== computed.length) return false;

  return timingSafeEqual(received, computed);
}