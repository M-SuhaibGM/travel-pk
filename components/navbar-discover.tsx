"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const regions = [
  { label: "Top categories", href: "/tours" },
  { label: "Top Middle East & Africa tours", href: "/tours?region=middle-east-africa" },
  { label: "Top Asia tours", href: "/tours?region=asia" },
  { label: "Top Australia & the Pacific tours", href: "/tours?region=australia-pacific" },
  { label: "Top Caribbean tours", href: "/tours?region=caribbean" },
  { label: "Top Central & South America tours", href: "/tours?region=central-south-america" },
  { label: "Top Europe tours", href: "/tours?region=europe" },
  { label: "Top North America tours", href: "/tours?region=north-america" },
];

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "",
    links: [],
  },
  {
    heading: "",
    links: [
      { label: "Walking Tours in Rome", href: "/tours?q=walking-rome" },
      { label: "Historical Tours in Rome", href: "/tours?q=historical-rome" },
      { label: "Day Trips in London", href: "/tours?q=day-trips-london" },
      { label: "Day Trips in Florence", href: "/tours?q=day-trips-florence" },
    ],
  },
  {
    heading: "",
    links: [
      { label: "Walking Tours in Paris", href: "/tours?q=walking-paris" },
      { label: "Historical Tours in Paris", href: "/tours?q=historical-paris" },
      { label: "Historical Tours in London", href: "/tours?q=historical-london" },
      { label: "Wine Tastings in Florence", href: "/tours?q=wine-florence" },
    ],
  },
  {
    heading: "",
    links: [
      { label: "Cultural Tours in Barcelona", href: "/tours?q=cultural-barcelona" },
      { label: "Walking Tours in Barcelona", href: "/tours?q=walking-barcelona" },
      { label: "Day Trips in Mexico City", href: "/tours?q=day-trips-mexico-city" },
      { label: "Day Trips in Reykjavik", href: "/tours?q=day-trips-reykjavik" },
    ],
  },
];

const tabs = ["Top activities", "Top landmarks", "Explore the world"];

export function NavbarDiscover() {
  const [activeTab, setActiveTab] = useState("Top activities");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hidden h-10 gap-2 rounded-full px-5 text-sm font-medium md:flex"
        >
          Discover
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[min(1100px,95vw)] p-0"
        sideOffset={8}
      >
        <div className="rounded-lg bg-background shadow-lg">
          {/* Tabs */}
          <div className="flex border-b px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 pr-8 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-8 h-0.5 bg-foreground" />
                )}
              </button>
            ))}
          </div>

          {/* 2-column layout: Regions | Link grid */}
          <div className="grid grid-cols-[280px_1fr] gap-0">
            {/* LEFT: Region list */}
            <div className="border-r py-2">
              {regions.map((region, i) => (
                <Link
                  key={region.label}
                  href={region.href}
                  className={`flex items-center justify-between px-6 py-3 text-sm transition hover:bg-muted ${
                    i === 0 ? "bg-muted font-semibold" : ""
                  }`}
                >
                  <span>{region.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* RIGHT: 3-column link grid */}
            <div className="grid grid-cols-3 gap-8 px-8 py-6">
              {columns.slice(1).map((col, i) => (
                <div key={i}>
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block py-2 text-sm text-foreground transition hover:text-[#00aa6c]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}