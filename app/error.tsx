"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, Logtail, etc.)
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-4 text-muted-foreground">
          We hit an unexpected error. Don&apos;t worry — your data is safe.
          Try refreshing the page.
        </p>

        {/* Error digest (only shows in production) */}
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={reset}
            size="lg"
            className="w-full bg-[#00aa6c] text-white hover:bg-[#008f5b] sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>

        {/* Support hint */}
        <p className="mt-10 text-xs text-muted-foreground">
          Still having trouble?{" "}
          <a
            href="mailto:support@travel.com"
            className="text-[#00aa6c] underline hover:no-underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}