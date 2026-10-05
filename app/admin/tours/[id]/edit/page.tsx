import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TourForm } from "@/components/admin/tour-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditTourPage({ params }: Props) {
  const { id } = await params;

  const [tour, destinations] = await Promise.all([
    prisma.tour.findUnique({ where: { id } }),
    prisma.destination.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!tour) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit tour</h2>
        <p className="text-sm text-muted-foreground">{tour.title}</p>
      </div>

      <TourForm
        mode="edit"
        tour={{
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          summary: tour.summary,
          description: tour.description,
          price: Number(tour.price),
          currency: tour.currency,
          durationDays: tour.durationDays,
          maxGuests: tour.maxGuests,
          coverImage: tour.coverImage ?? "",
          featured: tour.featured,
          published: tour.published,
          destinationId: tour.destinationId,
        }}
        destinations={destinations.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.country,
        }))}
      />
    </div>
  );
}