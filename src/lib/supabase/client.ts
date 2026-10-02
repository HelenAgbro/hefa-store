"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Browser Supabase client, used for authentication.
 *
 * Sessions are persisted in cookies, so the user stays signed in after the
 * Google redirect and on every subsequent page load. `persistSession: false`
 * would break OAuth sign-in, so it must stay enabled here.
 */
export function createClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and add your project values.",
    );
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
