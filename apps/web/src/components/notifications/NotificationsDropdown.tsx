"use client";
import { Bell } from "lucide-react";
import { Button } from "@/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui/components/dropdown-menu";
import { format } from "date-fns";
import { fetchUnreadNotifications, markAllNotificationsRead } from "@/lib/api";
import { Skeleton } from "@/ui/components/skeleton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Notification } from "@/types/notifications";

export function NotificationsDropdown() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUnreadNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative h-16 w-16">
        <Bell className="h-5 w-5 text-gray-600" />
        <Skeleton className="absolute -top-1 -right-1 h-4 w-4 rounded-full" />
      </Button>
    );
  }

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-16 w-16">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 h-4 w-4 rounded-full bg-orange-600 text-[10px] font-medium flex items-center justify-center text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold">Notifications</h3>
          <div className="space-y-2">
            {notifications?.slice(0, 3).map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-3 ${
                  !notification.read ? "bg-orange-500/5" : "bg-background"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(notification.createdAt), "h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full text-orange-600 hover:text-orange-700"
            onClick={markAllNotificationsRead}
          >
            Mark all as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
