import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase auth session on every request.
 *
 * Supabase tokens expire; without this, a signed-in user would be logged out
 * partway through a session. Server Components cannot write cookies, so the
 * refreshed token has to be written here instead.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl as string,
    supabasePublishableKey as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Keep the incoming request cookies in sync for this request...
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // ...and set them on the response so the browser stores them.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getClaims() verifies the session and transparently refreshes it when needed.
  try {
    const { data } = await supabase.auth.getClaims();
    void data;
  } catch {
    // Best-effort refresh: a failure here must never block the request.
  }

  return supabaseResponse;
}