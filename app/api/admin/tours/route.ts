import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit-helpers";

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
    const blocked = checkRateLimit(req, {
        key: "admin-tours",
        limit: 30,
        windowMs: 60_000,
    });
    if (blocked) return blocked;

    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();

        const tour = await prisma.tour.create({
            data: {
                title: body.title,
                slug: body.slug,
                summary: body.summary,
                description: body.description,
                price: body.price,
                currency: body.currency ?? "USD",
                durationDays: body.durationDays,
                maxGuests: body.maxGuests,
                coverImage: body.coverImage || null,
                featured: body.featured ?? false,
                published: body.published ?? true,
                destinationId: body.destinationId,
            },
        });

        return NextResponse.json({ tour });
    } catch (err: any) {
        console.error("[admin/tours/create]", err);
        return NextResponse.json(
            { error: err.message ?? "Create failed" },
            { status: 500 }
        );
    }
}