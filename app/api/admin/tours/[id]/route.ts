import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === "ADMIN" ? user : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  // Whitelist fields
  const data: any = {};
  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.featured === "boolean") data.featured = body.featured;
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.summary === "string") data.summary = body.summary.trim();
  if (typeof body.description === "string") data.description = body.description;
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.durationDays !== undefined) data.durationDays = Number(body.durationDays);
  if (body.maxGuests !== undefined) data.maxGuests = Number(body.maxGuests);

  const tour = await prisma.tour.update({ where: { id }, data });
  return NextResponse.json({ tour });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}