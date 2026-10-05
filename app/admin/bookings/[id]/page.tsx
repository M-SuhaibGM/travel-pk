import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe/server";
import {
    ArrowLeft,
    Calendar,
    Users,
    MapPin,
    Clock,
    Mail,
    Phone,
    FileText,
    ExternalLink,
    CreditCard,
    User as UserIcon,
    CheckCircle2,
    Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/admin/status-badge";
import { BookingActions } from "./booking-actions";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AdminBookingDetailPage({ params }: Props) {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            tour: { include: { destination: true } },
            user: { select: { id: true, name: true, email: true, image: true } },
        },
    });

    if (!booking) notFound();

    const reference = booking.reference.slice(-8).toUpperCase();

    // Try to find the associated Stripe PaymentIntent
    let stripePayment:
        | {
            id: string;
            status: string;
            amount: number;
            amountReceived: number;
            amountRefunded: number;
            currency: string;
            created: number;
            receiptUrl: string | null;
        }
        | undefined;

    try {
        const intents = await stripe.paymentIntents.list({ limit: 100 });
        const match = intents.data.find(
            (pi) => pi.metadata?.bookingId === booking.id
        );

        if (match) {
            // Get the charge to fetch the receipt URL
            const charges = await stripe.charges.list({
                payment_intent: match.id,
                limit: 1,
            });
            const charge = charges.data[0];

            stripePayment = {
                id: match.id,
                status: match.status,
                amount: match.amount,
                amountReceived: match.amount_received,
                amountRefunded: charge?.amount_refunded ?? 0,   // ✅ from charge
                currency: match.currency,
                created: match.created,
                receiptUrl: charge?.receipt_url ?? null,
            };
        }
    } catch (err) {
        console.error("[admin/booking] Stripe lookup failed:", err);
    }

    const hasPaid = stripePayment && stripePayment.amountReceived > 0;
    const hasRefund = stripePayment && stripePayment.amountRefunded > 0;
    const refundableAmount =
        stripePayment
            ? (stripePayment.amountReceived - stripePayment.amountRefunded) / 100
            : 0;

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            {/* Back link */}
            <Link
                href="/admin/bookings"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to bookings
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold">Booking {reference}</h1>
                        <StatusBadge status={booking.status} />
                        {hasRefund && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                                Refunded
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Created {format(booking.createdAt, "MMM d, yyyy · h:mm a")}
                    </p>
                </div>

                {/* Actions dropdown */}
                <BookingActions
                    bookingId={booking.id}
                    currentStatus={booking.status}
                    refunderAmount={refundableAmount}
                    hasRefund={!!hasRefund}
                    email={booking.email}
                    reference={reference}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* Tour card */}
                    <div className="overflow-hidden rounded-2xl border bg-card">
                        <div className="flex flex-col sm:flex-row">
                            {booking.tour.coverImage && (
                                <div className="relative h-48 w-full sm:h-auto sm:w-56">
                                    <Image
                                        src={booking.tour.coverImage}
                                        alt={booking.tour.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 224px"
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 p-5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {booking.tour.destination.name},{" "}
                                    {booking.tour.destination.country}
                                </div>
                                <h2 className="mt-1 text-lg font-semibold">
                                    {booking.tour.title}
                                </h2>
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                    {booking.tour.summary}
                                </p>
                                <Link
                                    href={`/tours/${booking.tour.slug}`}
                                    target="_blank"
                                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#00aa6c] hover:underline"
                                >
                                    View public page
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trip + traveler grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Section title="Trip details" icon={Calendar}>
                            <Row
                                label="Start date"
                                value={format(booking.startDate, "EEEE, MMM d, yyyy")}
                            />
                            <Row
                                label="End date"
                                value={format(booking.endDate, "EEEE, MMM d, yyyy")}
                            />
                            <Row
                                label="Duration"
                                value={`${booking.tour.durationDays} ${booking.tour.durationDays === 1 ? "day" : "days"
                                    }`}
                            />
                            <Row
                                label="Guests"
                                value={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"
                                    }`}
                            />
                            {booking.tour.meetingPoint && (
                                <Row label="Meeting point" value={booking.tour.meetingPoint} />
                            )}
                        </Section>

                        <Section title="Traveler" icon={UserIcon}>
                            <div className="flex items-center gap-3">
                                {booking.user.image ? (
                                    <Image
                                        src={booking.user.image}
                                        alt={booking.user.name ?? "User"}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                                        {(booking.fullName ?? "U").charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{booking.fullName}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {booking.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3 border-t pt-4">
                                <a
                                    href={`mailto:${booking.email}`}
                                    className="flex items-center gap-2 text-sm transition hover:text-[#00aa6c]"
                                >
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {booking.email}
                                </a>
                                {booking.phone && (
                                    <a
                                        href={`tel:${booking.phone}`}
                                        className="flex items-center gap-2 text-sm transition hover:text-[#00aa6c]"
                                    >
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {booking.phone}
                                    </a>
                                )}
                            </div>

                            {booking.user.id && (
                                <Link
                                    href={`/admin/users`}
                                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#00aa6c] hover:underline"
                                >
                                    View user in users list →
                                </Link>
                            )}
                        </Section>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <Section title="Special requests" icon={FileText}>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {booking.notes}
                            </p>
                        </Section>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* Payment card */}
                    <div className="rounded-2xl border bg-card p-6">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">Payment</h3>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                            <Row
                                label={`${booking.currency} ${Number(booking.tour.price).toFixed(0)} × ${booking.guests}`}
                                value={`$${Number(booking.totalPrice).toFixed(0)}`}
                            />
                            <div className="flex items-center justify-between border-t pt-3">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-[#00aa6c]">
                                    ${Number(booking.totalPrice).toFixed(0)} {booking.currency}
                                </span>
                            </div>
                        </div>

                        {/* Stripe info */}
                        {stripePayment && (
                            <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span>Payment status</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 font-semibold ${stripePayment.status === "succeeded"
                                                ? "bg-green-100 text-green-700"
                                                : stripePayment.status === "processing"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {stripePayment.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Amount received</span>
                                    <span className="font-mono">
                                        ${(stripePayment.amountReceived / 100).toFixed(2)}
                                    </span>
                                </div>
                                {hasRefund && (
                                    <div className="flex items-center justify-between">
                                        <span>Refunded</span>
                                        <span className="font-mono">
                                            ${(stripePayment.amountRefunded / 100).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span>Payment ID</span>
                                    <span className="font-mono">
                                        {stripePayment.id.slice(0, 16)}…
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Paid on</span>
                                    <span>
                                        {format(
                                            new Date(stripePayment.created * 1000),
                                            "MMM d, yyyy"
                                        )}
                                    </span>
                                </div>
                                {stripePayment.receiptUrl && (
                                    <a
                                        href={stripePayment.receiptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center gap-1 text-[#00aa6c] hover:underline"
                                    >
                                        <Receipt className="h-3.5 w-3.5" />
                                        View Stripe receipt
                                    </a>
                                )}
                            </div>
                        )}

                        {!stripePayment && booking.status === "PENDING" && (
                            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
                                No payment found for this booking. The customer hasn&apos;t
                                completed checkout yet.
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="rounded-2xl border bg-card p-6">
                        <h3 className="font-semibold">Timeline</h3>
                        <div className="mt-4 space-y-4">
                            <TimelineItem
                                icon={CheckCircle2}
                                label="Booking created"
                                date={booking.createdAt}
                                active
                            />
                            {hasPaid && stripePayment && (
                                <TimelineItem
                                    icon={CreditCard}
                                    label="Payment received"
                                    date={new Date(stripePayment.created * 1000)}
                                    active
                                />
                            )}
                            {booking.status === "CONFIRMED" && (
                                <TimelineItem
                                    icon={CheckCircle2}
                                    label="Booking confirmed"
                                    date={booking.updatedAt}
                                    active
                                />
                            )}
                            {booking.status === "CANCELLED" && (
                                <TimelineItem
                                    icon={CheckCircle2}
                                    label="Booking cancelled"
                                    date={booking.updatedAt}
                                    active
                                />
                            )}
                            {booking.status === "COMPLETED" && (
                                <TimelineItem
                                    icon={CheckCircle2}
                                    label="Trip completed"
                                    date={booking.updatedAt}
                                    active
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// HELPERS
// ==========================================
function Section({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 border-b pb-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">{title}</h3>
            </div>
            <div className="mt-4 space-y-3">{children}</div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

function TimelineItem({
    icon: Icon,
    label,
    date,
    active,
}: {
    icon: any;
    label: string;
    date: Date;
    active?: boolean;
}) {
    return (
        <div className="flex items-start gap-3">
            <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${active ? "bg-[#00aa6c]/10 text-[#00aa6c]" : "bg-muted text-muted-foreground"
                    }`}
            >
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 pt-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                    {format(date, "MMM d, yyyy · h:mm a")}
                </p>
            </div>
        </div>
    );
}