import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";                          // 👈 MISSING IMPORT
import { ToursFilters } from "./components/tours-filters";
import { ToursGrid } from "./components/tours-grid";
import { ToursPagination } from "./components/tours-pagination";
import { Compass, SlidersHorizontal } from "lucide-react";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type SearchParams = {
  q?: string;
  destination?: string;
  minPrice?: string;
  maxPrice?: string;
  duration?: string;
  sort?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ToursPage({ searchParams }: Props) {
  const session = await auth();                         // 👈 need session
  const sp = await searchParams;

  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  // Build the Prisma where clause
  const where: Prisma.TourWhereInput = {
    published: true,
    ...(sp.q && {
      OR: [
        { title: { contains: sp.q } },
        { summary: { contains: sp.q } },
        { description: { contains: sp.q } },
      ],
    }),
    ...(sp.destination && {
      destination: { slug: sp.destination },
    }),
    ...(sp.minPrice || sp.maxPrice
      ? {
          price: {
            ...(sp.minPrice && { gte: Number(sp.minPrice) }),
            ...(sp.maxPrice && { lte: Number(sp.maxPrice) }),
          },
        }
      : {}),
    ...(sp.duration && {
      durationDays: { lte: Number(sp.duration) },
    }),
  };

  // Sort
  const orderBy: Prisma.TourOrderByWithRelationInput =
    sp.sort === "price-asc"
      ? { price: "asc" }
      : sp.sort === "price-desc"
      ? { price: "desc" }
      : sp.sort === "duration-asc"
      ? { durationDays: "asc" }
      : { createdAt: "desc" };

  // 👇 ONE Promise.all — the duplicate was the bug
  const [tours, totalCount, destinations] = await Promise.all([
    prisma.tour.findMany({
      where,
      orderBy,
      include: { destination: true },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.tour.count({ where }),
    prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, country: true },
    }),
  ]);

  // 👇 Fetch wishlist IDs if signed in
  let wishlistedIds = new Set<string>();
  if (session?.user?.id) {
    const items = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: { tourId: true },
    });
    wishlistedIds = new Set(items.map((i) => i.tourId));
  }

  // 👇 Merge wishlist flag into tours
  const toursWithWishlist = tours.map((t) => ({
    ...t,
    wishlisted: wishlistedIds.has(t.id),
  }));

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      {/* ============ HEADER ============ */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="h-4 w-4" />
            <span>All tours</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {sp.destination
              ? `Tours in ${
                  destinations.find((d) => d.slug === sp.destination)?.name ??
                  "destination"
                }`
              : "Explore all tours"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {totalCount} {totalCount === 1 ? "experience" : "experiences"} found
          </p>
        </div>
      </section>

      {/* ============ MAIN ============ */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Suspense fallback={<FiltersSkeleton />}>
              <ToursFilters destinations={destinations} currentFilters={sp} />
            </Suspense>
          </aside>

          {/* Tours grid */}
          <div>
            {toursWithWishlist.length === 0 ? (          // 👈 use merged array
              <EmptyState />
            ) : (
              <>
                <ToursGrid tours={toursWithWishlist} />   {/* 👈 pass merged */}
                {totalPages > 1 && (
                  <ToursPagination
                    currentPage={page}
                    totalPages={totalPages}
                    searchParams={sp}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed p-16 text-center">
      <SlidersHorizontal className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No tours found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your filters or search terms.
      </p>
    </div>
  );
}

// ==========================================
// SKELETON
// ==========================================
function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-lg bg-muted" />
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}