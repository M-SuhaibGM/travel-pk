"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, ShieldCheck, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  tourId: string;
  tourSlug: string;
  price: number;
  currency: string;
  maxGuests: number;
  cancellationHrs: number;
};

export function BookingSidebar({
  tourId,
  tourSlug,
  price,
  currency,
  maxGuests,
  cancellationHrs,
}: Props) {
  const router = useRouter();
  const { status } = useSession();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => price * guests, [price, guests]);

  // Get min date = today
  const today = new Date().toISOString().split("T")[0];

  async function handleBook() {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (status !== "authenticated") {
      toast.message("Please sign in to book");
      router.push(`/login?callbackUrl=/tours/${tourSlug}`);
      return;
    }

    setLoading(true);

    // Navigate to booking flow with query params
    const params = new URLSearchParams({
      tourId,
      date,
      guests: String(guests),
    });

    router.push(`/book?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      {/* Price */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-bold text-[#00aa6c]">
            ${price.toFixed(0)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            {currency} / person
          </span>
        </div>
      </div>

      {/* Date + guests form */}
      <div className="mt-5 space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Select date
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Guests</label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              max={maxGuests}
              value={guests}
              onChange={(e) =>
                setGuests(
                  Math.min(maxGuests, Math.max(1, Number(e.target.value) || 1))
                )
              }
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between border-t pt-5">
        <span className="font-medium">Total</span>
        <span className="text-xl font-bold">
          ${total.toFixed(0)} {currency}
        </span>
      </div>

      {/* Book button */}
      <Button
        onClick={handleBook}
        disabled={loading}
        size="lg"
        className="mt-4 w-full bg-[#00aa6c] text-base font-semibold text-white hover:bg-[#008f5b]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Book now"
        )}
      </Button>

      {/* Trust signals */}
      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#00aa6c]" />
          Free cancellation up to {cancellationHrs}h before
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#00aa6c]" />
          Reserve now, pay later available
        </div>
      </div>
    </div>
  );
}