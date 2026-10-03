import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.redirect(new URL("/?subscribed=invalid", req.url));
    }

    // Store in DB (add a NewsletterSubscriber model) OR send to Resend Audience
    // For now, just log it:
    console.log("[newsletter] New subscriber:", email);

    // Simple redirect back with a success flag
    return NextResponse.redirect(new URL("/?subscribed=true", req.url));
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.redirect(new URL("/?subscribed=error", req.url));
  }
}