"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  CONTACT_TOPICS,
  INITIAL_CONTACT_VALUES,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";

/**
 * Contact enquiry form.
 *
 * DEMO ONLY: email delivery is not connected (no Mailgun yet), so submitting
 * validates the fields and shows a confirmation without sending anything.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(INITIAL_CONTACT_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  function handleChange(field: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear the error for a field as soon as it is edited.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContact(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSent(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (sent) {
    return (
      <div className="border border-black/10 p-8 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-burnt-orange">
          Message ready
        </p>
        <h2 className="mt-4 text-2xl">Thank you, {values.name}.</h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
          This is a demonstration form — nothing was sent, because email delivery is not connected
          yet. In production this message would reach our inbox and you would hear back within two
          business days.
        </p>
        <Button
          type="button"
          variant="outline"
          size="md"
          className="mt-6"
          onClick={() => {
            setValues(INITIAL_CONTACT_VALUES);
            setSent(false);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errorCount > 0 ? (
        <p
          role="alert"
          className="border border-burnt-orange/40 bg-burnt-orange/5 px-4 py-3 text-sm text-burnt-orange"
        >
          Please fix the {errorCount} highlighted {errorCount === 1 ? "field" : "fields"} below.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="contact-name"
          label="Name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(event) => handleChange("name", event.target.value)}
        />
        <Input
          id="contact-email"
          type="email"
          label="Email"
          placeholder="you@email.com"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(event) => handleChange("email", event.target.value)}
        />
      </div>

      <Select
        id="contact-topic"
        label="Topic"
        value={values.topic}
        error={errors.topic}
        onChange={(event) => handleChange("topic", event.target.value)}
      >
        {CONTACT_TOPICS.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </Select>

      <Textarea
        id="contact-message"
        label="Message"
        rows={6}
        placeholder="How can we help?"
        value={values.message}
        error={errors.message}
        onChange={(event) => handleChange("message", event.target.value)}
      />

      <Button type="submit" size="lg" fullWidth>
        Send message
      </Button>
      <p className="text-xs text-charcoal/60">
        Demo only — nothing is sent and no data is stored.
      </p>
    </form>
  );
}
