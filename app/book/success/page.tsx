import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Props = {
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tour: { include: { destination: true } } },
      })
    : null;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00aa6c]/10">
          <CheckCircle2 className="h-10 w-10 text-[#00aa6c]" />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Booking confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          A confirmation email is on its way.
        </p>

        {booking && (
          <div className="mt-8 rounded-2xl border bg-card p-6 text-left">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm text-muted-foreground">Reference</span>
              <span className="font-mono text-sm font-semibold">
                {booking.reference.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tour</span>
                <span className="font-medium">{booking.tour.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">
                  {booking.tour.destination.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start date</span>
                <span className="font-medium">
                  {format(booking.startDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-medium">{booking.guests}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Total paid</span>
                <span className="font-bold">
                  ${Number(booking.totalPrice).toFixed(0)} {booking.currency}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account/bookings">
            <Button>View my bookings</Button>
          </Link>
          <Link href="/tours">
            <Button variant="outline">Browse more tours</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}