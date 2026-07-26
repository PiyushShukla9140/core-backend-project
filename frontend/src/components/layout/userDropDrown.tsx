import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  History,
  ListVideo,
  LogOut,
  Settings,
  Upload,
  User,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/seperator";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface ActionItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Your Channel",
    href: "/channel",
    icon: User,
  },
  {
    label: "Upload Video",
    href: "/upload",
    icon: Upload,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Playlists",
    href: "/playlists",
    icon: ListVideo,
  },
];

const actionItems: ActionItem[] = [
  {
    label: "Settings",
    icon: Settings,
    onClick: () => {
      console.log("Settings Clicked");
    },
  },
  {
    label: "Logout",
    icon: LogOut,
    onClick: () => {
      console.log("Logout Clicked");
    },
    className: "text-red-500",
  },
];

function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-14 z-50 w-72 origin-top-right rounded-xl border bg-background shadow-xl transition-all duration-200 ease-out ${
        isOpen
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" />
          <AvatarFallback className="bg-red-500 text-white font-semibold">
            PS
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col overflow-hidden">
          <span className="truncate font-medium">
            Piyush Shukla
          </span>

          <span className="truncate text-sm text-muted-foreground">
            piyush@example.com
          </span>

          <Link
            to="/channel"
            onClick={onClose}
            className="mt-1 text-sm font-medium text-blue-500 hover:underline"
          >
            View your channel
          </Link>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-muted font-medium"
                    : "hover:bg-muted"
                }`
              }
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <Separator />

      {/* Actions */}
      <div className="py-2">
        {actionItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted ${item.className ?? ""}`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default UserDropdown;