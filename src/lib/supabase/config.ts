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