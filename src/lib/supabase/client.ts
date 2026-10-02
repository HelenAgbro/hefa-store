import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase connection.
 *
 * Reads the project URL and public ("publishable"/"anon") key from
 * environment variables — see .env.example. Copy .env.example to .env.local
 * and add your own values; .env.local is git-ignored.
 *
 * These credentials are safe in the browser: the publishable key is designed to
 * be public, and Row Level Security is what actually protects your data.
 *
 * If the variables are missing, `supabase` is null and the app falls back to
 * the local data in src/lib/data/, so the site keeps working either way.
 */

// Supports both the newer "publishable" key and the older "anon" key.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(url && publishableKey);

/** Shared Supabase client, or null when not configured. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, publishableKey as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
