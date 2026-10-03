import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_FIELDS = [
  "preferredCurrency",
  "preferredLanguage",
  "timezone",
  "emailBookingUpdates",
  "emailPromotions",
  "emailTripReminders",
  "emailProductNews",
  "publicProfile",
  "showEmail",
  "showTrips",
] as const;

const ALLOWED_CURRENCIES = ["USD", "EUR", "GBP", "PKR", "AED", "JPY"];
const ALLOWED_LANGUAGES = ["en", "es", "fr", "de", "ar", "ja"];

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Whitelist fields
    const data: Record<string, any> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) data[key] = body[key];
    }

    // Validate enums
    if (data.preferredCurrency && !ALLOWED_CURRENCIES.includes(data.preferredCurrency)) {
      return NextResponse.json(
        { error: "Invalid currency" },
        { status: 400 }
      );
    }

    if (data.preferredLanguage && !ALLOWED_LANGUAGES.includes(data.preferredLanguage)) {
      return NextResponse.json(
        { error: "Invalid language" },
        { status: 400 }
      );
    }

    // Boolean validation
    for (const key of [
      "emailBookingUpdates",
      "emailPromotions",
      "emailTripReminders",
      "emailProductNews",
      "publicProfile",
      "showEmail",
      "showTrips",
    ]) {
      if (key in data && typeof data[key] !== "boolean") {
        return NextResponse.json(
          { error: `${key} must be boolean` },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        preferredCurrency: true,
        preferredLanguage: true,
        emailBookingUpdates: true,
        emailPromotions: true,
        emailTripReminders: true,
        emailProductNews: true,
        publicProfile: true,
        showEmail: true,
        showTrips: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error("[account/settings]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to update settings" },
      { status: 500 }
    );
  }
}