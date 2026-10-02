import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  isServiceRoleConfigured,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "@/lib/supabase/config";

/**
 * Server-only Supabase client that bypasses Row Level Security.
 *
 * This is the only way to write orders, because the database policies
 * deliberately refuse writes from the browser: a guest has no session to write
 * against, and a signed-in customer must never be able to forge their own order
 * totals.
 *
 * Because it bypasses every policy, treat it as the raw database password:
 *
 *   - Only ever import this from server code (Server Components, Server
 *     Actions, Route Handlers). Never from a "use client" file — that would
 *     bundle the key and hand it to every visitor.
 *   - Use it for the narrowest possible job. Prefer createClient() from
 *     ./server whenever work should happen as the signed-in customer.
 *   - Re-price and validate *before* the write, never after.
 *
 * No cookies are involved, so there is no session to keep in sync.
 */

let cached: SupabaseClient | null = null;

/** The service-role client, or a clear error explaining how to fix it. */
export function getServiceClient(): SupabaseClient {
  if (cached) return cached;

  if (!isServiceRoleConfigured) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (Supabase → " +
        "Project Settings → API Keys). It is required to create orders, which " +
        "deliberately cannot be written from the browser.",
    );
  }

  cached = createSupabaseClient(supabaseUrl as string, supabaseServiceRoleKey as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}