import { StarRating } from "./star-rating";
import type { RatingStats } from "@/lib/reviews";

export function RatingSummary({ stats }: { stats: RatingStats }) {
  if (stats.count === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          No ratings yet. Be the first to review this tour!
        </p>
      </div>
    );
  }

  const total = stats.count;
  const levels = [5, 4, 3, 2, 1] as const;

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[200px_1fr]">
        {/* Left: big number */}
        <div className="flex flex-col items-center justify-center border-b pb-4 sm:border-b-0 sm:border-r sm:pb-0">
          <p className="text-5xl font-bold">
            {stats.average.toFixed(1)}
          </p>
          <StarRating
            rating={stats.average}
            size="md"
            className="mt-2"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Based on {total} {total === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Right: distribution bars */}
        <div className="space-y-2">
          {levels.map((level) => {
            const count = stats.distribution[level];
            const pct = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={level} className="flex items-center gap-3 text-sm">
                <span className="flex w-12 items-center gap-1 text-muted-foreground">
                  {level}
                  <span className="text-xs">★</span>
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-10 text-right text-xs text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}