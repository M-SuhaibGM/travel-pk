import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PaymentForm } from "./payment-form";
import { parseISO } from "date-fns";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    tourId?: string;
    date?: string;
    guests?: string;
  }>;
};

export default async function BookPage({ searchParams }: Props) {
  const session = await auth();
  const sp = await searchParams;

  if (!session?.user) {
    redirect(`/login?callbackUrl=/book?tourId=${sp.tourId ?? ""}`);
  }

  const { tourId, date, guests } = sp;
  if (!tourId || !date) notFound();

  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: { destination: true },
  });

  if (!tour || !tour.published) notFound();

  const guestCount = Math.max(1, Number(guests ?? "1"));

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold">Complete your booking</h1>
        <p className="mt-1 text-muted-foreground">
          Secure payment powered by Stripe
        </p>

        <div className="mt-8">
          <PaymentForm
            tourId={tour.id}
            startDate={parseISO(date).toISOString()}
            guests={guestCount}
            fullName={session.user.name ?? ""}
            email={session.user.email ?? ""}
          />
        </div>
      </div>
    </main>
  );
}