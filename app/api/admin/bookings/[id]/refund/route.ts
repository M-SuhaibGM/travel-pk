import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/server";

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
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { amount } = await req.json();

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // 1. Find the PaymentIntent for this booking
  const intents = await stripe.paymentIntents.list({ limit: 100 });
  const match = intents.data.find(
    (pi) => pi.metadata?.bookingId === booking.id && pi.status === "succeeded"
  );

  if (!match) {
    return NextResponse.json(
      { error: "No successful payment found for this booking" },
      { status: 400 }
    );
  }

  // 2. Fetch the Charge to read amount_refunded
  const latestChargeId =
    typeof match.latest_charge === "string"
      ? match.latest_charge
      : match.latest_charge?.id;

  if (!latestChargeId) {
    return NextResponse.json(
      { error: "No charge found for this payment" },
      { status: 400 }
    );
  }

  const charge = await stripe.charges.retrieve(latestChargeId);

  // 3. Calculate refundable amount
  const refundableCents = match.amount_received - charge.amount_refunded;
  const refundCents = Math.round(Number(amount) * 100);

  if (refundCents <= 0 || refundCents > refundableCents) {
    return NextResponse.json(
      { error: `Invalid refund amount. Max refundable: $${(refundableCents / 100).toFixed(2)}` },
      { status: 400 }
    );
  }

  // 4. Issue refund
  try {
    const refund = await stripe.refunds.create({
      payment_intent: match.id,
      amount: refundCents,
      reason: "requested_by_customer",
    });

    // Mark booking as CANCELLED if fully refunded
    if (refundCents === refundableCents) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ refund });
  } catch (err: any) {
    console.error("[admin/refund]", err);
    return NextResponse.json(
      { error: err.message ?? "Refund failed" },
      { status: 500 }
    );
  }
}