export type CurrencyCode = "USD" | "EUR" | "GBP" | "PKR" | "AED" | "JPY";

export type Currency = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Approximate rate from USD. Update periodically or fetch live. */
  rate: number;
};

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: "USD", symbol: "$",  label: "US Dollar",         rate: 1 },
  EUR: { code: "EUR", symbol: "€",  label: "Euro",              rate: 0.92 },
  GBP: { code: "GBP", symbol: "£",  label: "British Pound",     rate: 0.79 },
  PKR: { code: "PKR", symbol: "₨",  label: "Pakistani Rupee",   rate: 278.5 },
  AED: { code: "AED", symbol: "د.إ", label: "UAE Dirham",       rate: 3.67 },
  JPY: { code: "JPY", symbol: "¥",  label: "Japanese Yen",      rate: 149.8 },
};

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/** Format a price from USD to the target currency. */
export function formatPrice(
  amountUsd: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): string {
  const c = CURRENCIES[currency];
  const converted = amountUsd * c.rate;

  // Yen and Rupee don't use decimals
  const decimals = currency === "JPY" || currency === "PKR" ? 0 : 0;

  return `${c.symbol}${converted.toFixed(decimals)}`;
}