import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Compass } from "lucide-react";
import { SignInButtons } from "./sign-in-buttons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920"
        alt="Travel background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-background/95 p-8 shadow-2xl backdrop-blur-md">
        {/* Logo */}
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2 font-bold text-lg"
        >
          <Compass className="h-6 w-6 text-primary" />
          <span>Travel</span>
        </Link>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to book your next adventure
          </p>
        </div>

        {/* Auth buttons */}
        <SignInButtons />

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}