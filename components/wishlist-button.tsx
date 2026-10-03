"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  tourId: string;
  initialWishlisted?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
  className?: string;
};

export function WishlistButton({
  tourId,
  initialWishlisted = false,
  size = "md",
  variant = "icon",
  className,
}: Props) {
  const router = useRouter();
  const { status } = useSession();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      toast.message("Sign in to save tours");
      router.push(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }

    setLoading(true);
    const wasWishlisted = wishlisted;
    setWishlisted(!wasWishlisted); // Optimistic

    try {
      const res = await fetch("/api/wishlist", {
        method: wasWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(
        wasWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
      router.refresh();
    } catch {
      setWishlisted(wasWishlisted); // Revert
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
          wishlisted
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-border hover:bg-muted",
          className
        )}
      >
        {loading ? (
          <Loader2 className={cn(sizeClass, "animate-spin")} />
        ) : (
          <Heart
            className={cn(
              sizeClass,
              wishlisted && "fill-red-500 text-red-500"
            )}
          />
        )}
        {wishlisted ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border bg-background/90 backdrop-blur transition hover:bg-background",
        wishlisted && "border-red-200",
        className
      )}
    >
      {loading ? (
        <Loader2 className={cn(sizeClass, "animate-spin text-muted-foreground")} />
      ) : (
        <Heart
          className={cn(
            sizeClass,
            wishlisted
              ? "fill-red-500 text-red-500"
              : "text-foreground"
          )}
        />
      )}
    </button>
  );
}