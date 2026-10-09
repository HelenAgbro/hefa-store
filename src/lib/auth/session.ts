import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * The currently signed-in user, read on the server.
 *
 * Cached per request: the account layout, the overview and the settings page
 * all ask for the user while rendering a single page, and each uncached call
 * would re-validate the JWT against Supabase. Returns null when nobody is
 * signed in. Unlike the Server Actions, this is a plain helper (not callable
 * from the browser).
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

type UserIdentity = Pick<User, "email" | "phone" | "user_metadata">;

/**
 * First and last name from the auth metadata, as stored at signup.
 *
 * Email/password signup writes first_name/last_name; Google writes full_name
 * instead, so that is split on the first whitespace. Both are empty when the
 * customer signed up with neither, in which case the email local part is the
 * only identity we actually hold.
 */
export function getNameParts(user: UserIdentity): { firstName: string; lastName: string } {
  const meta = user.user_metadata ?? {};

  const firstName = String(meta.first_name ?? "").trim();
  const lastName = String(meta.last_name ?? "").trim();
  if (firstName || lastName) return { firstName, lastName };

  const fullName = String(meta.full_name ?? meta.name ?? "").trim();
  if (fullName) {
    const parts = fullName.split(/\s+/);
    return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
  }

  return { firstName: "", lastName: "" };
}

/**
 * The name to greet the customer with: their real first name when we have it,
 * otherwise the local part of their email address.
 */
export function getDisplayName(user: UserIdentity): string {
  const { firstName, lastName } = getNameParts(user);
  if (firstName) return firstName;
  if (lastName) return lastName;

  const email = (user.email ?? "").trim();
  if (email) return email.split("@")[0] ?? email;

  return "there";
}