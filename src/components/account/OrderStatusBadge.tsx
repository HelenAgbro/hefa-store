import type { OrderDisplayStatus } from "@/lib/data/account";
import { cn } from "@/lib/utils";

const STYLES: Record<OrderDisplayStatus, string> = {
  Processing: "border-ochre/40 text-ochre",
  Shipped: "border-forest/40 text-forest",
  Delivered: "border-black/20 text-charcoal",
};

/** Small status pill for account orders. */
export function OrderStatusBadge({ status }: { status: OrderDisplayStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em]",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
