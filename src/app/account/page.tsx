import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { getDisplayName, getCurrentUser } from "@/lib/auth/session";
import { ACCOUNT_ADDRESSES, ACCOUNT_ORDERS } from "@/lib/data/account";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Account overview" };

/**
 * Account dashboard overview: profile summary, recent orders and default address.
 *
 * Identity is read from the signed-in Supabase user. The account layout above
 * has already rejected anyone without a session, so this cannot render for an
 * anonymous visitor, but it still guards rather than assuming.
 */
export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const recentOrders = ACCOUNT_ORDERS.slice(0, 3);
  const defaultAddress = ACCOUNT_ADDRESSES.find((address) => address.isDefault) ?? ACCOUNT_ADDRESSES[0];

  return (
    <div className="flex flex-col gap-10">
      <p className="border border-dashed border-black/20 bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-charcoal/70">
        <strong className="font-medium text-black">Sample data.</strong> Your details above are
        live; orders and addresses below are placeholder examples while we finish that work.
      </p>

      <div>
        <h2 className="text-2xl">Welcome back, {getDisplayName(user)}</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          {user.email ?? user.phone ?? ""}
          {user.email && user.phone ? ` · ${user.phone}` : null}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-black/10 p-6">
          <h3 className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
            Recent orders
          </h3>
          <p className="mt-3 text-3xl tabular-nums">{ACCOUNT_ORDERS.length}</p>
          <Link
            href="/account/orders"
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-4 transition-colors hover:text-burnt-orange"
          >
            View all orders
          </Link>
        </div>

        <div className="border border-black/10 p-6">
          <h3 className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
            Default address
          </h3>
          {defaultAddress ? (
            <address className="mt-3 text-sm not-italic leading-relaxed text-charcoal/80">
              {defaultAddress.name}
              <br />
              {defaultAddress.line1}
              {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}
              <br />
              {defaultAddress.city}, {defaultAddress.region}
              <br />
              {defaultAddress.country}
            </address>
          ) : null}
          <Link
            href="/account/addresses"
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-4 transition-colors hover:text-burnt-orange"
          >
            Manage addresses
          </Link>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl">Recent activity</h3>
          <Button href="/account/orders" variant="outline" size="sm">
            All orders
          </Button>
        </div>

        <ul className="mt-6 flex flex-col divide-y divide-black/10 border-y border-black/10">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div>
                <p className="text-sm text-black">{order.reference}</p>
                <p className="mt-1 text-xs text-charcoal/60">
                  {order.date} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm tabular-nums text-black">{formatNaira(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
