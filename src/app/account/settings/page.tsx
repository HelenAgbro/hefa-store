import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/account/SettingsForm";
import { getCurrentUser, getNameParts } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Settings" };

/**
 * Account settings. Changes are not persisted (no backend yet), but the form
 * opens on the customer's own details rather than placeholder data.
 */
export default async function AccountSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { firstName, lastName } = getNameParts(user);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl">Account settings</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Update your personal details. In this demo, changes are not saved.
        </p>
      </div>

      <SettingsForm
        initial={{
          firstName,
          lastName,
          email: user.email ?? "",
          phone: user.phone ?? "",
        }}
      />
    </div>
  );
}
