import { Badge } from "@/components/ui/Badge";

/**
 * Payment section placeholder.
 *
 * DEMO ONLY: no payment gateway is connected. In production this is where
 * Paystack or Flutterwave would be integrated (Naira + international cards).
 */
export function PaymentPlaceholder() {
  return (
    <section aria-labelledby="payment-heading" className="border border-dashed border-black/25 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="payment-heading" className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Payment
        </h2>
        <Badge tone="accent">Future integration</Badge>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
        Online payments are not connected yet. In production this is where a secure gateway —
        <strong className="font-medium text-black"> Paystack</strong> or
        <strong className="font-medium text-black"> Flutterwave</strong> — would be integrated to accept
        Naira and international cards. No card details are collected and no payment is taken.
      </p>

      {/* Illustrative, disabled fields to show where the gateway would appear. */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2" aria-hidden="true">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/50">Card number</span>
          <div className="flex h-12 items-center border border-black/10 bg-black/[0.03] px-4 text-sm text-charcoal/40">
            •••• •••• •••• ••••
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/50">Expiry</span>
          <div className="flex h-12 items-center border border-black/10 bg-black/[0.03] px-4 text-sm text-charcoal/40">
            MM / YY
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-charcoal/50">CVC</span>
          <div className="flex h-12 items-center border border-black/10 bg-black/[0.03] px-4 text-sm text-charcoal/40">
            •••
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        These fields are illustrative only and are disabled.
      </p>
    </section>
  );
}
