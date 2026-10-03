"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/tours": "Tours",
  "/admin/destinations": "Destinations",
  "/admin/bookings": "Bookings",
  "/admin/users": "Users",
};

export function AdminHeader({ user }: { user: { name: string | null } }) {
  const pathname = usePathname();
  const title =
    titles[pathname] ??
    Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ??
    "Admin";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur lg:px-8">
      <h1 className="pl-12 text-lg font-semibold lg:pl-0">{title}</h1>
      <p className="text-sm text-muted-foreground">
        Welcome, <span className="font-medium text-foreground">{user.name ?? "Admin"}</span>
      </p>
    </header>
  );
}