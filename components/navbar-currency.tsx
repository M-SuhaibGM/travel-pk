"use client";

import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const currencies = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "PKR", symbol: "₨", label: "Pakistani Rupee" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
];

export function NavbarCurrency() {
  const [selected, setSelected] = useState("USD");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden h-9 gap-1 px-2 text-sm font-medium sm:flex"
        >
          {selected}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setSelected(c.code)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span>
              <span className="font-medium">{c.code}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {c.label}
              </span>
            </span>
            {selected === c.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}