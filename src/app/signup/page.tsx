import type { Metadata } from "next";
import { AuthAside } from "@/components/auth/AuthAside";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a HEFA account to track orders and save addresses.",
};

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

/** Sign-up page — Google sign-up and email/password, both backed by Supabase Auth. */
export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;

  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Join HEFA
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Create account</h1>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="max-w-md">
              {error ? (
                <p
                  role="alert"
                  className="mb-6 border border-burnt-orange/40 bg-burnt-orange/5 px-4 py-3 text-xs leading-relaxed text-burnt-orange"
                >
                  {error}
                </p>
              ) : null}

              <GoogleSignInButton label="Sign up with Google" />

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-black/15" />
                <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/50">
                  or use email
                </span>
                <span className="h-px flex-1 bg-black/15" />
              </div>

              <AuthForm mode="signup" />
            </div>

            {/* Decorative brand panel (desktop only). */}
            <AuthAside image="/images/products/kehinde-relaxed-pant-1.jpg" tone="charcoal" />
          </div>
        </Container>
      </section>
    </>
  );
}
