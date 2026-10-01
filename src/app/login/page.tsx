import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your HEFA account to track orders and save addresses.",
};

/** Login page. Visual only — authentication is not connected yet. */
export default function LoginPage() {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
            Welcome back
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Sign in</h1>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="max-w-md">
              <p className="mb-6 border border-dashed border-black/20 bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-charcoal/70">
                <strong className="font-medium text-black">Demo only.</strong> Sign-in is not
                connected yet — the form will not log you in.
              </p>
              <AuthForm mode="login" />
            </div>

            {/* Decorative brand panel (desktop only). */}
            <div className="relative hidden min-h-[420px] overflow-hidden bg-forest lg:block">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-cream" />
              <div className="absolute right-0 bottom-0 h-1/2 w-2/3 bg-ochre" />
              <div className="absolute top-10 right-10 h-16 w-16 rounded-full bg-burnt-orange" />
              <div className="absolute bottom-8 left-8 max-w-[9rem]">
                <span className="font-serif text-2xl leading-tight text-black">
                  Modern Afro-Minimalism
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
