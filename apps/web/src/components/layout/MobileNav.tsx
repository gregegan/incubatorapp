"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/components/sheet";
import { Button } from "@/ui/components/button";
import { ScrollArea } from "@/ui/components/scroll-area";
import {
  Menu,
  Trophy,
  TrendingUp,
  History,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api";

export function MobileNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <ScrollArea className="h-full py-6">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/dashboard")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Account</h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10"
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
