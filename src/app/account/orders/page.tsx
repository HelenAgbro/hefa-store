import type { Metadata } from "next";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { ACCOUNT_ORDERS } from "@/lib/data/account";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Orders" };

/** Order history. Sample data — no real orders are stored. */
export default function AccountOrdersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl">Orders</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Your order history. Live order tracking will be connected in a later phase.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {ACCOUNT_ORDERS.map((order) => (
          <li key={order.id} className="border border-black/10 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-black">{order.reference}</p>
                <p className="mt-1 text-xs text-charcoal/60">Placed {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm tabular-nums text-black">{formatNaira(order.total)}</span>
              </div>
            </div>

            <ul className="mt-4 flex flex-col gap-1 border-t border-black/10 pt-4 text-sm text-charcoal/80">
              {order.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-4">
                  <span>{item.name}</span>
                  <span className="tabular-nums">×{item.quantity}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="text-xs text-charcoal/60">Demo data only — no real orders are stored.</p>
    </div>
  );
}
