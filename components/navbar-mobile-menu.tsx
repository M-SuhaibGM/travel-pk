"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Compass, Heart, Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/providers/currency-provider";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { COUNTRIES } from "@/lib/countries";
import { regions } from "./navbar-discover";
import { helpItems } from "./navbar-help";
import { FLAGS, useCountry } from "./navbar-country";
import { cn } from "@/lib/utils";

/**
 * Hamburger menu shown below the `md` breakpoint. It holds everything the
 * desktop navbar hides on small screens (Discover, wishlist, currency,
 * country and help).
 */
export function NavbarMobileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { country, selectCountry } = useCountry();

  function selectCurrency(code: CurrencyCode) {
    setCurrency(code);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="h-10 w-10 rounded-full md:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[85vw] gap-0 overflow-y-auto p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Compass className="h-5 w-5 text-[#00aa6c]" />
            Menu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation, currency, country and help
          </SheetDescription>
        </SheetHeader>

        {/* Browse */}
        <nav className="border-b py-2" aria-label="Browse">
          <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Discover
          </p>
          {regions.map((r) => (
            <SheetClose asChild key={r.label}>
              <Link
                href={r.href}
                className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-muted"
              >
                <span>{r.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href="/destinations"
              className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-muted"
            >
              <span>All destinations</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/account/wishlist"
              className="flex items-center gap-2 px-4 py-3 text-sm transition hover:bg-muted"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
          </SheetClose>
        </nav>

        {/* Currency */}
        <section className="border-b p-4">
          <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Currency
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(CURRENCIES).map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCurrency(c.code)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition",
                  currency === c.code
                    ? "border-[#00aa6c] bg-[#00aa6c]/10 font-semibold"
                    : "hover:bg-muted"
                )}
              >
                {c.code}
                {currency === c.code && <Check className="h-4 w-4 text-[#00aa6c]" />}
              </button>
            ))}
          </div>
        </section>

        {/* Country */}
        <section className="border-b p-4">
          <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Country
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(COUNTRIES).map((c) => {
              const Flag = FLAGS[c.code];
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCountry(c.code)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition",
                    country === c.code
                      ? "border-[#00aa6c] bg-[#00aa6c]/10 font-semibold"
                      : "hover:bg-muted"
                  )}
                >
                  <Flag className="h-3.5 w-5 shrink-0 rounded-sm" />
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Help */}
        <section className="p-4">
          <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Help
          </p>
          <div className="flex flex-col gap-2">
            {helpItems.map(({ icon: Icon, title, description, href }) => (
              <a
                key={title}
                href={href}
                className="flex items-center gap-3 rounded-xl border p-3 transition hover:border-[#00aa6c] hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00aa6c]/10">
                  <Icon className="h-4 w-4 text-[#00aa6c]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
