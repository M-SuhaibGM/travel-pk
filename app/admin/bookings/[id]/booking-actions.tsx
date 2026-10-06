"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Loader2,
  CheckCircle2,
  XCircle,
  Flag,
  Mail,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  bookingId: string;
  currentStatus: string;
  refunderAmount: number;
  hasRefund: boolean;
  email: string;
  reference: string;
};

export function BookingActions({
  bookingId,
  currentStatus,
  refunderAmount,
  hasRefund,
  email,
  reference,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(
    refunderAmount.toFixed(2)
  );

  async function updateStatus(status: string, label: string) {
    setLoading(status);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");

      toast.success(label);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleRefund() {
    setLoading("refund");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(refundAmount) || refunderAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Refund failed");

      toast.success(
        `Refund of $${refundAmount} issued successfully`
      );
      setRefundOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Refund failed");
    } finally {
      setLoading(null);
    }
  }

  async function resendEmail() {
    setLoading("email");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/resend`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Email failed");

      toast.success(`Confirmation email resent to ${email}`);
    } catch {
      toast.error("Failed to resend email");
    } finally {
      setLoading(null);
    }
  }

  const canRefund = refunderAmount > 0 && !hasRefund;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="mr-2 h-4 w-4" />
            )}
            Actions
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Change status</DropdownMenuLabel>

          {currentStatus !== "CONFIRMED" && (
            <DropdownMenuItem
              onClick={() => updateStatus("CONFIRMED", "Marked confirmed")}
              disabled={loading !== null}
              className="cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              Mark as confirmed
            </DropdownMenuItem>
          )}

          {currentStatus !== "COMPLETED" && (
            <DropdownMenuItem
              onClick={() => updateStatus("COMPLETED", "Marked completed")}
              disabled={loading !== null}
              className="cursor-pointer"
            >
              <Flag className="mr-2 h-4 w-4 text-blue-600" />
              Mark as completed
            </DropdownMenuItem>
          )}

          {currentStatus !== "CANCELLED" && (
            <DropdownMenuItem
              onClick={() => updateStatus("CANCELLED", "Booking cancelled")}
              disabled={loading !== null}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel booking
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={resendEmail}
            disabled={loading !== null}
            className="cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4" />
            Resend confirmation email
          </DropdownMenuItem>

          {canRefund && (
            <DropdownMenuItem
              onClick={() => setRefundOpen(true)}
              disabled={loading !== null}
              className="cursor-pointer"
            >
              <RotateCcw className="mr-2 h-4 w-4 text-amber-600" />
              Issue refund
            </DropdownMenuItem>
          )}

          {hasRefund && (
            <DropdownMenuItem disabled className="text-muted-foreground">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Already refunded
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Refund dialog */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent aria-describedby={undefined}  >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Issue refund
            </DialogTitle>
            <DialogDescription>
              Refund the customer for booking{" "}
              <strong className="font-mono">{reference}</strong>. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Refund amount (max ${refunderAmount.toFixed(2)})
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">$</span>
                <Input
                  type="number"
                  min={0.5}
                  max={refunderAmount}
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  disabled={loading === "refund"}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Refund goes back to the original payment method. It may take
                5–10 business days to appear on the customer&apos;s statement.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundOpen(false)}
              disabled={loading === "refund"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRefund}
              disabled={
                loading === "refund" ||
                Number(refundAmount) <= 0 ||
                Number(refundAmount) > refunderAmount
              }
              className="bg-[#00aa6c] text-white hover:bg-[#008f5b]"
            >
              {loading === "refund" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refund ${refundAmount}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}