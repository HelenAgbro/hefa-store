import type { ReactNode } from "react";
import { AccountNav } from "@/components/account/AccountNav";
import { Container } from "@/components/ui/Container";

/**
 * Account area layout: shared heading + sidebar navigation, wrapping every
 * /account sub-page. NOTE: this is not protected — no authentication exists yet.
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <section className="border-b border-black/10">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">Account</p>
          <h1 className="mt-4 text-4xl sm:text-5xl">My account</h1>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <AccountNav />
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        </Container>
      </section>
    </>
  );
}
