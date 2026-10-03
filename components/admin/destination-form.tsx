"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  Loader2,
  Save,
  Trash2,
  ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Destination = {
  id?: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  image: string;
};

type Props = {
  mode: "create" | "edit";
  destination?: Destination;
};

export function DestinationForm({ mode, destination }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Destination>(
    destination ?? {
      name: "",
      slug: "",
      country: "",
      description: "",
      image: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof Destination>(key: K, value: Destination[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function autoSlug(name: string) {
    return name
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
          ? "/api/admin/destinations"
          : `/api/admin/destinations/${destination?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      toast.success(
        mode === "create" ? "Destination created" : "Destination updated"
      );
      router.push("/admin/destinations");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!destination?.id) return;
    if (!confirm("Delete this destination? This cannot be undone.")) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/destinations/${destination.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");

      toast.success("Destination deleted");
      router.push("/admin/destinations");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Delete failed");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ============ BASIC INFO ============ */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Basic info</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name *</label>
            <Input
              required
              value={form.name}
              onChange={(e) => {
                update("name", e.target.value);
                if (mode === "create") update("slug", autoSlug(e.target.value));
              }}
              placeholder="e.g. Bali"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Country *
            </label>
            <Input
              required
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. Indonesia"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Slug *</label>
            <Input
              required
              value={form.slug}
              onChange={(e) => update("slug", autoSlug(e.target.value))}
              placeholder="bali"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              URL-friendly identifier
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short paragraph about this destination..."
            />
          </div>
        </div>
      </div>

      {/* ============ IMAGE UPLOAD ============ */}
      <div className="rounded-2xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Cover image</h3>

        {form.image ? (
          /* Preview with remove button */
          <div className="space-y-3">
            <div className="relative h-56 w-full overflow-hidden rounded-xl border bg-muted sm:h-72">
              <Image
                src={form.image}
                alt={form.name || "Destination preview"}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => update("image", "")}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate font-mono">{form.image}</span>
              <button
                type="button"
                onClick={() => update("image", "")}
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
              endpoint="destinationImage"
              onUploadBegin={() => setUploading(true)}
              onClientUploadComplete={(res) => {
                setUploading(false);
                if (res?.[0]?.ufsUrl) {
                  update("image", res[0].ufsUrl);
                  toast.success("Image uploaded");
                }
              }}
              onUploadError={(error) => {
                setUploading(false);
                toast.error(error.message ?? "Upload failed");
              }}
              appearance={{
                container:
                  "border-0 bg-muted/30 p-8 ut-uploading:opacity-80",
                label: "text-sm font-medium text-foreground hover:text-[#00aa6c]",
                allowedContent: "text-xs text-muted-foreground",
                button:
                  "bg-[#00aa6c] text-white text-sm font-medium hover:bg-[#008f5b] ut-uploading:bg-muted ut-uploading:text-muted-foreground",
              }}
              content={{
                label: uploading
                  ? "Uploading..."
                  : "Choose a file or drag & drop",
                allowedContent:
                  "PNG, JPG, or WebP · Max 4MB · 1 image",
                button({ isUploading }) {
                  return isUploading ? "Uploading..." : "Select image";
                },
              }}
            />
          </div>
        )}
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
            Delete destination
          </Button>
        ) : (
          <span />
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
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
                {mode === "create" ? "Create destination" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}