"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Calendar,
  Users,
  Compass,
  Home,
  LogOut,
  Menu,
  Star,
} from "lucide-react";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tours", label: "Tours", icon: Package },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: Star },   // 👈 add
  { href: "/admin/users", label: "Users", icon: Users },
];

type Props = {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <Sheet    >
      {/* Trigger button — this opens the drawer */}
      <SheetTrigger className="mt-12 " asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-2 top-4 z-40 shadow-md"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* Drawer */}
      <SheetContent aria-describedby={undefined} side="left" className="w-64 p-0">
        {/* Header with built-in X close button (top-right) */}
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-left">
            <Compass className="h-6 w-6 text-[#00aa6c]" />
            <span>Admin Panel</span>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-[#00aa6c] text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Back to site
          </Link>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Admin"}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00aa6c] text-sm font-semibold text-white">
                {(user.name ?? user.email ?? "A").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">
                {user.name ?? "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-muted-foreground transition hover:text-destructive"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}