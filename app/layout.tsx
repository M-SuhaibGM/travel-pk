import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Providers } from "./providers";
import { cookies } from "next/headers";
// import { Providers } from "./providers";
import { DEFAULT_CURRENCY, type CurrencyCode } from "@/lib/currency";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Travel — Discover your next adventure",
  description:
    "Handpicked tours, trusted guides, and unforgettable memories — booked in minutes.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get("preferred_currency")?.value;
  const initialCurrency = (currencyCookie as CurrencyCode) ?? DEFAULT_CURRENCY;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers initialCurrency={initialCurrency} >
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}


