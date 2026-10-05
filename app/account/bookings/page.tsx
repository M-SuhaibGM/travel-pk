import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Calendar, Users, MapPin, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function MyBookingsPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/bookings");

  const { status } = await searchParams;

  const where: any = { userId: session.user.id };
  if (status && status !== "ALL") {
    where.status = status as BookingStatus;
  }

  const [bookings, counts] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { tour: { include: { destination: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
  ]);

  const total = counts.reduce((sum, c) => sum + c._count, 0);
  const statusCount = (s: BookingStatus) =>
    counts.find((c) => c.status === s)?._count ?? 0;

  const tabs = [
    { label: "All", value: "ALL", count: total },
    { label: "Upcoming", value: "CONFIRMED", count: statusCount("CONFIRMED") },
    { label: "Pending", value: "PENDING", count: statusCount("PENDING") },
    { label: "Completed", value: "COMPLETED", count: statusCount("COMPLETED") },
    { label: "Cancelled", value: "CANCELLED", count: statusCount("CANCELLED") },
  ];

  const activeTab = status ?? "ALL";

  return (
    <div>
      <h1 className="text-3xl font-bold">My bookings</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your trips and view past bookings
      </p>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "ALL"
                ? "/account/bookings"
                : `/account/bookings?status=${tab.value}`
            }
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.value
                ? "bg-[#00aa6c] text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab.value
                    ? "bg-white/20"
                    : "bg-muted-foreground/20"
                }`}
              >
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Bookings list */}
      {bookings.length === 0 ? (
        <EmptyState activeTab={activeTab} />
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/account/bookings/${booking.id}`}
              className="group flex gap-4 rounded-2xl border bg-card p-4 transition hover:shadow-md sm:gap-6 sm:p-5"
            >
              {/* Image */}
              {booking.tour.coverImage ? (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">
                  <Image
                    src={booking.tour.coverImage}
                    alt={booking.tour.title}
                    fill
                    sizes="128px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-muted sm:h-32 sm:w-32">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold leading-tight sm:text-lg">
                        {booking.tour.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.tour.destination.name},{" "}
                        {booking.tour.destination.country}
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(booking.startDate, "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.tour.durationDays}{" "}
                      {booking.tour.durationDays === 1 ? "day" : "days"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {booking.guests}{" "}
                      {booking.guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-muted-foreground">
                    Ref:{" "}
                    <span className="font-mono font-medium text-foreground">
                      {booking.reference.slice(-8).toUpperCase()}
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      ${Number(booking.totalPrice).toFixed(0)}{" "}
                      {booking.currency}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================
function EmptyState({ activeTab }: { activeTab: string }) {
  const messages: Record<string, string> = {
    ALL: "You haven't booked any tours yet.",
    CONFIRMED: "No upcoming bookings.",
    PENDING: "No pending bookings.",
    COMPLETED: "No completed trips yet.",
    CANCELLED: "No cancelled bookings.",
  };

  return (
    <div className="mt-10 rounded-2xl border border-dashed p-16 text-center">
      <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">
        {messages[activeTab] ?? "No bookings found"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {activeTab === "ALL"
          ? "Discover amazing tours and start your next adventure."
          : "Try a different filter."}
      </p>
      {activeTab === "ALL" && (
        <Link
          href="/tours"
          className="mt-6 inline-block rounded-lg bg-[#00aa6c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008f5b]"
        >
          Browse tours
        </Link>
      )}
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}