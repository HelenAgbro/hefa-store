import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { createClient as createCookieClient } from "@/lib/supabase/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Identifying the caller of an API route.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 * ---------------------------------------------------------------------------
 * The website and the mobile app authenticate to Supabase in different ways,
 * but both need to reach the same endpoints:
 *
 *   Website  a cookie session, written by @supabase/ssr
 *   App      a bearer token, held by supabase-js on the device
 *
 * Rather than write every endpoint twice, each one calls getApiSession() and
 * is handed back whichever client matches how the caller identified itself.
 * Row Level Security then does the rest: it only ever permits rows belonging to
 * the user these clients resolved, so an endpoint cannot accidentally read
 * somebody else's cart.
 */

export interface ApiSession {
  user: User;
  /** A client already scoped to this caller, ready for RLS-checked queries. */
  supabase: SupabaseClient;
}

/**
 * Resolve the signed-in customer, or null when there is nobody signed in.
 *
 * Returns null rather than throwing: "not signed in" is an ordinary state for
 * these routes, and the caller decides whether it means 401 or simply an empty
 * result.
 *
 * The bearer token is checked first because it is an explicit, deliberate
 * signal from a native client, and because a native app has no cookie jar for
 * the cookie path to read anyway.
 */
export async function getApiSession(): Promise<ApiSession | null> {
  const headerList = await headers();
  const authorization = headerList.get("authorization");

  let supabase: SupabaseClient;

  if (authorization?.startsWith("Bearer ")) {
    // The device sends its access token on every request. Handing it to
    // supabase-js as a default header means every query this client makes
    // carries it, so RLS evaluates the right user without any per-query
    // plumbing. autoRefreshToken is off because this client is short-lived:
    // supabase-go handles token refresh on the device that owns the session.
    supabase = createSupabaseClient(supabaseUrl as string, supabasePublishableKey as string, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    // No header, so this is a browser request: fall back to the cookie session.
    supabase = await createCookieClient();
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // getUser() contacts Supabase rather than trusting the token's payload, which
  // is what makes a deleted or expired account fail here instead of silently
  // continuing with a stale session.
  if (error || !user) return null;

  return { user, supabase };
}