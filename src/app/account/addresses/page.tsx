import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ACCOUNT_ADDRESSES } from "@/lib/data/account";

export const metadata: Metadata = { title: "Addresses" };

/** Address book layout. Sample data — editing is not connected yet. */
export default function AccountAddressesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl">Address book</h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Save shipping and billing addresses for faster checkout.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" disabled>
          Add address (coming soon)
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {ACCOUNT_ADDRESSES.map((address) => (
          <div key={address.id} className="flex flex-col border border-black/10 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/60">
                {address.label}
              </span>
              {address.isDefault ? <Badge tone="light">Default</Badge> : null}
            </div>

            <address className="mt-4 text-sm not-italic leading-relaxed text-charcoal/80">
              {address.name}
              <br />
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
              <br />
              {address.city}, {address.region}
              <br />
              {address.country}
              <br />
              {address.phone}
            </address>

            <div className="mt-6 flex gap-4 text-xs uppercase tracking-[0.18em]">
              <button type="button" disabled className="cursor-not-allowed text-charcoal/40">
                Edit
              </button>
              <button type="button" disabled className="cursor-not-allowed text-charcoal/40">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-charcoal/60">
        Demo data only — managing addresses is not connected yet.
      </p>
    </div>
  );
}
