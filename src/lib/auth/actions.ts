"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { siteUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** State returned by the email/password forms, consumed by useActionState. */
export interface AuthState {
  error: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Turn Supabase's technical error text into something a customer can act on. */
function friendlyError(message: string): string {
  const text = message.toLowerCase();

  if (text.includes("invalid login credentials")) {
    return "That email and password did not match an account.";
  }
  if (text.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }
  if (text.includes("user already registered")) {
    return "An account already exists with this email. Try signing in instead.";
  }
  if (text.includes("password should be at least") || text.includes("password length")) {
    return "Please choose a password of at least 8 characters.";
  }
  if (text.includes("rate limit") || text.includes("too many requests")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (text.includes("provider") || text.includes("not enabled")) {
    return "Sign in with Google is not set up yet. Use email and password for now.";
  }

  return message;
}

/** Sign in with an existing email and password. */
export async function signInWithPassword(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!password) {
    return { error: "Please enter your password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: friendlyError(error.message) };

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Create a new account with email and password. */
export async function signUpWithPassword(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!firstName) return { error: "Please enter your first name." };
  if (!lastName) return { error: "Please enter your last name." };
  if (!EMAIL_PATTERN.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Please choose a password of at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) return { error: friendlyError(error.message) };

  // No session means Supabase is waiting for the customer to confirm their email.
  if (!data.session) {
    redirect("/login?message=confirm-email");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Send the customer to Google, then back to /auth/callback. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(friendlyError(error.message))}`);
  }

  if (data.url) redirect(data.url);
}

/** Sign out and return to the storefront. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}