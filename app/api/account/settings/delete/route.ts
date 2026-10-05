import { NextResponse } from "next/server";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cascade deletes happen automatically via `onDelete: Cascade`
    // in your Prisma schema (Bookings, Sessions, Accounts, Wishlist)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[account/delete]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to delete account" },
      { status: 500 }
    );
  }
}