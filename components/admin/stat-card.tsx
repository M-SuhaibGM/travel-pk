import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "green" | "blue" | "amber" | "purple";
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "green",
}: Props) {
  const accents: Record<string, string> = {
    green: "bg-[#00aa6c]/10 text-[#00aa6c]",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            accents[accent]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}