import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { WishlistButton } from "@/components/wishlist-button";

type Tour = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  price: any;
  currency: string;
  durationDays: number;
  coverImage: string | null;
  featured: boolean;
  destination: {
    name: string;
    country: string;
  };
  wishlisted?: boolean; // 👈 optional flag

  avgRating?: number;
  reviewCount?: number;
};

export function ToursGrid({ tours }: { tours: Tour[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {tours.map((tour) => (
        <Link
          key={tour.id}
          href={`/tours/${tour.slug}`}
          className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
        >
          {/* Image */}
          <div className="relative h-52 w-full overflow-hidden">
            {tour.coverImage ? (
              <Image
                src={tour.coverImage}
                alt={tour.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                No image
              </div>
            )}

            {tour.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-[#00aa6c] px-2.5 py-1 text-xs font-semibold text-white shadow">
                Featured
              </span>
            )}

            {/* 👇 Wishlist heart */}
            <div className="absolute right-3 top-3">
              <WishlistButton
                tourId={tour.id}
                initialWishlisted={tour.wishlisted}
                size="md"
              />
            </div>
          </div>

          {/* Content */}
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

            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
              </span>
             // In the meta row, replace the hard-coded 4.8:
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {tour.reviewCount && tour.reviewCount > 0
                  ? `${tour.avgRating?.toFixed(1)} (${tour.reviewCount})`
                  : "New"}
              </span>

            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-lg font-bold text-primary">
                ${Number(tour.price).toFixed(0)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  / person
                </span>
              </span>
              <span className="text-xs font-medium text-[#00aa6c] group-hover:underline">
                View details →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}