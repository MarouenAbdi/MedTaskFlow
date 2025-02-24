import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New Appointment",
    description: "Dr. Smith has a new appointment at 2:00 PM",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Medical Record Updated",
    description: "Patient John Doe's medical record has been updated",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 3,
    title: "Payment Received",
    description: "Payment of $150 received from Sarah Johnson",
    time: "30 minutes ago",
    read: false,
  },
];

export function NotificationsMenu() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t('nav.notifications')}</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="group relative flex flex-col items-start gap-1 p-4 focus:bg-accent"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  {notification.title}
                  {!notification.read && (
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
                {!notification.read && (
                  <button
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    <span className="inline-block h-2 w-2 rounded-full border-2 border-muted-foreground hover:bg-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{notification.description}</div>
              <div className="text-xs text-muted-foreground">{notification.time}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}