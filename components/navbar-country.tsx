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
import { COUNTRIES, type CountryCode } from "@/lib/countries";
import { CURRENCIES, type CurrencyCode as CC } from "@/lib/currency";
import { US, GB, PK, AE, IN, DE, FR, JP } from "country-flag-icons/react/3x2";
import { useEffect, useState } from "react";

const FLAGS: Record<CountryCode, any> = { US, GB, PK, AE, IN, DE, FR, JP };
const COOKIE = "preferred_country";

export function NavbarCountry() {
  const { setCurrency } = useCurrency();
  const [country, setCountry] = useState<CountryCode>("US");

  useEffect(() => {
    const saved =
      (document.cookie
        .split("; ")
        .find((r) => r.startsWith(`${COOKIE}=`))
        ?.split("=")[1] as CountryCode) ?? "US";
    setCountry(saved);
  }, []);

  function handleSelect(code: CountryCode) {
    setCountry(code);
    document.cookie = `${COOKIE}=${code}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax`;

    // Auto-switch currency to match the country
    const nextCurrency = COUNTRIES[code].currency as CC;
    if (nextCurrency in CURRENCIES) {
      setCurrency(nextCurrency);
    }
  }

  const CurrentFlag = FLAGS[country];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden h-9 gap-2 px-2 sm:flex">
          <CurrentFlag className="h-5 w-7 rounded-sm shadow-sm" />
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {Object.values(COUNTRIES).map((c) => {
          const Flag = FLAGS[c.code];
          return (
            <DropdownMenuItem
              key={c.code}
              onClick={() => handleSelect(c.code)}
              className="flex cursor-pointer items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Flag className="h-3.5 w-5 rounded-sm" />
                <span className="text-sm">{c.label}</span>
              </span>
              {country === c.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}