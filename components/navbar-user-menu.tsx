"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  User,
  BookOpen,
  Settings,
  LogOut,
  ShieldCheck,
  Heart,
} from "lucide-react";

type Props = {
  name: string;
  email: string;
  image?: string;
  role?: string;   // 👈 new
};

export function NavbarUserMenu({ name, email, image, role }: Props) {
  const isAdmin = role === "ADMIN";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0"
          aria-label="User menu"
        >
          {image ? (
            <Image
              src={image}
              alt={name ?? "User"}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              style={{ width: 'auto', height: 'auto' }}
              unoptimized
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00aa6c] text-sm font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* User info */}
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00aa6c] text-sm font-semibold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>
              {isAdmin && (
                <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* 👇 Admin section — only for admins */}
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className="flex w-full cursor-pointer items-center gap-2 font-medium"
              >
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Regular user items */}
        <DropdownMenuItem asChild>
          <Link
            href="/account"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <User className="h-4 w-4" />
            My Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/bookings"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            My Bookings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/wishlist"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account/settings"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}