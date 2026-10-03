export default function ToursLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header skeleton */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-9 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </section>

      {/* Body skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar skeleton */}
          <aside className="space-y-4">
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-20 animate-pulse rounded-lg bg-muted" />
          </aside>

          {/* Grid skeleton */}
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border bg-card"
                >
                  {/* Image placeholder */}
                  <div className="h-52 w-full animate-pulse bg-muted" />

                  {/* Content placeholder */}
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}