import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#00aa6c]/10">
          <Compass className="h-10 w-10 text-[#00aa6c]" />
        </div>

        {/* Code */}
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[#00aa6c]">
          404
        </p>

        {/* Title */}
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          Looks like you&apos;re off the map
        </h1>

        {/* Description */}
        <p className="mt-4 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button
              size="lg"
              className="w-full bg-[#00aa6c] text-white hover:bg-[#008f5b] sm:w-auto"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <Link href="/tours">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Browse tours
            </Button>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-10 border-t pt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Popular pages
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { label: "Destinations", href: "/destinations" },
              { label: "My bookings", href: "/account/bookings" },
              { label: "Help center", href: "/help" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-[#00aa6c]"
              >
                {link.label}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}