import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Globe2,
  Headphones,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { HeroSlider } from "@/components/hero-slider";

// ==========================================
// DATA FETCHERS
// ==========================================
async function getFeaturedTours() {
  return prisma.tour.findMany({
    where: { published: true, featured: true },
    include: { destination: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getTopDestinations() {
  return prisma.destination.findMany({
    include: {
      _count: { select: { tours: { where: { published: true } } } },
    },
    orderBy: { tours: { _count: "desc" } },
    take: 6,
  });
}

async function getTopCities() {
  // Use destinations grouped by country — pick unique countries as "cities"
  return prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      country: true,
      image: true,
      _count: { select: { tours: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
    take: 12,
  });
}

/**
 * Read recently-viewed tour IDs from cookie set by the tour detail page.
 * Falls back to featured tours if none exist.
 */
async function getRecommendedTours() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("recentlyViewedSlugs")?.value;

  let slugs: string[] = [];
  if (raw) {
    try {
      slugs = JSON.parse(decodeURIComponent(raw));
    } catch {
      slugs = [];
    }
  }

  if (slugs.length > 0) {
    const viewed = await prisma.tour.findMany({
      where: { slug: { in: slugs } },
      select: { destinationId: true },
    });
    const destinationIds = [...new Set(viewed.map((t) => t.destinationId))];

    const recommended = await prisma.tour.findMany({
      where: {
        published: true,
        slug: { notIn: slugs },
        destinationId: { in: destinationIds },
      },
      include: { destination: true },
      take: 6,
      orderBy: { featured: "desc" },
    });

    if (recommended.length >= 3) return recommended;
  }

  return prisma.tour.findMany({
    where: { published: true },
    include: { destination: true },
    take: 6,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

// ==========================================
// PAGE
// ==========================================
export default async function HomePage() {
  // await new Promise((r) => setTimeout(r, 3000));
  const [tours, destinations, cities, recommended] = await Promise.all([
    getFeaturedTours().catch(() => []),
    getTopDestinations().catch(() => []),
    getTopCities().catch(() => []),
    getRecommendedTours().catch(() => []),
  ]);

  return (
    <main className="min-h-screen bg-background">
      {/* ============ HERO ============ */}
      <div className="relative">
        <HeroSlider />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-16">
          <div className="pointer-events-auto mx-auto max-w-7xl px-6">
            <form
              action="/tours"
              className="grid w-full max-w-4xl grid-cols-1 gap-2 rounded-2xl bg-white/95 p-3 shadow-xl md:grid-cols-4"
            >
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input
                  name="destination"
                  placeholder="Where to?"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="date"
                  name="date"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  defaultValue={2}
                  name="guests"
                  placeholder="Guests"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-full w-full gap-2">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white">
              {["Bali", "Paris", "Dubai", "Istanbul", "Maldives"].map((d) => (
                <Link
                  key={d}
                  href={`/tours?destination=${d.toLowerCase()}`}
                  className="rounded-full border border-white/40 px-4 py-1.5 backdrop-blur transition hover:bg-white/20"
                >
                  {d}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ TRUST BAR ============ */}
      <section className="border-b bg-muted/30 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {[
            { icon: Globe2, label: "500+ Destinations" },
            { icon: ShieldCheck, label: "Secure Payments" },
            { icon: Headphones, label: "24/7 Support" },
            { icon: Star, label: "4.8/5 Rated" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED TOURS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Tours</h2>
            <p className="mt-1 text-muted-foreground">
              Our most-loved experiences around the world
            </p>
          </div>
          <Link href="/tours">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>

        {tours.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            No featured tours yet. Add some from the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* ============ TOP DESTINATIONS ============ */}
      {destinations.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#00aa6c]">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </div>
                <h2 className="mt-2 text-3xl font-bold">Top Destinations</h2>
                <p className="mt-1 text-muted-foreground">
                  Explore the most popular places to visit
                </p>
              </div>
              <Link href="/destinations">
                <Button variant="ghost">View all →</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/tours?destination=${d.slug}`}
                  className="group relative h-64 overflow-hidden rounded-2xl"
                >
                  {d.image && (
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
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
          </div>
        </section>
      )}

      {/* ============ RECOMMENDED FOR YOU ============ */}
      {recommended.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#00aa6c]">
                <Sparkles className="h-4 w-4" />
                Personalized
              </div>
              <h2 className="mt-2 text-3xl font-bold">
                Recommended for you
              </h2>
              <p className="mt-1 text-muted-foreground">
                Based on tours you&apos;ve recently viewed
              </p>
            </div>
            <Link href="/tours">
              <Button variant="ghost">See more →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </section>
      )}

      {/* ============ TOP CITIES ============ */}
      {cities.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Top cities to explore</h2>
              <p className="mt-1 text-muted-foreground">
                Popular destinations our travelers love
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {cities.slice(0, 12).map((c) => (
                <Link
                  key={c.id}
                  href={`/tours?destination=${c.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition hover:border-[#00aa6c] hover:shadow-md"
                >
                  {c.image ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="64px"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c._count.tours} tours
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/destinations">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore all destinations
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to explore the world?</h2>
          <p className="mt-3 text-muted-foreground">
            Create an account and start booking your dream trip today.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/tours">
              <Button size="lg" variant="outline">
                Browse Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ==========================================
// SHARED TOUR CARD
// ==========================================
type TourCardProps = {
  tour: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    price: any;
    durationDays: number;
    coverImage: string | null;
    destination: { name: string; country: string };
  };
};

function TourCard({ tour }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
    >
      <div className="relative h-56 w-full overflow-hidden">
        {tour.coverImage ? (
          <Image
            src={tour.coverImage}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {tour.destination.name}, {tour.destination.country}
        </div>
        <h3 className="mt-2 line-clamp-1 text-lg font-semibold">
          {tour.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {tour.summary}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${Number(tour.price).toFixed(0)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / person
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {tour.durationDays} days
          </span>
        </div>
      </div>
    </Link>
  );
}