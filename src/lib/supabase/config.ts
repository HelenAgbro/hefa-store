/**
 * Supabase configuration, shared by the browser, server and public clients.
 *
 * Values come from environment variables — see .env.example. Copy it to
 * .env.local and add your own values; .env.local is git-ignored.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Supports both the newer "publishable" key and the older "anon" key. */
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * The service-role (secret) key.
 *
 * UNLIKE the publishable key above, this one **bypasses Row Level Security**, so
 * it can write rows that RLS deliberately refuses to the browser — which is how
 * guest checkout records an order for someone who is not signed in.
 *
 * Because it bypasses every database rule, it must only ever be used on the
 * server. Never give it a NEXT_PUBLIC_ prefix: that would inline it into the
 * JavaScript bundle and hand it to every visitor.
 */
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/** True when the service-role key is present — order writes require it. */
export const isServiceRoleConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

/**
 * The app's own URL. Supabase redirects the browser back here after sign-in,
 * so it must be allow-listed in Supabase → Authentication → URL Configuration.
 * Set NEXT_PUBLIC_SITE_URL in production to your real domain.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Paystack configuration.
 *
 * Two very different keys, and the difference matters:
 *
 *   PAYSTACK_SECRET_KEY             sk_test_… / sk_live_…  — SERVER ONLY. Signs
 *                                    API calls and verifies webhook signatures.
 *                                    Leaking it lets anyone issue refunds against
 *                                    the account.
 *   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY pk_test_… / pk_live_… — identifies the
 *                                    merchant to the checkout page. Safe to
 *                                    expose, which is why it is prefixed.
 *
 * Test keys use test money: payments can be made with the published test cards
 * and no real funds move.
 *
 * Kept here beside the Supabase keys so every server-side secret is read in one
 * place, and so nothing needs a NEXT_PUBLIC_ prefix by accident.
 */

/** Paystack's REST API root. */
export const PAYSTACK_API_BASE = "https://api.paystack.co";

/** Server-only secret key. Undefined when Paystack is not configured. */
export const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

/** Merchant public key, safe for the browser. */
export const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

/** True when the storefront can take payments (needs at least the public key). */
export const isPaystackConfigured = Boolean(paystackPublicKey);

/** True when the server can actually call Paystack — needs the secret key. */
export const isPaystackSecretConfigured = Boolean(paystackSecretKey);

/**
 * Email configuration (order confirmations).
 *
 * Lives here beside the other server secrets, following the same rule the file
 * opens with: every server-side secret is read in one place, and nothing picks
 * up a NEXT_PUBLIC_ prefix by accident.
 *
 *   RESEND_API_KEY  server only. Authorises the send. Treat it like the Paystack
 *                   secret key — with it, anyone can send mail as the brand.
 *   EMAIL_FROM      The address customers see, e.g. "HEFA <orders@hefastore.com>".
 *
 * Sending is deliberately optional: with no key the store still records every
 * order and the email step logs that it was skipped. That keeps local work and a
 * demo deployment working with no third-party account.
 */

/** Resend's REST API root. */
export const RESEND_API_BASE = "https://api.resend.com";

/** Server-only Resend key. Undefined when email is not configured. */
export const resendApiKey = process.env.RESEND_API_KEY;

/**
 * The From address shown to customers.
 *
 * The fallback is Resend's shared testing sender. That domain is only allowed to
 * deliver to the address that owns the Resend account, so it is fine for trying
 * the template out and useless for real customers. Set EMAIL_FROM to an address
 * on a domain you have verified once you have one.
 */
export const emailFrom = process.env.EMAIL_FROM ?? "HEFA <onboarding@resend.dev>";

/** True when the server can send email at all. */
export const isEmailConfigured = Boolean(resendApiKey);

/**
 * True when a confirmation email would actually reach a customer.
 *
 * Deliberately stricter than isEmailConfigured. A key alone is not enough: while
 * the sender is still resend.dev, every send to a customer is rejected by Resend
 * with a 403 — the testing domain only delivers to the account owner. The UI
 * uses this flag to decide whether it may *promise* an email, so the storefront
 * never claims something it cannot do.
 */
export const isEmailDeliverableToCustomers =
  isEmailConfigured && !emailFrom.toLowerCase().includes("resend.dev");

/**
 * Convert Naira to kobo.
 *
 * Paystack expects every amount in the currency's **smallest unit**, so ₦68,000
 * must be sent as 6800000. Sending 68000 would charge ₦680 instead of ₦68,000 —
 * the single most common integration mistake here.
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/** Convert kobo back to Naira, for comparing against our stored totals. */
export function koboToNaira(kobo: number): number {
  return Math.round(kobo) / 100;
}
