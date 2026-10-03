import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentForm } from "../../payment-form";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ bookingId: string }>;
};

export default async function PayBookingPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tour: true },
  });

  if (!booking || booking.userId !== session.user.id) notFound();

  if (booking.status !== "PENDING") {
    redirect(`/account/bookings/${bookingId}`);
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-[#00aa6c]" />
          Secure checkout
        </div>

        <h1 className="mt-2 text-3xl font-bold">Complete your payment</h1>
        <p className="mt-1 text-muted-foreground">
          Finish paying for <strong>{booking.tour.title}</strong> to confirm your
          booking.
        </p>

        <div className="mt-8">
          <PaymentForm
            tourId={booking.tourId}
            startDate={booking.startDate.toISOString()}
            guests={booking.guests}
            fullName={booking.fullName}
            email={booking.email}
            phone={booking.phone ?? undefined}
            notes={booking.notes ?? undefined}
          />
        </div>
      </div>
    </main>
  );
}