"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SettingsValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Editable profile form. DEMO ONLY — nothing is persisted.
 *
 * Seeded from the signed-in Supabase user by the settings page, so the fields
 * show the customer's own details rather than placeholder data.
 */
export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [values, setValues] = useState<SettingsValues>(initial);
  const [message, setMessage] = useState<string | null>(null);

  function update(field: keyof SettingsValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saved (demo) — settings are not persisted yet.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="settings-firstName"
          label="First name"
          autoComplete="given-name"
          value={values.firstName}
          onChange={(event) => update("firstName", event.target.value)}
        />
        <Input
          id="settings-lastName"
          label="Last name"
          autoComplete="family-name"
          value={values.lastName}
          onChange={(event) => update("lastName", event.target.value)}
        />
      </div>

      <Input
        id="settings-email"
        type="email"
        label="Email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => update("email", event.target.value)}
      />

      <Input
        id="settings-phone"
        type="tel"
        label="Phone"
        autoComplete="tel"
        value={values.phone}
        onChange={(event) => update("phone", event.target.value)}
      />

      {message ? (
        <p
          role="status"
          className="border border-black/15 bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-charcoal/70"
        >
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-4">
        <Button type="submit" size="md">
          Save changes (demo)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => {
            setValues(initial);
            setMessage(null);
          }}
        >
          Reset
        </Button>
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-sm text-black">Password</h3>
        <p className="mt-2 text-xs text-charcoal/60">
          Changing your password will be available once authentication is connected.
        </p>
        <Button type="button" variant="outline" size="sm" disabled className="mt-4">
          Change password (coming soon)
        </Button>
      </div>
    </form>
  );
}
