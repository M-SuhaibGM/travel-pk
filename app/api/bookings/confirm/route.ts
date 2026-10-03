import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/server";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";
import { checkRateLimit } from "@/lib/rate-limit-helpers";

export async function POST(req: Request) {
  try {
     const blocked = checkRateLimit(req, {
    key: "confirm-booking",
    limit: 10,
    windowMs: 60_000,
  });
  if (blocked) return blocked;
    const { paymentIntentId, bookingId } = await req.json();

    if (!paymentIntentId || !bookingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Verify with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed", status: paymentIntent.status },
        { status: 400 }
      );
    }

    // 2. Fetch booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tour: true, user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CONFIRMED") {
      return NextResponse.json({ status: "already_confirmed" });
    }

    // 3. Update booking + payment fields
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentIntentId: paymentIntent.id,
        paidAt: new Date(),
      },
      include: { tour: true, user: true },
    });

    // 4. Send email
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: updated.email,
        subject: `Booking confirmed: ${updated.tour.title}`,
        react: BookingConfirmationEmail({
          name: updated.fullName,
          tourTitle: updated.tour.title,
          reference: updated.reference.slice(-8).toUpperCase(),
          startDate: updated.startDate.toISOString(),
          guests: updated.guests,
          total: Number(updated.totalPrice),
          currency: updated.currency,
        }),
      });
    } catch (emailErr) {
      console.error("[confirm] Email failed:", emailErr);
    }

    return NextResponse.json({ status: "confirmed" });
  } catch (err: any) {
    console.error("[bookings/confirm]", err);
    return NextResponse.json(
      { error: err.message ?? "Confirmation failed" },
      { status: 500 }
    );
  }
}