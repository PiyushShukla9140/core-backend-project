import { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    History,
    ListVideo,
    LogOut,
    Settings,
    Upload,
    User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/seperator";

import { logout } from "@/features/auth/authSlice";
import type { RootState } from "@/store/store";

interface UserDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavigationItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
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

function UserDropdown({
    isOpen,
    onClose,
}: UserDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                onClose();
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        dispatch(logout());

        onClose();

        navigate("/login", {
            replace: true,
        });
    };
    console.log("Dropdown User:", user);

    return (
        <div
            ref={dropdownRef}
            className={`absolute right-0 top-14 z-50 w-72 origin-top-right rounded-xl border bg-background shadow-xl transition-all duration-200 ease-out ${
                isOpen
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
            }`}
        >
            <div className="flex items-center gap-3 p-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage
                        src={user?.avatar}
                        alt={user?.fullName}
                    />

                    <AvatarFallback className="bg-red-500 font-semibold text-white">
                        {user?.fullName
                            ?.split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col overflow-hidden">
                    <span className="truncate font-medium">
                        {user?.fullName}
                    </span>

                    <span className="truncate text-sm text-muted-foreground">
                        @{user?.username}
                    </span>

                    <Link
                        to={`/channel/${user?.username}`}
                        onClick={onClose}
                        className="mt-1 text-sm font-medium text-blue-500 hover:underline"
                    >
                        View your channel
                    </Link>
                </div>
            </div>

            <Separator />

            <div className="py-2">
              <NavLink
                  to={`/channel/${user?.username}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                      `mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                          isActive
                              ? "bg-muted font-medium"
                              : "hover:bg-muted"
                      }`
                  }
              >
                  <User className="h-5 w-5" />
                  <span>Your Channel</span>
              </NavLink>
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

            <div className="py-2">
                <button
                    onClick={() => {
                        console.log("Settings");
                        onClose();
                    }}
                    className="mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                    <Settings className="h-5 w-5" />

                    <span>Settings</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-left text-red-500 transition-colors hover:bg-muted"
                >
                    <LogOut className="h-5 w-5" />

                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default UserDropdown;