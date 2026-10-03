import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

export function ToursPagination({ currentPage, totalPages, searchParams }: Props) {
  function pageHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/tours${qs ? `?${qs}` : ""}`;
  }

  // Generate page numbers with ellipsis
  const pages: (number | "...")[] = [];
  const showAround = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - showAround && i <= currentPage + showAround)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition",
              p === currentPage
                ? "border-[#00aa6c] bg-[#00aa6c] font-semibold text-white"
                : "hover:bg-muted"
            )}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border opacity-40">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}