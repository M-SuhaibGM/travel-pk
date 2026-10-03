import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/status-badge";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function AdminBookingsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const where: any = {};
  if (sp.status && sp.status !== "ALL") where.status = sp.status as BookingStatus;
  if (sp.q) {
    where.OR = [
      { fullName: { contains: sp.q } },
      { email: { contains: sp.q } },
      { reference: { contains: sp.q } },
      { tour: { title: { contains: sp.q } } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      tour: { select: { title: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const active = sp.status ?? "ALL";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bookings</h2>
        <p className="text-sm text-muted-foreground">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </p>
      </div>

      {/* Search + filters */}
      <form className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search name, email, ref, tour..."
          className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c]"
        />
        <button
          type="submit"
          className="h-10 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={t.value === "ALL" ? "/admin/bookings" : `/admin/bookings?status=${t.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === t.value
                ? "bg-[#00aa6c] text-white"
                : "border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Tour</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">
                        {b.reference.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.fullName}</p>
                      <p className="text-xs text-muted-foreground">{b.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-1 max-w-50">{b.tour.title}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {format(b.startDate, "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${Number(b.totalPrice).toFixed(0)} {b.currency}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {format(b.createdAt, "MMM d, h:mm a")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}