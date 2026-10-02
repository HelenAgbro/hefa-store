import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Server-side Supabase client for authentication.
 *
 * Reads the auth session from cookies so Server Components, Server Actions and
 * Route Handlers can see who is signed in.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl as string, supabasePublishableKey as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. The proxy refreshes the
          // session instead, so this is safe to ignore.
        }
      },
    },
  });
}