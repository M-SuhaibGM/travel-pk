import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TourActions } from "./tour-actions";
import { MapPin, Plus, Star, Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; destination?: string }>;
};

export default async function AdminToursPage({ searchParams }: Props) {
  const sp = await searchParams;

  const where: any = {};
  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q } },
      { summary: { contains: sp.q } },
    ];
  }
  if (sp.destination) where.destination = { slug: sp.destination };

  const [tours, destinations] = await Promise.all([
    prisma.tour.findMany({
      where,
      include: {
        destination: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.destination.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tours</h2>
          <p className="text-sm text-muted-foreground">
            {tours.length} {tours.length === 1 ? "tour" : "tours"}
          </p>
        </div>

        <Link href="/admin/tours/new">
          <Button className="bg-[#00aa6c] text-white hover:bg-[#008f5b]">
            <Plus className="mr-2 h-4 w-4" />
            Add tour
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <form className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search tours..."
          className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c]"
        />
        <select
          name="destination"
          defaultValue={sp.destination ?? ""}
          className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c] sm:w-56"
        >
          <option value="">All destinations</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tour</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tours.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No tours found
                  </td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {tour.coverImage ? (
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={tour.coverImage}
                              alt={tour.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-14 shrink-0 rounded-md bg-muted" />
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/tours/${tour.id}/edit`}
                            className="line-clamp-1 text-sm font-medium hover:text-[#00aa6c]"
                          >
                            {tour.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {tour.durationDays}{" "}
                            {tour.durationDays === 1 ? "day" : "days"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {tour.destination.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${Number(tour.price).toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {tour._count.bookings}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {tour.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            <Star className="h-3 w-3 fill-amber-700" />
                            Featured
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            tour.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tour.published ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <TourActions
                        tourId={tour.id}
                        published={tour.published}
                        featured={tour.featured}
                      />
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