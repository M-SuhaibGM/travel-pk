"use client";

import { HelpCircle, MessageCircle, Mail, Phone, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const helpItems = [
  {
    icon: BookOpen,
    title: "Help Center",
    description: "Browse FAQs and guides",
    href: "/help",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our team 24/7",
    href: "/help/chat",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@travel.com",
    href: "mailto:support@travel.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "+1 (800) 555-0199",
    href: "tel:+18005550199",
  },
];

export function NavbarHelp() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          className="hidden h-10 w-10 rounded-full sm:flex"
        >
          {/* 👇 Bigger icon: h-6 w-6 instead of h-5 w-5 */}
          <HelpCircle className="size-5" strokeWidth={1.8} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">How can we help?</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-3 px-4">
          {helpItems.map(({ icon: Icon, title, description, href }) => (
            <a
              key={title}
              href={href}
              className="flex items-start gap-4 rounded-xl border p-4 transition hover:border-[#00aa6c] hover:bg-muted/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00aa6c]/10">
                <Icon className="h-5 w-5 text-[#00aa6c]" />
              </div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 border-t px-4 pt-6">
          <p className="text-sm text-muted-foreground">
            Still need help? Reach out to us at{" "}
            <a
              href="mailto:support@travel.com"
              className="text-[#00aa6c] underline"
            >
              support@travel.com
            </a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}