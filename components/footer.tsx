import Link from "next/link";
import { Compass, Mail, MapPin, Phone } from "lucide-react";
import { siFacebook, siInstagram, siX, siYoutube } from "simple-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ==========================================
// SIMPLE ICON HELPER
// ==========================================
function SimpleIcon({
  icon,
  className,
}: {
  icon: { path: string; title: string };
  className?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}

// ==========================================
// LINK DATA
// ==========================================
const links = {
  Company: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Explore: [
    { label: "All tours", href: "/tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "Deals & offers", href: "/deals" },
    { label: "Gift cards", href: "/gift-cards" },
    { label: "Travel guides", href: "/guides" },
  ],
  Support: [
    { label: "Help center", href: "/help" },
    { label: "Contact support", href: "/contact" },
    { label: "Cancellation policy", href: "/cancellation" },
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" },
  ],
  Partners: [
    { label: "Become a supplier", href: "/partners/suppliers" },
    { label: "Affiliate program", href: "/partners/affiliates" },
    { label: "Advertise with us", href: "/partners/ads" },
    { label: "API for developers", href: "/partners/api" },
    { label: "Press kit", href: "/partners/press-kit" },
  ],
};

const socials = [
  { Icon: siFacebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: siInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: siX, href: "https://x.com", label: "X (Twitter)" },
  { Icon: siYoutube, href: "https://youtube.com", label: "YouTube" },
];

// ==========================================
// FOOTER
// ==========================================
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      {/* ============ MAIN ============ */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* ---------- BRAND COLUMN (spans 2) ---------- */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <Compass className="h-6 w-6 text-[#00aa6c]" />
              <span>Travel</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Handpicked tours and unforgettable experiences across the globe.
            </p>

            {/* Contact info */}
            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <a
                href="mailto:support@travel.com"
                className="flex items-center gap-2 transition hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" />
                support@travel.com
              </a>
              <a
                href="tel:+18005550199"
                className="flex items-center gap-2 transition hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +1 (800) 555-0199
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  123 Travel Lane
                  <br />
                  San Francisco, CA 94103
                </span>
              </p>
            </div>

            {/* Socials */}
            <div className="mt-5 flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:border-[#00aa6c] hover:bg-[#00aa6c] hover:text-white"
                >
                  <SimpleIcon icon={Icon} className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* ---------- LINK COLUMNS ---------- */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition hover:text-[#00aa6c]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ============ NEWSLETTER ============ */}
        <div className="mt-12 flex flex-col gap-4 rounded-2xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="font-semibold">Get travel deals in your inbox</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Subscribe for exclusive offers and handpicked experiences.
            </p>
          </div>

          <form
            action="/api/newsletter/subscribe"
            method="POST"
            className="flex w-full max-w-md gap-2"
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="h-10"
            />
            <Button
              type="submit"
              className="h-10 shrink-0 bg-[#00aa6c] text-white hover:bg-[#008f5b]"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>
            © {currentYear} Travel. All rights reserved. Made with{" "}
            <span className="text-[#00aa6c]">♥</span> for explorers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookies" className="transition hover:text-foreground">
              Cookies
            </Link>
            <Link
              href="/accessibility"
              className="transition hover:text-foreground"
            >
              Accessibility
            </Link>
          </div>

          {/* Currency + language quick display */}
          <div className="flex items-center gap-3">
            <span>USD $</span>
            <span className="text-muted-foreground/50">|</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}