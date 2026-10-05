import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
      include: { tour: true },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "This booking is not awaiting payment" },
        { status: 400 }
      );
    }

    // Create a fresh PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(booking.totalPrice) * 100),
      currency: booking.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: booking.id,
        tourId: booking.tourId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("[bookings/pay]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to start payment" },
      { status: 500 }
    );
  }
}