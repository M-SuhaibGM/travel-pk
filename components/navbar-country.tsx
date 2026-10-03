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
import { US, GB, PK, AE, IN, DE, FR, JP } from "country-flag-icons/react/3x2";

const countries = [
  { code: "US", Flag: US, label: "United States" },
  { code: "GB", Flag: GB, label: "United Kingdom" },
  { code: "PK", Flag: PK, label: "Pakistan" },
  { code: "AE", Flag: AE, label: "United Arab Emirates" },
  { code: "IN", Flag: IN, label: "India" },
  { code: "DE", Flag: DE, label: "Germany" },
  { code: "FR", Flag: FR, label: "France" },
  { code: "JP", Flag: JP, label: "Japan" },
];

export function NavbarCountry() {
  const [selected, setSelected] = useState("US");
  const current = countries.find((c) => c.code === selected)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden h-9 gap-1.5 px-2 sm:flex"
        >
          {/* Bigger flag, no code */}
          <current.Flag
            className="h-7 w-9  shadow-sm"
            title={current.label}
          />
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {countries.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setSelected(c.code)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <c.Flag className="h-6 w-7 " title={c.label} />
              <span className="text-sm">{c.label}</span>
            </span>
            {selected === c.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}