export default function TourDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-muted" />

            <div className="space-y-3 pt-6">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 rounded-2xl border bg-card p-6">
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>
    </main>
  );
}