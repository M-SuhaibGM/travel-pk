import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MapPin, Clock, Heart, ArrowRight } from "lucide-react";
import { WishlistButton } from "@/components/wishlist-button";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/wishlist");

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      tour: { include: { destination: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center gap-3">
        <Heart className="h-7 w-7 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="mt-1 text-muted-foreground">
            {items.length === 0
              ? "Tours you save will appear here"
              : `${items.length} saved ${items.length === 1 ? "tour" : "tours"}`}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 space-y-4">
          {items.map(({ tour }) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="group flex gap-4 rounded-2xl border bg-card p-4 transition hover:shadow-md sm:gap-6 sm:p-5"
            >
              {/* Image */}
              {tour.coverImage ? (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">
                  <Image
                    src={tour.coverImage}
                    alt={tour.title}
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
                        {tour.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {tour.destination.name}, {tour.destination.country}
                      </div>
                    </div>

                    {/* Remove from wishlist */}
                    <WishlistButton
                      tourId={tour.id}
                      initialWishlisted
                      size="md"
                    />
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {tour.summary}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {tour.durationDays}{" "}
                      {tour.durationDays === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="font-bold">
                    ${Number(tour.price).toFixed(0)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      / person
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-[#00aa6c] group-hover:underline">
                    View tour
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed p-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <Heart className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap the heart icon on any tour to save it for later.
      </p>
      <Link
        href="/tours"
        className="mt-6 inline-block rounded-lg bg-[#00aa6c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008f5b]"
      >
        Browse tours
      </Link>
    </div>
  );
}