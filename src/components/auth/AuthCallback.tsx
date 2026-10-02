"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthCallbackProps {
  /** OAuth error passed down from the server, which reads it from the URL. */
  initialError?: string | null;
}

/**
 * Handles the browser coming back from Google (or any OAuth provider).
 *
 * The Supabase browser client picks the session out of the URL automatically;
 * we wait for it, then send the customer to their account.
 */
export function AuthCallback({ initialError = null }: AuthCallbackProps) {
  const router = useRouter();
  const [message] = useState(initialError ?? "Completing sign-in…");
  const [finished, setFinished] = useState(Boolean(initialError));

  useEffect(() => {
    // Nothing to wait for if the provider already reported a failure.
    if (initialError) return;

    let cancelled = false;
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || !session) return;

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        router.replace("/account");
        router.refresh();
      }
    });

    // If the session is already in place, go straight through.
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled || !data.user) return;
      router.replace("/account");
      router.refresh();
    });

    const timer = setTimeout(() => {
      if (!cancelled) setFinished(true);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [initialError, router]);

  return (
    <div className="mx-auto max-w-md border border-black/10 p-8 text-center">
      {!finished ? (
        <>
          <span
            className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-burnt-orange"
            aria-hidden="true"
          />
          <p className="mt-6 text-sm text-charcoal/70">{message}</p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-2xl">Sign-in not completed</h1>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{message}</p>
          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/login"
              className="border border-black px-5 py-3 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-black hover:text-cream"
            >
              Try again
            </Link>
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.18em] text-charcoal/60 underline underline-offset-4 hover:text-burnt-orange"
            >
              Back to the shop
            </Link>
          </div>
        </>
      )}
    </div>
  );
}