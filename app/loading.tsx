import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-[#00aa6c]" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}