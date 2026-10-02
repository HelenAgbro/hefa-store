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

/** True when Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/**
 * The app's own URL. Supabase redirects the browser back here after sign-in,
 * so it must be allow-listed in Supabase → Authentication → URL Configuration.
 * Set NEXT_PUBLIC_SITE_URL in production to your real domain.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";