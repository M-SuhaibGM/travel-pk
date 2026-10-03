import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, rating, title, comment } = await req.json();

    // Validate
    if (!bookingId || !rating || !comment) {
      return NextResponse.json(
        { error: "Booking ID, rating, and comment are required" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Review must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Fetch booking — verify ownership + COMPLETED status
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "You can only review completed trips" },
        { status: 400 }
      );
    }

    if (booking.review) {
      return NextResponse.json(
        { error: "You've already reviewed this trip" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        tourId: booking.tourId,
        bookingId: booking.id,
        rating: ratingNum,
        title: title?.trim() || null,
        comment: comment.trim(),
      },
    });

    return NextResponse.json({ review });
  } catch (err: any) {
    console.error("[reviews/create]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to create review" },
      { status: 500 }
    );
  }
}