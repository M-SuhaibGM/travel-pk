import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === "ADMIN" ? user : null;
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, slug, country, description, image } = body;

    if (!name || !slug || !country) {
      return NextResponse.json(
        { error: "Name, slug, and country are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.destination.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A destination with this slug already exists" },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        country: country.trim(),
        description: description?.trim() || null,
        image: image?.trim() || null,
      },
    });

    return NextResponse.json({ destination });
  } catch (err: any) {
    console.error("[admin/destinations/create]", err);
    return NextResponse.json(
      { error: err.message ?? "Create failed" },
      { status: 500 }
    );
  }
}