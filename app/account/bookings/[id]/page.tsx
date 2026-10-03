import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "../page";
import { CancelBookingButton } from "./cancel-booking-button";
import { PayNowButton } from "./pay-now-button";
import { ReviewForm } from "@/components/reviews/review-form";
import { StarRating } from "@/components/reviews/star-rating";
import { Star } from "lucide-react";


export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookingDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      tour: { include: { destination: true } },
      user: { select: { id: true, name: true, email: true, image: true } },
      review: true, // 👈 ADD
    },
  });
  if (!booking || booking.userId !== session.user.id) notFound();

  const reference = booking.reference.slice(-8).toUpperCase();
  const canCancel =
    booking.status === "CONFIRMED" || booking.status === "PENDING";

  // Payment status: prefer explicit field if present, fallback to booking status
  const paymentStatus =
    (booking as any).paymentStatus ??
    (booking.status === "CONFIRMED" || booking.status === "COMPLETED"
      ? "PAID"
      : booking.status === "CANCELLED"
        ? "REFUNDED"
        : "UNPAID");

  const canPay = paymentStatus === "UNPAID" && booking.status === "PENDING";

  return (
    <div>
      {/* Back link */}
      <Link
        href="/account/bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">Booking details</h1>
            <StatusBadge status={booking.status} />
            <PaymentStatusBadge status={paymentStatus} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reference:{" "}
            <span className="font-mono font-semibold text-foreground">
              {reference}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          {canPay && <PayNowButton bookingId={booking.id} />}
          {canCancel && <CancelBookingButton bookingId={booking.id} />}
        </div>
      </div>

      {/* Unpaid warning banner */}
      {canPay && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">
              Payment not completed
            </p>
            <p className="mt-1 text-amber-800">
              Your booking is reserved but not yet paid. Complete payment now to
              confirm your spot. Unpaid bookings may be released after 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Tour card */}
      <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col sm:flex-row">
          {booking.tour.coverImage && (
            <div className="relative h-48 w-full sm:h-auto sm:w-64">
              <Image
                src={booking.tour.coverImage}
                alt={booking.tour.title}
                fill
                sizes="(max-width: 640px) 100vw, 256px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold">{booking.tour.title}</h2>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {booking.tour.destination.name},{" "}
              {booking.tour.destination.country}
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {booking.tour.summary}
            </p>
            <Link
              href={`/tours/${booking.tour.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-[#00aa6c] hover:underline"
            >
              View tour page →
            </Link>
          </div>
        </div>
      </div>

      {/* Trip details */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Section title="Trip details">
          <DetailRow
            icon={Calendar}
            label="Start date"
            value={format(booking.startDate, "EEEE, MMM d, yyyy")}
          />
          <DetailRow
            icon={Calendar}
            label="End date"
            value={format(booking.endDate, "EEEE, MMM d, yyyy")}
          />
          <DetailRow
            icon={Clock}
            label="Duration"
            value={`${booking.tour.durationDays} ${booking.tour.durationDays === 1 ? "day" : "days"
              }`}
          />
          <DetailRow
            icon={Users}
            label="Guests"
            value={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`}
          />
        </Section>

        <Section title="Traveler">
          <DetailRow icon={Users} label="Full name" value={booking.fullName} />
          <DetailRow icon={Mail} label="Email" value={booking.email} />
          {booking.phone && (
            <DetailRow icon={Phone} label="Phone" value={booking.phone} />
          )}
          {booking.notes && (
            <DetailRow icon={FileText} label="Notes" value={booking.notes} />
          )}
        </Section>
      </div>

      {/* Payment summary */}
      <div className="mt-6 rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Payment summary</h3>
          <PaymentStatusBadge status={paymentStatus} />
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              ${Number(booking.tour.price).toFixed(0)} × {booking.guests}{" "}
              {booking.guests === 1 ? "guest" : "guests"}
            </span>
            <span className="font-medium">
              ${Number(booking.totalPrice).toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3 text-base">
            <span className="font-semibold">
              {paymentStatus === "PAID" ? "Total paid" : "Total due"}
            </span>
            <span className="font-bold text-[#00aa6c]">
              ${Number(booking.totalPrice).toFixed(0)} {booking.currency}
            </span>
          </div>
        </div>
        {booking.status === "COMPLETED" && (
          <>
            {booking.review ? (
              <div className="mt-6 rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <h3 className="text-lg font-semibold">Your review</h3>
                </div>
                <div className="mt-4">
                  <StarRating rating={booking.review.rating} size="md" />
                  {booking.review.title && (
                    <p className="mt-3 font-semibold">{booking.review.title}</p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                    {booking.review.comment}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Posted{" "}
                    {format(booking.review.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <ReviewForm
                  bookingId={booking.id}
                  tourTitle={booking.tour.title}
                />
              </div>
            )}
          </>
        )}

        {/* Payment meta */}
        <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted-foreground">
          {(booking as any).paidAt && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00aa6c]" />
              Paid on{" "}
              {format(new Date((booking as any).paidAt), "MMM d, yyyy · h:mm a")}
            </div>
          )}
          {(booking as any).paymentIntentId && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5" />
              Payment ID:{" "}
              <span className="font-mono">
                {(booking as any).paymentIntentId.slice(0, 20)}…
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
          {canPay && <PayNowButton bookingId={booking.id} variant="solid" />}
          {paymentStatus === "PAID" && (
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Download receipt (coming soon)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAYMENT STATUS BADGE
// ==========================================
function PaymentStatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    PAID: {
      label: "Paid",
      className: "bg-[#00aa6c]/10 text-[#00aa6c] border-[#00aa6c]/30",
      icon: CheckCircle2,
    },
    UNPAID: {
      label: "Payment pending",
      className: "bg-amber-100 text-amber-700 border-amber-300",
      icon: AlertCircle,
    },
    FAILED: {
      label: "Payment failed",
      className: "bg-red-100 text-red-700 border-red-300",
      icon: XCircle,
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-gray-100 text-gray-700 border-gray-300",
      icon: CheckCircle2,
    },
  };

  const c = config[status] ?? config.UNPAID;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${c.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}

// ==========================================
// HELPERS
// ==========================================
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}