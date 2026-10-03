import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tourId } = await req.json();
    if (!tourId) {
      return NextResponse.json(
        { error: "tourId is required" },
        { status: 400 }
      );
    }

    // Verify tour exists
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    // Upsert — idempotent
    const item = await prisma.wishlist.upsert({
      where: {
        userId_tourId: {
          userId: session.user.id,
          tourId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        tourId,
      },
    });

    return NextResponse.json({ item });
  } catch (err: any) {
    console.error("[wishlist/add]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tourId } = await req.json();
    if (!tourId) {
      return NextResponse.json(
        { error: "tourId is required" },
        { status: 400 }
      );
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: session.user.id,
        tourId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[wishlist/remove]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}