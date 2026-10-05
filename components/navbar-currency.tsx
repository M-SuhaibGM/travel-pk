"use client";

import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/providers/currency-provider";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useRouter } from "next/navigation";

export function NavbarCurrency() {
  const { currency, setCurrency } = useCurrency();
  const router = useRouter();

  function handleSelect(code: CurrencyCode) {
    setCurrency(code);
    // Refresh server components so prices update everywhere
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden h-9 gap-1 px-2 text-sm font-medium sm:flex"
        >
          {currency}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {Object.values(CURRENCIES).map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => handleSelect(c.code)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span>
              <span className="font-medium">{c.code}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {c.label}
              </span>
            </span>
            {currency === c.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}