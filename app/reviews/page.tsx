import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewAdminActions } from "./review-admin-actions";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ rating?: string }>;
};

export default async function AdminReviewsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const where: any = {};
  if (sp.rating) where.rating = Number(sp.rating);

  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: { select: { name: true, email: true, image: true } },
      tour: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Filter by rating */}
      <div className="flex flex-wrap gap-2">
        {["", "5", "4", "3", "2", "1"].map((r) => (
          <Link
            key={r || "all"}
            href={r ? `/admin/reviews?rating=${r}` : "/admin/reviews"}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              (sp.rating ?? "") === r
                ? "border-[#00aa6c] bg-[#00aa6c] text-white"
                : "hover:bg-muted"
            }`}
          >
            {r ? `${r} ★` : "All"}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name ?? "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00aa6c] text-sm font-semibold text-white">
                      {(review.user.name ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {review.user.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {format(review.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <ReviewAdminActions reviewId={review.id} />
              </div>

              <div className="mt-3">
                <Link
                  href={`/tours/${review.tour.slug}`}
                  className="text-sm font-medium text-[#00aa6c] hover:underline"
                >
                  {review.tour.title} →
                </Link>
              </div>

              {review.title && (
                <h4 className="mt-3 font-semibold">{review.title}</h4>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}