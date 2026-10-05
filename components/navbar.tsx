import Link from "next/link";
import { auth } from "@/lib/auth";
import { Compass, Heart } from "lucide-react";
import { NavbarDiscover } from "./navbar-discover";
import { NavbarCurrency } from "./navbar-currency";
import { NavbarCountry } from "./navbar-country";
import { NavbarHelp } from "./navbar-help";
import { NavbarUserMenu } from "./navbar-user-menu";
import { Button } from "@/components/ui/button";
import { NavbarThemeToggle } from "./navbar-theme-toggle";

export async function Navbar() {
  const session = await auth();


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-350 items-center justify-between gap-4 px-6">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#00aa6c]">
              travel
            </span>
            <span className="hidden text-[10px] leading-tight text-muted-foreground sm:block">
              a TripAdvisor
              <br />
              company
            </span>
          </Link>

          <NavbarDiscover />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <NavbarCurrency />
          <NavbarCountry />
          <NavbarThemeToggle />   

          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="hidden h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted sm:flex"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <NavbarHelp />

          {session?.user ? (
            <NavbarUserMenu
              name={session.user.name ?? "User"}
              email={session.user.email ?? ""}
              image={session.user?.image ?? undefined}
              role={(session.user as any).role}  // 👈 pass role
            />
          ) : (
            <Link href="/login">
              <Button className="bg-[#00aa6c] font-semibold text-white hover:bg-[#008f5b]">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}