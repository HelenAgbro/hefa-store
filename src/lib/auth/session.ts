import { createClient } from "@/lib/supabase/server";

/**
 * The currently signed-in user, read on the server.
 *
 * Returns null when nobody is signed in. Unlike the Server Actions, this is a
 * plain helper (not callable from the browser).
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}