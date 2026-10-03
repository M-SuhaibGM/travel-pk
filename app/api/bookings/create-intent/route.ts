import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/server";
import { checkRateLimit } from "@/lib/rate-limit-helpers";

export async function POST(req: Request) {
  try {


    const blocked = checkRateLimit(req, {
    key: "create-intent",
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (blocked) return blocked;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      tourId,
      startDate,
      guests,
      fullName,
      email,
      phone,
      notes,
    } = await req.json();

    if (!tourId || !startDate || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour || !tour.published) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + tour.durationDays - 1);
    const total = Number(tour.price) * guests;

    // 1. Create booking as PENDING
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        tourId: tour.id,
        startDate: start,
        endDate: end,
        guests,
        totalPrice: total,
        currency: tour.currency,
        status: "PENDING",
        fullName,
        email,
        phone,
        notes,
      },
    });

    // 2. Create PaymentIntent (instead of Checkout Session)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: tour.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: booking.id,
        tourId: tour.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
    });
  } catch (err: any) {
    console.error("[create-intent]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to create payment intent" },
      { status: 500 }
    );
  }
}