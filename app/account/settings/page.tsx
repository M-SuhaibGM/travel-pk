import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "./settings-form";
import { DeleteAccountSection } from "./delete-account-section";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/settings");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your preferences and account
      </p>

      <div className="mt-8 space-y-6">
        <SettingsForm
          user={{
            preferredCurrency: user.preferredCurrency ?? "USD",
            preferredLanguage: user.preferredLanguage ?? "en",
            emailBookingUpdates: user.emailBookingUpdates,
            emailPromotions: user.emailPromotions,
            emailTripReminders: user.emailTripReminders,
            emailProductNews: user.emailProductNews,
            publicProfile: user.publicProfile,
            showEmail: user.showEmail,
            showTrips: user.showTrips,
          }}
        />

        <DeleteAccountSection email={user.email ?? ""} />
      </div>
    </div>
  );
}