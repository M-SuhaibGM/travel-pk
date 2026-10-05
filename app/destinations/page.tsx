import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { MapPin, Search, Compass, TrendingUp, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Destinations — Explore the world | Travel",
  description:
    "Browse handpicked destinations across the globe. Find tours, activities, and unforgettable experiences.",
  openGraph: {
    title: "Destinations — Travel",
    description:
      "Browse handpicked destinations across the globe.",
    images: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
    ],
  },
};

type Props = {
  searchParams: Promise<{ q?: string; country?: string }>;
};

export default async function DestinationsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";
  const countryFilter = sp.country?.trim() ?? "";

  // ==========================================
  // FETCH DESTINATIONS
  // ==========================================
  const where: any = {};
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { country: { contains: query } },
    ];
  }
  if (countryFilter) {
    where.country = countryFilter;
  }

  const destinations = await prisma.destination.findMany({
    where,
    include: {
      _count: { select: { tours: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });

  // Split: featured = destinations with most tours, rest = the others
  const featured = [...destinations]
    .filter((d) => d._count.tours > 0)
    .sort((a, b) => b._count.tours - a._count.tours)
    .slice(0, 3);

  const featuredIds = new Set(featured.map((d) => d.id));
  const rest = destinations.filter((d) => !featuredIds.has(d.id));

  // ==========================================
  // COUNTRY FILTERS
  // ==========================================
  const allCountries = await prisma.destination.findMany({
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  const countryOptions = allCountries.map((c) => c.country);

  const totalTours = destinations.reduce(
    (sum, d) => sum + d._count.tours,
    0
  );

  return (
    <main className="min-h-screen bg-background">
      {/* ============ HERO ============ */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="h-4 w-4" />
            <span>Explore the world</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            {countryFilter
              ? `Destinations in ${countryFilter}`
              : "Find your next destination"}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Discover handpicked places across {countryOptions.length}{" "}
            countries — from tropical islands to historic cities.
          </p>

          {/* Search + country filter */}
          <form
            action="/destinations"
            className="mt-6 flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search destinations or countries..."
                className="h-11 pl-9"
              />
            </div>

            <select
              name="country"
              defaultValue={countryFilter}
              className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c] sm:w-56"
            >
              <option value="">All countries</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              className="h-11 shrink-0 bg-[#00aa6c] text-white hover:bg-[#008f5b]"
            >
              Search
            </Button>

            {(query || countryFilter) && (
              <Link href="/destinations">
                <Button type="button" variant="outline" className="h-11">
                  Clear
                </Button>
              </Link>
            )}
          </form>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <strong className="text-foreground">{destinations.length}</strong>{" "}
              {destinations.length === 1 ? "destination" : "destinations"}
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              <strong className="text-foreground">{totalTours}</strong> tours
            </span>
          </div>
        </div>
      </section>

      {/* ============ NO RESULTS ============ */}
      {destinations.length === 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border border-dashed p-16 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No destinations found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or browse all destinations.
            </p>
            <Link href="/destinations">
              <Button className="mt-6 bg-[#00aa6c] text-white hover:bg-[#008f5b]">
                Browse all
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* ============ FEATURED ============ */}
      {featured.length > 0 && !query && !countryFilter && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#00aa6c]" />
            <h2 className="text-xl font-semibold">Top destinations</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map((d) => (
              <Link
                key={d.id}
                href={`/tours?destination=${d.slug}`}
                className="group relative h-72 overflow-hidden rounded-2xl"
              >
                {d.image ? (
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    {d.country}
                  </div>
                  <h3 className="mt-1 text-2xl font-bold">{d.name}</h3>
                  <p className="mt-1 text-sm text-white/90">
                    {d._count.tours}{" "}
                    {d._count.tours === 1 ? "tour" : "tours"} available
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ ALL DESTINATIONS ============ */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {query || countryFilter
                ? `${destinations.length} ${
                    destinations.length === 1
                      ? "destination"
                      : "destinations"
                  } found`
                : "All destinations"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((d) => (
              <Link
                key={d.id}
                href={`/tours?destination=${d.slug}`}
                className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Country badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    {d.country}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold transition group-hover:text-[#00aa6c]">
                    {d.name}
                  </h3>

                  {d.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {d.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      {d._count.tours}{" "}
                      {d._count.tours === 1 ? "tour" : "tours"}
                    </span>
                    <span className="font-medium text-[#00aa6c] group-hover:underline">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Can&apos;t decide where to go?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Browse all our tours and let inspiration find you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/tours">
              <Button size="lg" className="bg-[#00aa6c] text-white hover:bg-[#008f5b]">
                Browse all tours
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}