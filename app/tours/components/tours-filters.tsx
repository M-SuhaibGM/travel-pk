"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";

type Destination = {
  id: string;
  name: string;
  slug: string;
  country: string;
};

type Props = {
  destinations: Destination[];
  currentFilters: Record<string, string | undefined>;
};

const durations = [
  { label: "Any duration", value: "" },
  { label: "Up to 1 day", value: "1" },
  { label: "Up to 3 days", value: "3" },
  { label: "Up to 5 days", value: "5" },
  { label: "Up to 7 days", value: "7" },
];

const sorts = [
  { label: "Newest", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Duration: Shortest", value: "duration-asc" },
];

export function ToursFilters({ destinations, currentFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(currentFilters.q ?? "");
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice ?? "");

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset to page 1 on filter change

    startTransition(() => {
      router.push(`/tours?${params.toString()}`);
    });
  }

  function clearAll() {
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => router.push("/tours"));
  }

  const hasFilters =
    currentFilters.q ||
    currentFilters.destination ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    currentFilters.duration ||
    currentFilters.sort;

  return (
    <div className="space-y-6 rounded-2xl border bg-card p-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Search</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam("q", q || undefined);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tours..."
              className="pl-9"
            />
          </div>
          <Button type="submit" size="icon" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Destination */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Destination</label>
        <select
          value={currentFilters.destination ?? ""}
          onChange={(e) => updateParam("destination", e.target.value || undefined)}
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c]"
        >
          <option value="">All destinations</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.slug}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Price range (USD)</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateParam("minPrice", minPrice || undefined)}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateParam("maxPrice", maxPrice || undefined)}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Duration</label>
        <select
          value={currentFilters.duration ?? ""}
          onChange={(e) => updateParam("duration", e.target.value || undefined)}
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c]"
        >
          {durations.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Sort by</label>
        <select
          value={currentFilters.sort ?? ""}
          onChange={(e) => updateParam("sort", e.target.value || undefined)}
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c]"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearAll}
          disabled={isPending}
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}