"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  title: string;
};

export function TourGallery({ images, title }: Props) {
  const clean = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (clean.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl sm:aspect-video sm:rounded-2xl">
        <Image
          src={clean[active]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {clean.length > 1 && (
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {clean.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-4/3 w-24 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition sm:w-auto",
                i === active
                  ? "border-[#00aa6c]"
                  : "border-transparent hover:border-muted-foreground/40"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} ${i + 1}`}
                fill
                sizes="200px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}