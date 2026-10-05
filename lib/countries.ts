export type CountryCode = "US" | "GB" | "PK" | "AE" | "IN" | "DE" | "FR" | "JP";

export type Country = {
  code: CountryCode;
  label: string;
  /** Default currency for this country */
  currency: string;
};

export const COUNTRIES: Record<CountryCode, Country> = {
  US: { code: "US", label: "United States",       currency: "USD" },
  GB: { code: "GB", label: "United Kingdom",      currency: "GBP" },
  PK: { code: "PK", label: "Pakistan",            currency: "PKR" },
  AE: { code: "AE", label: "United Arab Emirates", currency: "AED" },
  IN: { code: "IN", label: "India",               currency: "USD" },
  DE: { code: "DE", label: "Germany",             currency: "EUR" },
  FR: { code: "FR", label: "France",              currency: "EUR" },
  JP: { code: "JP", label: "Japan",               currency: "JPY" },
};

export const DEFAULT_COUNTRY: CountryCode = "US";