"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Files, 
  Settings, 
  PlusCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Documents",
    icon: Files,
    href: "/documents",
    color: "text-violet-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white w-64 border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-primary rounded-lg flex items-center justify-center">
             <Zap className="text-white fill-white" size={20} />
          </div>
          <h1 className="text-xl font-bold">SmartDoc AI</h1>
        </Link>
        
        <div className="space-y-1">
          <Button variant="secondary" className="w-full justify-start mb-6 bg-slate-800 hover:bg-slate-700 border-none text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Upload
          </Button>

          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Recent Chats
          </p>
          <ScrollArea className="h-75 mt-2 px-2">
             {/* This would be mapped from your MySQL DB later */}
             <div className="text-sm text-zinc-500 p-2 italic">No recent documents</div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}