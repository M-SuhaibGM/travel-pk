import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  DollarSign,
  Calendar,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    monthRevenue,
    totalBookings,
    monthBookings,
    confirmedCount,
    pendingCount,
    totalTours,
    publishedTours,
    totalUsers,
    recentBookings,
    topTours,
  ] = await Promise.all([
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { totalPrice: true },
    }),
    prisma.booking.count(),
    prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.tour.count(),
    prisma.tour.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.booking.groupBy({
      by: ["tourId"],
      _count: { tourId: true },
      _sum: { totalPrice: true },
      orderBy: { _count: { tourId: "desc" } },
      take: 5,
    }),
  ]);

  const topTourIds = topTours.map((t) => t.tourId);
  const topTourDetails = await prisma.tour.findMany({
    where: { id: { in: topTourIds } },
    select: { id: true, title: true, slug: true },
  });

  const topToursWithData = topTours.map((t) => ({
    ...t,
    tour: topTourDetails.find((d) => d.id === t.tourId),
  }));

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={`$${Number(totalRevenue._sum.totalPrice ?? 0).toFixed(0)}`}
          hint={`$${Number(monthRevenue._sum.totalPrice ?? 0).toFixed(0)} this month`}
          icon={DollarSign}
          accent="green"
        />
        <StatCard
          label="Total bookings"
          value={totalBookings}
          hint={`${monthBookings} this month`}
          icon={Calendar}
          accent="blue"
        />
        <StatCard
          label="Tours"
          value={`${publishedTours}/${totalTours}`}
          hint="Published / Total"
          icon={Package}
          accent="purple"
        />
        <StatCard
          label="Users"
          value={totalUsers}
          hint={`${confirmedCount} confirmed · ${pendingCount} pending`}
          icon={Users}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* Recent bookings */}
        <div className="rounded-2xl border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent bookings</h2>
              <p className="text-xs text-muted-foreground">
                Latest 8 bookings across all users
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-1 text-sm font-medium text-[#00aa6c] hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y">
            {recentBookings.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No bookings yet
              </p>
            ) : (
              recentBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between gap-4 p-4 transition hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {b.tour.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {b.user.name ?? b.user.email} ·{" "}
                      {format(b.createdAt, "MMM d, h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      ${Number(b.totalPrice).toFixed(0)}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top tours */}
        <div className="rounded-2xl border bg-card">
          <div className="border-b p-5">
            <h2 className="font-semibold">Top tours</h2>
            <p className="text-xs text-muted-foreground">
              Most booked experiences
            </p>
          </div>

          <div className="divide-y">
            {topToursWithData.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No data yet
              </p>
            ) : (
              topToursWithData.map((t, i) => (
                <Link
                  key={t.tourId}
                  href={`/admin/tours/${t.tourId}/edit`}
                  className="flex items-center gap-3 p-4 transition hover:bg-muted/50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {t.tour?.title ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t._count.tourId} bookings
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#00aa6c]">
                    ${Number(t._sum.totalPrice ?? 0).toFixed(0)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}