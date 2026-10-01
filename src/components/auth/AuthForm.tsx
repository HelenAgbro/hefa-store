"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AuthFormProps {
  mode: "login" | "signup";
}

/**
 * Shared sign-in / create-account form.
 *
 * DEMO ONLY: authentication is not connected, so submitting just shows a note.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      isLogin
        ? "Demo only — authentication is not connected yet, so no account was signed in."
        : "Demo only — account creation is not connected yet, so no account was created.",
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {!isLogin ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="firstName"
            label="First name"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <Input
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
      ) : null}

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@email.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete={isLogin ? "current-password" : "new-password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {isLogin ? (
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs text-charcoal/70">
            <input type="checkbox" className="h-4 w-4 accent-black" />
            Remember me
          </label>
          <span className="text-xs text-charcoal/40" title="Coming soon">
            Forgot password?
          </span>
        </div>
      ) : null}

      {message ? (
        <p
          role="status"
          className="border border-black/15 bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-charcoal/70"
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth>
        {isLogin ? "Sign in" : "Create account"}
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
