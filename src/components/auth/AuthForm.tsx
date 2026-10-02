"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  signInWithPassword,
  signUpWithPassword,
  type AuthState,
} from "@/lib/auth/actions";

interface AuthFormProps {
  mode: "login" | "signup";
}

const INITIAL_STATE: AuthState = { error: null };

/**
 * Shared sign-in / create-account form.
 *
 * Submits to a Server Action via useActionState: passwords are read straight
 * from the form data and never held in client state, and any failure comes
 * back as a friendly message.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const [state, formAction, isPending] = useActionState(
    isLogin ? signInWithPassword : signUpWithPassword,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {!isLogin ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input id="firstName" name="firstName" label="First name" autoComplete="given-name" />
          <Input id="lastName" name="lastName" label="Last name" autoComplete="family-name" />
        </div>
      ) : null}

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@email.com"
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete={isLogin ? "current-password" : "new-password"}
      />

      {isLogin ? (
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs text-charcoal/70">
            <input type="checkbox" name="remember" className="h-4 w-4 accent-black" />
            Remember me
          </label>
          <span className="text-xs text-charcoal/40" title="Coming soon">
            Forgot password?
          </span>
        </div>
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="border border-burnt-orange/40 bg-burnt-orange/5 px-4 py-3 text-xs leading-relaxed text-burnt-orange"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth disabled={isPending}>
        {isPending
          ? isLogin
            ? "Signing in…"
            : "Creating account…"
          : isLogin
            ? "Sign in"
            : "Create account"}
      </Button>

      <p className="text-center text-xs text-charcoal/70">
        {isLogin ? "New to HEFA? " : "Already have an account? "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="text-black underline underline-offset-4 transition-colors hover:text-burnt-orange"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
