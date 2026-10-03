import { prisma } from "@/lib/prisma";
import { TourForm } from "@/components/admin/tour-form";

export const dynamic = "force-dynamic";

export default async function NewTourPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add new tour</h2>
        <p className="text-sm text-muted-foreground">
          Create a new tour and publish it to your site
        </p>
      </div>

      <TourForm
        mode="create"
        destinations={destinations.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.country,
        }))}
      />
    </div>
  );
}