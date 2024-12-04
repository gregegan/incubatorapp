"use client";
import { Button } from "@/ui/components/button";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { MobileNav } from "./MobileNav";
import { ProfileDropdown } from "../profile/ProfileDropdown";
import { User } from "@/types/users";
import Link from "next/link";

export function HeaderContent({ user }: { user: User }) {
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <nav className="flex h-16 w-full items-center justify-between px-6">
        <div className="flex items-center gap-8">
          {isAuthenticated && <MobileNav className="md:hidden" />}

          <Link href="/" className="flex items-center">IncubatorApp</Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="h-16 px-4 text-[15px] font-medium text-gray-600 rounded-none border-b-2 border-transparent"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <NotificationsDropdown />
              <div className="h-4 w-px bg-gray-200" />
              <ProfileDropdown isAdmin={user.isAdmin} />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="h-16 px-4 text-[15px] font-medium text-gray-600"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="h-10 px-6 text-[15px] font-medium bg-orange-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
