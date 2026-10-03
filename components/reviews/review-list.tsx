import Image from "next/image";
import { StarRating } from "./star-rating";
import { format } from "date-fns";
import { BadgeCheck } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

type Props = {
  reviews: Review[];
};

export function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const initials = (review.user.name ?? review.user.email ?? "U")
          .charAt(0)
          .toUpperCase();

        return (
          <div
            key={review.id}
            className="rounded-2xl border bg-card p-5"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name ?? "User"}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00aa6c] text-sm font-semibold text-white">
                  {initials}
                </div>
              )}

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {review.user.name ?? "Anonymous"}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#00aa6c]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00aa6c]">
                    <BadgeCheck className="h-3 w-3" />
                    Verified traveler
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-3">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {format(review.createdAt, "MMM d, yyyy")}
                  </span>
                </div>

                {review.title && (
                  <h4 className="mt-3 font-semibold">{review.title}</h4>
                )}

                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}