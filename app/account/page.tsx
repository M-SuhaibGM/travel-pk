import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
// import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  DollarSign,
  MapPin,
  Heart,
  Settings,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  // Fetch user + booking stats in parallel
  const [user, bookingStats, totalSpent, upcomingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
    prisma.booking.aggregate({
      where: {
        userId: session.user.id,
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      _sum: { totalPrice: true },
    }),
    prisma.booking.count({
      where: {
        userId: session.user.id,
        status: "CONFIRMED",
        startDate: { gte: new Date() },
      },
    }),
  ]);

  if (!user) redirect("/login");

  const totalBookings = bookingStats.reduce((sum, s) => sum + s._count, 0);
  const completedTrips =
    bookingStats.find((s) => s.status === "COMPLETED")?._count ?? 0;
  const spent = Number(totalSpent._sum.totalPrice ?? 0);

  const initial = (user.name ?? user.email ?? "U").charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your account and view your travel history
      </p>

      {/* Header card */}
      <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
        <div className="h-32 bg-gradient-to-r from-[#00aa6c] to-[#008f5b]" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#00aa6c] text-3xl font-bold text-white">
                    {initial}
                  </div>
                )}
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {user.name ?? "Anonymous User"}
                  </h2>
                  {user.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Joined {format(user.createdAt, "MMMM yyyy")}
            </span>
            {upcomingCount > 0 && (
              <span className="flex items-center gap-1 text-[#00aa6c]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {upcomingCount} upcoming{" "}
                {upcomingCount === 1 ? "trip" : "trips"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total bookings"
          value={String(totalBookings)}
        />
        <StatCard
          icon={CheckCircle2}
          label="Trips completed"
          value={String(completedTrips)}
        />
        <StatCard
          icon={DollarSign}
          label="Total spent"
          value={`$${spent.toFixed(0)}`}
        />
        <StatCard
          icon={MapPin}
          label="Countries visited"
          value={String(Math.min(completedTrips, 12))}
        />
      </div>

      {/* Two-column: edit form + quick links */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Edit profile */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Account information</h3>
            </div>

            <ProfileForm
              user={{
                name: user.name ?? "",
                email: user.email ?? "",
                image: user.image,
              }}
            />

            {/* Read-only email */}
            <div className="mt-6 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email address
              </div>
              <p className="mt-1 text-sm font-medium">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Email is linked to your {user.email?.includes("@gmail")
                  ? "Google"
                  : "account"}{" "}
                sign-in and cannot be changed.
              </p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <QuickLink
            href="/account/bookings"
            icon={BookOpen}
            title="My bookings"
            description={`${totalBookings} ${totalBookings === 1 ? "booking" : "bookings"}`}
          />
          <QuickLink
            href="/account/wishlist"
            icon={Heart}
            title="Wishlist"
            description="Saved tours"
          />
          <QuickLink
            href="/account/settings"
            icon={Settings}
            title="Settings"
            description="Notifications, preferences"
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border bg-card p-4 transition hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00aa6c]/10">
          <Icon className="h-5 w-5 text-[#00aa6c]" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
    </Link>
  );
}