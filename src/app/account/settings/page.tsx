import type { Metadata } from "next";
import { SettingsForm } from "@/components/account/SettingsForm";

export const metadata: Metadata = { title: "Settings" };

/** Account settings layout. Changes are not persisted (no backend yet). */
export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl">Account settings</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Update your personal details. In this demo, changes are not saved.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
