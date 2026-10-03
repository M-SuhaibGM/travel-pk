import { notFound } from "next/navigation";


const VALID = [
  "about",
  "careers",
  "press",
  "blog",
  "contact",
  "deals",
  "gift-cards",
  "guides",
  "help",
  "cancellation",
  "terms",
  "privacy",
  "cookies",
  "accessibility",
];

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!VALID.includes(slug)) notFound();

  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-muted-foreground">
        This page is under construction. Please check back soon.
      </p>
    </main>
  );
}