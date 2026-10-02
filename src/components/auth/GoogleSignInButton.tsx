import { signInWithGoogle } from "@/lib/auth/actions";

interface GoogleSignInButtonProps {
  label?: string;
}

/**
 * "Continue with Google" button.
 *
 * A plain form posting to a Server Action, so no client JavaScript is needed
 * to start the flow — the browser is redirected straight to Google.
 */
export function GoogleSignInButton({ label = "Continue with Google" }: GoogleSignInButtonProps) {
  return (
    <form action={signInWithGoogle} className="w-full">
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-3 border border-black/20 bg-white px-5 text-xs font-medium uppercase tracking-[0.18em] text-black transition-colors hover:border-black"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.28a12 12 0 0 0 0 10.76l4-3.1Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4 3.1C6.23 6.87 8.88 4.77 12 4.77Z"
          />
        </svg>
        {label}
      </button>
    </form>
  );
}