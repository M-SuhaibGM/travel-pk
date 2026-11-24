"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  // Mobile: show a sticky "Book now" bar until the booking card scrolls into view
  const cardRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) =>
        setShowBar(!entry.isIntersecting && entry.boundingClientRect.top > 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <>
    {/* Sticky mobile bar */}
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-200 lg:hidden ${
        showBar ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!showBar}
    >
      <div className="min-w-0">
        <span className="text-xl font-bold text-[#00aa6c]">
          ${price.toFixed(0)}
        </span>
        <span className="ml-1 text-xs text-muted-foreground">/ person</span>
      </div>
      <Button
        type="button"
        tabIndex={showBar ? 0 : -1}
        onClick={() =>
          document
            .getElementById("booking")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="h-11 shrink-0 bg-[#00aa6c] px-6 font-semibold text-white hover:bg-[#008f5b]"
      >
        Book now
      </Button>
    </div>

    <div ref={cardRef} className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
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
    </>
  );
}
