"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  image: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920",
    title: "Discover your next adventure",
    subtitle:
      "Handpicked tours, trusted guides, and unforgettable memories — booked in minutes.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920",
    title: "Escape to tropical paradise",
    subtitle:
      "Bali, Maldives, and beyond — luxury escapes designed for the modern traveler.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920",
    title: "Explore the Middle East",
    subtitle:
      "From Dubai's skyline to Istanbul's bazaars — immersive cultural journeys.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920",
    title: "Fall in love with Europe",
    subtitle:
      "Romantic canals, historic streets, and unforgettable sunsets await.",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance every 3s
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  };

  return (
    <section
      className="relative h-[92svh] min-h-190 w-full overflow-hidden md:h-[85vh] md:min-h-140"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Text content (updates with index) */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-4 pt-10 text-white sm:px-6 sm:pt-16 md:justify-center md:pt-0">
        <h1 className="max-w-3xl text-3xl font-bold leading-tight transition-opacity duration-700 sm:text-4xl md:text-6xl">
          {slides[index].title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-white/90 transition-opacity duration-700 sm:mt-4 sm:text-lg md:text-xl">
          {slides[index].subtitle}
        </p>

        {/* Search bar + quick chips live OUTSIDE slider in parent */}
      </div>

      {/* Left arrow */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 md:left-6 md:flex md:h-12 md:w-12"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 md:right-6 md:flex md:h-12 md:w-12"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}