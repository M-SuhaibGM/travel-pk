import { prisma } from "@/lib/db";

export type RatingStats = {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};

export async function getTourRatingStats(tourId: string): Promise<RatingStats> {
  const reviews = await prisma.review.groupBy({
    by: ["rating"],
    where: { tourId, published: true },
    _count: { rating: true },
  });

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let count = 0;

  for (const r of reviews) {
    const rating = r.rating as 1 | 2 | 3 | 4 | 5;
    distribution[rating] = r._count.rating;
    total += rating * r._count.rating;
    count += r._count.rating;
  }

  return {
    average: count > 0 ? total / count : 0,
    count,
    distribution,
  };
}

export async function getTourRatingStatsBatch(tourIds: string[]) {
  const reviews = await prisma.review.groupBy({
    by: ["tourId", "rating"],
    where: { tourId: { in: tourIds }, published: true },
    _count: { rating: true },
  });

  const statsMap = new Map<string, RatingStats>();

  for (const tourId of tourIds) {
    statsMap.set(tourId, {
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  }

  const totals = new Map<string, { sum: number; count: number }>();

  for (const r of reviews) {
    const stats = statsMap.get(r.tourId)!;
    const rating = r.rating as 1 | 2 | 3 | 4 | 5;
    stats.distribution[rating] = r._count.rating;

    const t = totals.get(r.tourId) ?? { sum: 0, count: 0 };
    t.sum += rating * r._count.rating;
    t.count += r._count.rating;
    totals.set(r.tourId, t);
  }

  for (const [tourId, t] of totals) {
    const stats = statsMap.get(tourId)!;
    stats.average = t.count > 0 ? t.sum / t.count : 0;
    stats.count = t.count;
  }

  return statsMap;
}