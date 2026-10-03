"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye, EyeOff, Loader2, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

type Props = {
  tourId: string;
  published: boolean;
  featured: boolean;
};

export function TourActions({ tourId, published, featured }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(field: "published" | "featured") {
    setLoading(field);
    try {
      const res = await fetch(`/api/admin/tours/${tourId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [field]: field === "published" ? !published : !featured,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggle("featured")}
        disabled={loading !== null}
        title={featured ? "Unfeature" : "Feature"}
      >
        {loading === "featured" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : featured ? (
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        ) : (
          <StarOff className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggle("published")}
        disabled={loading !== null}
        title={published ? "Unpublish" : "Publish"}
      >
        {loading === "published" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : published ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <Link href={`/admin/tours/${tourId}/edit`}>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}