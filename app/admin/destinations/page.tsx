import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Package } from "lucide-react";
import { DestinationActions } from "./destination-actions";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await prisma.destination.findMany({
    include: { _count: { select: { tours: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Destinations</h2>
          <p className="text-sm text-muted-foreground">
            {destinations.length}{" "}
            {destinations.length === 1 ? "destination" : "destinations"} ·{" "}
            {destinations.reduce((s, d) => s + d._count.tours, 0)} tours
          </p>
        </div>

        <Link href="/admin/destinations/new">
          <Button className="bg-[#00aa6c] text-white hover:bg-[#008f5b]">
            <Plus className="mr-2 h-4 w-4" />
            Add destination
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {destinations.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center">
          <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No destinations yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first destination to start organizing tours
          </p>
          <Link href="/admin/destinations/new">
            <Button className="mt-6 bg-[#00aa6c] text-white hover:bg-[#008f5b]">
              <Plus className="mr-2 h-4 w-4" />
              Add destination
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="group relative overflow-hidden rounded-2xl border bg-card transition hover:shadow-md"
            >
              {/* Action buttons (top right) */}
              <div className="absolute right-2 top-2 z-10 opacity-0 transition group-hover:opacity-100">
                <DestinationActions
                  destinationId={d.id}
                  name={d.name}
                  tourCount={d._count.tours}
                />
              </div>

              {/* Image */}
              <Link
                href={`/admin/tours?destination=${d.slug}`}
                className="block"
              >
                {d.image ? (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-muted">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link
                  href={`/admin/tours?destination=${d.slug}`}
                  className="block"
                >
                  <h3 className="font-semibold transition group-hover:text-[#00aa6c]">
                    {d.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {d.country}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    {d._count.tours}{" "}
                    {d._count.tours === 1 ? "tour" : "tours"}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}