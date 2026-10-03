import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

type Tour = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  price: any;
  durationDays: number;
  coverImage: string | null;
  destination: { name: string; country: string };
};

export function SimilarTours({ tours }: { tours: Tour[] }) {
  return (
    <section className="border-t bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-bold">You might also like</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Other experiences in the same destination
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {tour.coverImage && (
                  <Image
                    src={tour.coverImage}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {tour.destination.name}
                </div>
                <h3 className="mt-2 line-clamp-1 font-semibold">
                  {tour.title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-primary">
                    ${Number(tour.price).toFixed(0)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {tour.durationDays}{" "}
                    {tour.durationDays === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}