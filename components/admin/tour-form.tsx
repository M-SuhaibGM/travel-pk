"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { Loader2, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Tour = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  maxGuests: number;
  coverImage: string;
  featured: boolean;
  published: boolean;
  destinationId: string;
};

type Props = {
  mode: "create" | "edit";
  tour?: Tour;
  destinations: { id: string; name: string; country: string }[];
};

export function TourForm({ mode, tour, destinations }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Tour>(
    tour ?? {
      title: "",
      slug: "",
      summary: "",
      description: "",
      price: 0,
      currency: "USD",
      durationDays: 1,
      maxGuests: 10,
      coverImage: "",
      featured: false,
      published: true,
      destinationId: destinations[0]?.id ?? "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof Tour>(key: K, value: Tour[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/tours"
          : `/api/admin/tours/${tour?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      toast.success(mode === "create" ? "Tour created" : "Tour updated");
      router.push("/admin/tours");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!tour?.id) return;
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/tours/${tour.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Tour deleted");
      router.push("/admin/tours");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ============ BASIC INFO ============ */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Basic info</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Title *</label>
            <Input
              required
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (mode === "create") update("slug", autoSlug(e.target.value));
              }}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Slug *</label>
            <Input
              required
              value={form.slug}
              onChange={(e) => update("slug", autoSlug(e.target.value))}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Summary *</label>
            <Textarea
              required
              rows={2}
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Description *
            </label>
            <Textarea
              required
              rows={6}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ============ PRICING & DETAILS ============ */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Pricing & details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Price *</label>
            <Input
              required
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Currency</label>
            <Input
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Duration (days) *
            </label>
            <Input
              required
              type="number"
              min={1}
              value={form.durationDays}
              onChange={(e) => update("durationDays", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Max guests *
            </label>
            <Input
              required
              type="number"
              min={1}
              value={form.maxGuests}
              onChange={(e) => update("maxGuests", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Destination */}
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium">
            Destination *
          </label>
          <select
            required
            value={form.destinationId}
            onChange={(e) => update("destinationId", e.target.value)}
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-[#00aa6c]"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, {d.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ============ COVER IMAGE (UploadThing) ============ */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Cover image</h3>

        {form.coverImage ? (
          /* Preview with remove button */
          <div className="space-y-3">
            <div className="relative h-56 w-full overflow-hidden rounded-xl border bg-muted sm:h-72">
              <Image
                src={form.coverImage}
                alt={form.title || "Tour preview"}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => update("coverImage", "")}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate font-mono">{form.coverImage}</span>
              <button
                type="button"
                onClick={() => update("coverImage", "")}
                className="text-destructive hover:underline"
              >
                Replace image
              </button>
            </div>
          </div>
        ) : (
          /* UploadDropzone */
          <div className="overflow-hidden rounded-xl border border-dashed">
            <UploadDropzone
              endpoint="tourImage"
              onUploadBegin={() => setUploading(true)}
              onClientUploadComplete={(res) => {
                setUploading(false);
                if (res?.[0]?.url) {
                  update("coverImage", res[0].url);
                  toast.success("Cover image uploaded");
                }
              }}
              onUploadError={(error) => {
                setUploading(false);
                toast.error(error.message ?? "Upload failed");
              }}
              appearance={{
                container: "border-0 bg-muted/30 p-8 ut-uploading:opacity-80",
                label:
                  "text-sm font-medium text-foreground hover:text-[#00aa6c]",
                allowedContent: "text-xs text-muted-foreground",
                button:
                  "bg-[#00aa6c] text-white text-sm font-medium hover:bg-[#008f5b] ut-uploading:bg-muted ut-uploading:text-muted-foreground",
              }}
              content={{
                label: uploading
                  ? "Uploading..."
                  : "Choose a file or drag & drop",
                allowedContent: "PNG, JPG, or WebP · Max 4MB · 1 image",
                button({ isUploading }) {
                  return isUploading ? "Uploading..." : "Select image";
                },
              }}
            />
          </div>
        )}
      </div>

      {/* ============ VISIBILITY ============ */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Visibility</h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">Published</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">Featured on homepage</span>
          </label>
        </div>
      </div>

      {/* ============ ACTIONS ============ */}
      <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
        {mode === "edit" ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={deleting || loading}
            className="text-destructive hover:text-destructive"
          >
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete tour
          </Button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || deleting || uploading}
            className="bg-[#00aa6c] text-white hover:bg-[#008f5b]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === "create" ? "Create tour" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}