"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  COUNTRIES,
  getShippingCost,
  SHIPPING_METHODS,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/checkout";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  values: CheckoutValues;
  errors: CheckoutErrors;
  subtotal: number;
  onChange: (field: keyof CheckoutValues, value: string) => void;
}

/** Customer details, shipping address, shipping method and payment placeholder. */
export function CheckoutForm({ values, errors, subtotal, onChange }: CheckoutFormProps) {
  return (
    <>
      {/* Customer information */}
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Customer information
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            label="First name"
            autoComplete="given-name"
            value={values.firstName}
            error={errors.firstName}
            onChange={(event) => onChange("firstName", event.target.value)}
          />
          <Input
            id="lastName"
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            value={values.lastName}
            error={errors.lastName}
            onChange={(event) => onChange("lastName", event.target.value)}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@email.com"
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(event) => onChange("email", event.target.value)}
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone"
            placeholder="+234 800 000 0000"
            autoComplete="tel"
            value={values.phone}
            error={errors.phone}
            onChange={(event) => onChange("phone", event.target.value)}
          />
        </div>
      </fieldset>

      {/* Shipping address */}
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Shipping address
        </legend>
        <div className="mt-5 flex flex-col gap-5">
          <Input
            id="address1"
            name="address1"
            label="Address line 1"
            autoComplete="address-line1"
            value={values.address1}
            error={errors.address1}
            onChange={(event) => onChange("address1", event.target.value)}
          />
          <Input
            id="address2"
            name="address2"
            label="Address line 2 (optional)"
            autoComplete="address-line2"
            value={values.address2}
            onChange={(event) => onChange("address2", event.target.value)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="city"
              name="city"
              label="City"
              autoComplete="address-level2"
              value={values.city}
              error={errors.city}
              onChange={(event) => onChange("city", event.target.value)}
            />
            <Input
              id="region"
              name="region"
              label="State / Region"
              autoComplete="address-level1"
              value={values.region}
              error={errors.region}
              onChange={(event) => onChange("region", event.target.value)}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="postalCode"
              name="postalCode"
              label="Postal code (optional)"
              autoComplete="postal-code"
              value={values.postalCode}
              onChange={(event) => onChange("postalCode", event.target.value)}
            />
            <Select
              id="country"
              name="country"
              label="Country"
              autoComplete="country-name"
              value={values.country}
              error={errors.country}
              onChange={(event) => onChange("country", event.target.value)}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </fieldset>

      {/* Shipping method */}
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Shipping method
        </legend>
        <div className="mt-5 flex flex-col gap-3">
          {SHIPPING_METHODS.map((method) => {
            const cost = getShippingCost(method.id, subtotal);
            const active = values.shippingMethod === method.id;

            return (
              <label
                key={method.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 border p-4 transition-colors",
                  active ? "border-black" : "border-black/20 hover:border-black/40",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={active}
                    onChange={() => onChange("shippingMethod", method.id)}
                    className="h-4 w-4 accent-black"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm text-black">{method.label}</span>
                    <span className="text-xs text-charcoal/60">{method.description}</span>
                  </span>
                </span>
                <span className="text-sm tabular-nums text-black">
                  {cost === 0 ? "Free" : formatNaira(cost)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Payment — no card fields, because card data stays with Paystack */}
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Payment
        </legend>
        <div className="mt-5 border border-black/10 p-5">
          <p className="text-sm leading-relaxed text-charcoal/70">
            You will pay on <strong className="font-medium text-black">Paystack</strong> after
            reviewing your order. Pay by card, bank transfer or USSD.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-charcoal/60">
            Card details are entered on Paystack&apos;s secure page and are never seen or stored by
            this site. We only receive confirmation that the payment succeeded.
          </p>
        </div>
      </fieldset>
    </>
  );
}
