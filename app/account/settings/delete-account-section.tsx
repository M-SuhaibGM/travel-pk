"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function DeleteAccountSection({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const canDelete = confirmText.trim().toLowerCase() === "delete my account";

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }

      toast.success("Account deleted");
      await signOut({ callbackUrl: "/" });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-destructive">
            Danger zone
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This
            action cannot be undone.
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete my account
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  Delete your account?
                </DialogTitle>
                <DialogDescription>
                  This will permanently delete:
                </DialogDescription>
              </DialogHeader>

              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Your profile and login access</li>
                <li>• All your bookings and trip history</li>
                <li>• Your wishlist</li>
                <li>• All preferences and settings</li>
              </ul>

              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm">
                  Signed in as <strong>{email}</strong>
                </p>
                <p className="mt-3 text-sm">
                  Type <strong>delete my account</strong> to confirm:
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="delete my account"
                  className="mt-2"
                  disabled={loading}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={!canDelete || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete account
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}