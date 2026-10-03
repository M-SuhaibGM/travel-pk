import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Already cancelled" },
        { status: 400 }
      );
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Completed bookings cannot be cancelled" },
        { status: 400 }
      );
    }

    // Enforce cancellation window
    const tour = await prisma.tour.findUnique({
      where: { id: booking.tourId },
    });

    if (tour) {
      const hoursUntil = (booking.startDate.getTime() - Date.now()) / 36e5;
      if (hoursUntil < tour.cancellationHrs) {
        return NextResponse.json(
          {
            error: `Cancellations must be made at least ${tour.cancellationHrs}h before the trip`,
          },
          { status: 400 }
        );
      }
    }

    // Optional: Stripe refund
    let refunded = false;
    try {
      const intents = await stripe.paymentIntents.list({ limit: 100 });
      const match = intents.data.find(
        (pi) =>
          pi.metadata?.bookingId === booking.id && pi.status === "succeeded"
      );

      if (match) {
        await stripe.refunds.create({ payment_intent: match.id });
        refunded = true;
      }
    } catch (err) {
      console.error("[cancel] Refund failed:", err);
      // Continue — mark cancelled anyway
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ status: "cancelled", refunded });
  } catch (err: any) {
    console.error("[cancel-booking]", err);
    return NextResponse.json(
      { error: err.message ?? "Cancellation failed" },
      { status: 500 }
    );
  }
}