import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { useSidebar } from "@/contexts/sideBarContext";

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const SidebarItem = ({
  to,
  icon: Icon,
  label,
}: SidebarItemProps) => {
    const { isOpen } = useSidebar();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-muted text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`
      }
    >
      <Icon className="h-[22px] w-[22px] shrink-0" />

    <span
        className={`transition-all duration-200 whitespace-nowrap ${
             isOpen
                ? "max-w-[150px] opacity-100 ml-0"
                : "max-w-0 opacity-0"
        }`}
        >
        {label}
    </span>
    </NavLink>
  );
}

export default SidebarItem;