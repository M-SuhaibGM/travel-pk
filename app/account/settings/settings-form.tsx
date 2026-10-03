"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Globe,
  Bell,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type Settings = {
  preferredCurrency: string;
  preferredLanguage: string;
  emailBookingUpdates: boolean;
  emailPromotions: boolean;
  emailTripReminders: boolean;
  emailProductNews: boolean;
  publicProfile: boolean;
  showEmail: boolean;
  showTrips: boolean;
};

const currencies = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "PKR", label: "PKR — Pakistani Rupee" },
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
  { value: "ja", label: "日本語" },
];

export function SettingsForm({ user }: { user: Settings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(user);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(user);

  function toggle(key: keyof Settings) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/account/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Update failed");

      toast.success("Settings saved");
      setSaved(true);
      router.refresh();

      // Reset "saved" indicator after 2s
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ============ NOTIFICATIONS ============ */}
      <Section
        icon={Bell}
        title="Email notifications"
        description="Choose which emails you want to receive"
      >
        <ToggleRow
          label="Booking updates"
          description="Confirmations, changes, cancellations"
          checked={settings.emailBookingUpdates}
          onChange={() => toggle("emailBookingUpdates")}
        disabled={loading}
        />
        <ToggleRow
          label="Trip reminders"
          description="Reminders before your trip starts"
          checked={settings.emailTripReminders}
          onChange={() => toggle("emailTripReminders")}
          disabled={loading}
        />
        <ToggleRow
          label="Promotions & deals"
          description="Special offers and discounts"
          checked={settings.emailPromotions}
          onChange={() => toggle("emailPromotions")}
          disabled={loading}
        />
        <ToggleRow
          label="Product news"
          description="New features and updates"
          checked={settings.emailProductNews}
          onChange={() => toggle("emailProductNews")}
          disabled={loading}
        />
      </Section>

      {/* ============ PREFERENCES ============ */}
      <Section
        icon={Globe}
        title="Preferences"
        description="Currency and language for your account"
      >
        <SelectRow
          label="Preferred currency"
          value={settings.preferredCurrency}
          onChange={(v) => update("preferredCurrency", v)}
          options={currencies}
          disabled={loading}
        />
        <SelectRow
          label="Preferred language"
          value={settings.preferredLanguage}
          onChange={(v) => update("preferredLanguage", v)}
          options={languages}
          disabled={loading}
        />
      </Section>

      {/* ============ PRIVACY ============ */}
      <Section
        icon={Shield}
        title="Privacy"
        description="Control what others can see about you"
      >
        <ToggleRow
          label="Public profile"
          description="Let others view your profile page"
          checked={settings.publicProfile}
          onChange={() => toggle("publicProfile")}
          disabled={loading}
        />
        <ToggleRow
          label="Show email on profile"
          description="Display your email to other users"
          checked={settings.showEmail}
          onChange={() => toggle("showEmail")}
          disabled={loading}
        />
        <ToggleRow
          label="Show trips on profile"
          description="Let others see which trips you've taken"
          checked={settings.showTrips}
          onChange={() => toggle("showTrips")}
          disabled={loading}
        />
      </Section>

      {/* ============ SAVE BUTTON ============ */}
      <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {hasChanges
            ? "You have unsaved changes"
            : saved
            ? "All changes saved"
            : "No changes to save"}
        </p>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || loading}
          className="bg-[#00aa6c] text-white hover:bg-[#008f5b]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-start gap-3 border-b pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00aa6c]/10">
          <Icon className="h-5 w-5 text-[#00aa6c]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start justify-between gap-4 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition ${
          checked ? "bg-[#00aa6c]" : "bg-muted"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c] sm:w-64"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}