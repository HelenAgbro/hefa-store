"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ACCOUNT_PROFILE } from "@/lib/data/account";

interface SettingsValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const INITIAL: SettingsValues = {
  firstName: ACCOUNT_PROFILE.firstName,
  lastName: ACCOUNT_PROFILE.lastName,
  email: ACCOUNT_PROFILE.email,
  phone: ACCOUNT_PROFILE.phone,
};

/** Editable profile form. DEMO ONLY — nothing is persisted. */
export function SettingsForm() {
  const [values, setValues] = useState<SettingsValues>(INITIAL);
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
            setValues(INITIAL);
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
