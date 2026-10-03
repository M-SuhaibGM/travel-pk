import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { rating, title, comment } = await req.json();

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data: any = {};
    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
        return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
      }
      data.rating = ratingNum;
    }
    if (title !== undefined) data.title = title?.trim() || null;
    if (comment !== undefined) {
      if (comment.trim().length < 10) {
        return NextResponse.json(
          { error: "Review must be at least 10 characters" },
          { status: 400 }
        );
      }
      data.comment = comment.trim();
    }

    const updated = await prisma.review.update({
      where: { id },
      data,
    });

    return NextResponse.json({ review: updated });
  } catch (err: any) {
    console.error("[reviews/update]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[reviews/delete]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to delete review" },
      { status: 500 }
    );
  }
}