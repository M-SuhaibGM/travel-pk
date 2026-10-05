import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DestinationForm } from "@/components/admin/destination-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params;

  const destination = await prisma.destination.findUnique({
    where: { id },
    include: { _count: { select: { tours: true } } },
  });

  if (!destination) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit destination</h2>
        <p className="text-sm text-muted-foreground">
          {destination.name}, {destination.country} ·{" "}
          {destination._count.tours}{" "}
          {destination._count.tours === 1 ? "tour" : "tours"}
        </p>
      </div>

      <DestinationForm
        mode="edit"
        destination={{
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          country: destination.country,
          description: destination.description ?? "",
          image: destination.image ?? "",
        }}
      />
    </div>
  );
}