"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  bookingId: string;
  variant?: "outline" | "solid";
};

export function PayNowButton({ bookingId, variant = "outline" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      // Create a fresh PaymentIntent for this booking
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Could not start payment");
      }

      // Navigate to the payment page
      router.push(`/book/pay/${bookingId}`);
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  const isSolid = variant === "solid";

  return (
    <Button
      onClick={handlePay}
      disabled={loading}
      className={
        isSolid
          ? "bg-[#00aa6c] text-white hover:bg-[#008f5b]"
          : "border-[#00aa6c] text-[#00aa6c] hover:bg-[#00aa6c]/10"
      }
      variant={isSolid ? "default" : "outline"}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay now
        </>
      )}
    </Button>
  );
}