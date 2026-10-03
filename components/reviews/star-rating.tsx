import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
  className?: string;
};

export function StarRating({
  rating,
  size = "md",
  showValue = false,
  count,
  className,
}: Props) {
  const sizeClass = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  const rounded = Math.round(rating * 2) / 2; // round to nearest 0.5

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.floor(rounded);
          const half = !filled && i - 0.5 === rounded;

          return (
            <span key={i} className="relative inline-block">
              <Star
                className={cn(
                  sizeClass,
                  "text-muted-foreground/30"
                )}
              />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? "50%" : "100%" }}
                >
                  <Star
                    className={cn(
                      sizeClass,
                      "fill-amber-400 text-amber-400"
                    )}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      )}

      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}