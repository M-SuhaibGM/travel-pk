import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === "ADMIN" ? user : null;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tour: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: booking.email,
      subject: `Booking confirmed: ${booking.tour.title}`,
      react: BookingConfirmationEmail({
        name: booking.fullName,
        tourTitle: booking.tour.title,
        reference: booking.reference.slice(-8).toUpperCase(),
        startDate: booking.startDate.toISOString(),
        guests: booking.guests,
        total: Number(booking.totalPrice),
        currency: booking.currency,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin/resend]", err);
    return NextResponse.json(
      { error: err.message ?? "Email failed" },
      { status: 500 }
    );
  }
}