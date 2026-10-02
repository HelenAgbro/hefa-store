import type { Metadata } from "next";
import { AuthCallback } from "@/components/auth/AuthCallback";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Signing in",
  robots: { index: false, follow: false },
};

interface AuthCallbackPageProps {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}

/** Rendered on demand while the OAuth session is exchanged. */
export const dynamic = "force-dynamic";

/**
 * OAuth callback route. Supabase sends the browser here after Google sign-in.
 */
export default async function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  const { error, error_description: errorDescription } = await searchParams;

  const initialError = error || errorDescription ? (errorDescription ?? error ?? null) : null;

  return (
    <section>
      <Container className="flex min-h-[60vh] items-center justify-center py-16 sm:py-24">
        <AuthCallback initialError={initialError} />
      </Container>
    </section>
  );
}