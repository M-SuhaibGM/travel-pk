import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { User, BookOpen, Settings, Heart } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/bookings");

  const nav = [
    { href: "/account", label: "Profile", icon: User },
    { href: "/account/bookings", label: "My Bookings", icon: BookOpen },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account/settings", label: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border bg-card p-2 lg:p-4">
              <div className="mb-4 hidden border-b pb-4 lg:block">
                <p className="font-semibold">{session.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>

              <nav className="flex gap-1 overflow-x-auto lg:block lg:space-y-1 lg:overflow-visible">
                {nav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition hover:bg-muted lg:gap-3 lg:py-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}