"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";

type Props = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Update failed");
      }

      toast.success("Profile updated");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Display name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          className="max-w-md"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          This is what other travelers see on reviews and bookings.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={loading || name === user.name}
          className="bg-[#00aa6c] text-white hover:bg-[#008f5b]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>

        {name !== user.name && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setName(user.name)}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}