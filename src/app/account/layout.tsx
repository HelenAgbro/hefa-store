import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AccountNav } from "@/components/account/AccountNav";
import { Container } from "@/components/ui/Container";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Account area layout: shared heading + sidebar navigation, wrapping every
 * /account sub-page.
 *
 * This layout IS the gate. Every /account route renders inside it, so one check
 * here protects the overview, orders, addresses and settings pages together.
 *
 * Without it, anyone who guessed "/account" saw a signed-in dashboard with a
 * customer name, email, phone and full address — data belonging to whoever used
 * the demo build. The pages behind it currently show sample data rather than the
 * signed-in person's own orders, but the layout must not depend on that: it is
 * the wrong kind of protection, because the day real data lands behind it with
 * the gate still missing, the data leaks.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  // No session means someone typed the address by hand, or followed a stale link.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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
