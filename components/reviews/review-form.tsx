"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  bookingId: string;
  tourTitle: string;
  onSuccess?: () => void;
};

export function ReviewForm({ bookingId, tourTitle, onSuccess }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const labels = [
    "",
    "Terrible 😞",
    "Poor 😕",
    "Okay 🙂",
    "Good 😊",
    "Excellent 🤩",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, title, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit review");

      toast.success("Thanks for your review!");
      onSuccess?.();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-6"
    >
      <h3 className="font-semibold">
        How was your trip? <span className="text-muted-foreground">—</span>{" "}
        <span className="text-sm font-normal text-muted-foreground">
          {tourTitle}
        </span>
      </h3>

      {/* Star picker */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          Your rating
        </label>
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onClick={() => setRating(i)}
              className="transition hover:scale-110"
              aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "h-8 w-8",
                  i <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                )}
              />
            </button>
          ))}

          {(hovered || rating) > 0 && (
            <span className="ml-2 text-sm font-medium">
              {labels[hovered || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium">
          Title (optional)
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      {/* Comment */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium">
          Your review *
        </label>
        <Textarea
          required
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share what you loved (or didn't). Help other travelers decide."
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {comment.length}/2000 characters
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          disabled={loading || rating === 0}
          className="bg-[#00aa6c] text-white hover:bg-[#008f5b]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit review"
          )}
        </Button>
      </div>
    </form>
  );
}