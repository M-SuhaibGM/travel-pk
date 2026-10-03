import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewActions } from "./review-actions";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
    const reviews = await prisma.review.findMany({
        include: {
            user: { select: { name: true, email: true, image: true } },
            tour: { select: { title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const stats = {
        total: reviews.length,
        avg:
            reviews.length === 0
                ? 0
                : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length,
        hidden: reviews.filter((r) => !r.published).length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Reviews</h2>
                <p className="text-sm text-muted-foreground">
                    {stats.total} reviews · {stats.avg.toFixed(1)} avg ·{" "}
                    {stats.hidden} hidden
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Reviewer</th>
                                <th className="px-4 py-3 font-medium">Tour</th>
                                <th className="px-4 py-3 font-medium">Rating</th>
                                <th className="px-4 py-3 font-medium">Comment</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        No reviews yet
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((r) => (
                                    <tr key={r.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {r.user.image ? (
                                                    <Image
                                                        src={r.user.image}
                                                        alt={r.user.name ?? "User"}
                                                        width={28}
                                                        height={28}
                                                        className="h-7 w-7 rounded-full object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                        {(r.user.name ?? "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="truncate">{r.user.name ?? "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/tours/${r.tour.slug}`}
                                                target="_blank"
                                                className="line-clamp-1 max-w-50 text-[#00aa6c] hover:underline"
                                            >
                                                {r.tour.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StarRating rating={r.rating} size="sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="line-clamp-2 max-w-xs text-xs text-muted-foreground">
                                                {r.title && (
                                                    <span className="font-medium text-foreground">
                                                        {r.title} —{" "}
                                                    </span>
                                                )}
                                                {r.comment}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {format(r.createdAt, "MMM d, yyyy")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.published
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {r.published ? "Hidden" : "Published"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <ReviewActions
                                                reviewId={r.id}
                                                hidden={!r.published}
                                                published={r.published}
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