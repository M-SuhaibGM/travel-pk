import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { parseJsonArray, type ItineraryItem } from "@/lib/tour-types";
import { getTourRatingStats } from "@/lib/reviews";
import { TourGallery } from "./tour-gallery";
import { BookingSidebar } from "./booking-sidebar";
import { SimilarTours } from "./similar-tours";
import { WishlistButton } from "@/components/wishlist-button";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewList } from "@/components/reviews/review-list";
import { RatingSummary } from "@/components/reviews/rating-summary";
import { ReviewForm } from "@/components/reviews/review-form";
import { MapPin, Clock, Users, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

// ==========================================
// SEO
// ==========================================
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: { destination: true },
  });

  if (!tour) return { title: "Tour not found" };

  return {
    title: `${tour.title} — ${tour.destination.name} | Travel`,
    description: tour.summary,
    openGraph: {
      images: tour.coverImage ? [tour.coverImage] : [],
    },
  };
}

// ==========================================
// PAGE
// ==========================================
export default async function TourDetailPage({ params }: Props) {
  const session = await auth();
  const { slug } = await params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: {
      destination: true,
      _count: { select: { wishlists: true } },
    },
  });

  if (!tour || !tour.published) notFound();

  // ==========================================
  // WISHLIST STATUS
  // ==========================================
  let wishlisted = false;
  if (session?.user?.id) {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_tourId: {
          userId: session.user.id,
          tourId: tour.id,
        },
      },
    });
    wishlisted = !!item;
  }

  // ==========================================
  // RECENTLY VIEWED TRACKING
  // ==========================================
  const cookieStore = await cookies();
  const existing = cookieStore.get("recentlyViewed")?.value;

  let viewedIds: string[] = [];
  if (existing) {
    try {
      viewedIds = JSON.parse(decodeURIComponent(existing));
      if (!Array.isArray(viewedIds)) viewedIds = [];
    } catch {
      viewedIds = [];
    }
  }

  viewedIds = [tour.id, ...viewedIds.filter((id) => id !== tour.id)].slice(
    0,
    10
  );

  try {
    cookieStore.set(
      "recentlyViewed",
      encodeURIComponent(JSON.stringify(viewedIds)),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: false,
      }
    );
  } catch {
    // Next.js 16 may throw if called during render — safe to ignore,
    // we also track via middleware. Cookie persists from previous visit.
  }

  // ==========================================
  // PARSE JSON FIELDS
  // ==========================================
  const images = parseJsonArray<string>(tour.images, [tour.coverImage ?? ""]);
  const highlights = parseJsonArray<string>(tour.highlights);
  const included = parseJsonArray<string>(tour.included);
  const notIncluded = parseJsonArray<string>(tour.notIncluded);
  const itinerary = parseJsonArray<ItineraryItem>(tour.itinerary);
  const languages = parseJsonArray<string>(tour.languages, ["English"]);

  // ==========================================
  // RATINGS + REVIEWS + USER ELIGIBILITY
  // ==========================================
  const [ratingStats, reviews, userCompletedBooking, similarTours] =
    await Promise.all([
      getTourRatingStats(tour.id),
      prisma.review.findMany({
        where: { tourId: tour.id, published: true },
        include: {
          user: { select: { name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      session?.user?.id
        ? prisma.booking.findFirst({
          where: {
            userId: session.user.id,
            tourId: tour.id,
            status: "COMPLETED",
            review: null,
          },
          orderBy: { endDate: "desc" },
        })
        : null,
      prisma.tour.findMany({
        where: {
          destinationId: tour.destinationId,
          id: { not: tour.id },
          published: true,
        },
        include: { destination: true },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-muted-foreground">
          <Link href="/tours" className="hover:text-primary">
            All tours
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/tours?destination=${tour.destination.slug}`}
            className="hover:text-primary"
          >
            {tour.destination.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{tour.title}</span>
        </div>
      </div>

      {/* ============ MAIN GRID ============ */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          {/* LEFT: content */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  {tour.featured && (
                    <span className="inline-block rounded-full bg-[#00aa6c]/10 px-3 py-1 text-xs font-semibold text-[#00aa6c]">
                      Featured
                    </span>
                  )}
                  <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                    {tour.title}
                  </h1>
                </div>

                <WishlistButton
                  tourId={tour.id}
                  initialWishlisted={wishlisted}
                  variant="button"
                  className="shrink-0 self-start"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {tour.destination.name}, {tour.destination.country}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {tour.durationDays}{" "}
                  {tour.durationDays === 1 ? "day" : "days"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Max {tour.maxGuests} guests
                </span>

                {/* ⭐ Real rating */}
                {ratingStats.count > 0 ? (
                  <a
                    href="#reviews"
                    className="flex items-center gap-1.5 transition hover:text-foreground"
                  >
                    <StarRating rating={ratingStats.average} size="sm" />
                    <span className="font-medium text-foreground">
                      {ratingStats.average.toFixed(1)}
                    </span>
                    <span className="underline">({ratingStats.count})</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground">No reviews yet</span>
                )}
              </div>
            </div>

            {/* Gallery */}
            <TourGallery images={images} title={tour.title} />

            {/* Overview */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold">Overview</h2>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {tour.description}
              </p>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold">Highlights</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00aa6c]" />
                      <span className="text-sm">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Included / Not Included */}
            {(included.length > 0 || notIncluded.length > 0) && (
              <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                {included.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">
                      What&apos;s included
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00aa6c]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {notIncluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Not included</h3>
                    <ul className="mt-3 space-y-2">
                      {notIncluded.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold">Itinerary</h2>
                <ol className="mt-5 space-y-4">
                  {itinerary.map((item) => (
                    <li
                      key={item.day}
                      className="flex gap-4 rounded-xl border bg-card p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00aa6c] font-bold text-white">
                        {item.day}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Meeting point */}
            {tour.meetingPoint && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold">Meeting point</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {tour.meetingPoint}
                </p>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold">Languages</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border px-3 py-1 text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ============ REVIEWS ============ */}
            <section id="reviews" className="mt-14 scroll-mt-20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reviews</h2>
                {ratingStats.count > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {ratingStats.count}{" "}
                    {ratingStats.count === 1 ? "review" : "reviews"}
                  </span>
                )}
              </div>

              {/* Rating summary */}
              <div className="mt-5">
                <RatingSummary stats={ratingStats} />
              </div>

              {/* Review form (only if user has a completed booking) */}
              {userCompletedBooking && (
                <div className="mt-6">
                  <ReviewForm
                    bookingId={userCompletedBooking.id}
                    tourTitle={tour.title}
                  />
                </div>
              )}

              {/* Review list */}
              <div className="mt-6">
                <ReviewList reviews={reviews} />
              </div>

              {/* Show more link */}
              {ratingStats.count > 10 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing 10 of {ratingStats.count} reviews
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: sticky booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <BookingSidebar
              tourId={tour.id}
              tourSlug={tour.slug}
              price={Number(tour.price)}
              currency={tour.currency}
              maxGuests={tour.maxGuests}
              cancellationHrs={tour.cancellationHrs}
            />
          </aside>
        </div>
      </section>

      {/* Similar tours */}
      {similarTours.length > 0 && <SimilarTours tours={similarTours} />}
    </main>
  );
}