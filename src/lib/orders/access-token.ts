import { createHmac, timingSafeEqual } from "node:crypto";
import { paystackSecretKey } from "@/lib/supabase/config";

/**
 * Access tokens for the order confirmation page.
 *
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * An order reference is four digits — "HEFA-1042". That is short enough to guess,
 * and /checkout/verify?reference=… is a public URL, so without a second factor
 * anyone could walk the ten thousand possibilities and read a stranger's name,
 * email, phone and delivery address straight off the confirmation page.
 *
 * The fix is to stop treating the reference as the secret. When checkout hands
 * the customer to Paystack, the callback URL carries an HMAC of the reference as
 * well. Only the person who was actually redirected receives that URL, so only
 * they can see the receipt. The token cannot be derived from a reference without
 * the server secret, so one valid link tells an attacker nothing about any other.
 *
 * The reference stays short and readable, because a human still quotes it to the
 * studio. It simply stops being sufficient on its own.
 */

/**
 * Domain separation.
 *
 * The token may be signed with a key that is used for something else too, so the
 * message carries a purpose prefix. An HMAC over a distinct prefix is a distinct
 * key in every meaningful sense: a signature made for one purpose can never be
 * replayed as a token for the other.
 */
const PURPOSE = "hefa:order-access:v1";

/** Token length in hex characters. 32 hex = 128 bits. */
const TOKEN_LENGTH = 32;

/**
 * The signing key.
 *
 * ORDER_ACCESS_SECRET is honoured when set, so this can be rotated on its own.
 * Otherwise it falls back to the Paystack secret key, which is already
 * server-only and is guaranteed present whenever checkout can run at all —
 * startCheckout() returns early when Paystack is unconfigured, so there is no
 * state in which a token is required but no key exists.
 */
function signingKey(): string | null {
  const key = process.env.ORDER_ACCESS_SECRET ?? paystackSecretKey;
  return key && key.length > 0 ? key : null;
}

/** Sign a reference. Returns "" when no key is configured. */
export function createOrderAccessToken(reference: string): string {
  const key = signingKey();
  if (!key) return "";

  return createHmac("sha256", key)
    .update(`${PURPOSE}:${reference}`)
    .digest("hex")
    .slice(0, TOKEN_LENGTH);
}

/**
 * Check a token against a reference.
 *
 * Timing-safe, so the check cannot be probed one character at a time.
 */
export function verifyOrderAccessToken(
  reference: string,
  token: string | null | undefined,
): boolean {
  if (!token) return false;

  const expected = createOrderAccessToken(reference);
  if (!expected) return false;

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token, "utf8");

  // timingSafeEqual throws when lengths differ, so check first.
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
