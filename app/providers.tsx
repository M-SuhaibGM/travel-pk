"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import type { CurrencyCode } from "@/lib/currency";

export function Providers({
  children,
  initialCurrency,
}: {
  children: React.ReactNode;
  initialCurrency?: CurrencyCode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <CurrencyProvider initialCurrency={initialCurrency}>
          {children}
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}