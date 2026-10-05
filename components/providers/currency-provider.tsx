"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  formatPrice,
  type CurrencyCode,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (amountUsd: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const COOKIE_NAME = "preferred_currency";
const STORAGE_KEY = "travel:currency";

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency?: CurrencyCode;
  children: ReactNode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(
    initialCurrency ?? DEFAULT_CURRENCY
  );

  // Load from localStorage on mount (client-side override)
  useEffect(() => {
    const stored =
      (localStorage.getItem(STORAGE_KEY) as CurrencyCode | null) ??
      initialCurrency;

    if (stored && stored in CURRENCIES) {
      setCurrencyState(stored);
    }
  }, [initialCurrency]);

  function setCurrency(next: CurrencyCode) {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);

    // Also persist as cookie so server components can read it
    document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax`;
  }

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    format: (amountUsd: number) => formatPrice(amountUsd, currency),
    symbol: CURRENCIES[currency].symbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside <CurrencyProvider>");
  }
  return ctx;
}