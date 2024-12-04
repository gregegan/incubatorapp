"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col border-r border-border/40">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              {!isCollapsed && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
                  Admin Dashboard
                </h1>
              )}
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500" />
                ) : (
                  <ChevronLeft className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-orange-500" />
                )}
                {!isCollapsed && "Collapse Menu"}
              </button>

              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-orange-500/10 text-orange-500"
                        : "text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        !isCollapsed && "mr-3",
                        isActive
                          ? "text-orange-500"
                          : "text-muted-foreground group-hover:text-orange-500",
                      )}
                    />
                    {!isCollapsed && item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
