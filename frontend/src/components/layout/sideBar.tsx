import {
  House,
  User,
  Upload,
  History,
  ListVideo,
  ThumbsUp,
  Settings,
} from "lucide-react";

import SidebarItem from "./sideBarItems";
import { useSidebar } from "@/contexts/sideBarContext";

const primaryItems = [
  {
    to: "/",
    icon: House,
    label: "Home",
  },
  {
    to: "/channel",
    icon: User,
    label: "Your Channel",
  },
  {
    to: "/upload",
    icon: Upload,
    label: "Upload",
  },
  {
    to: "/history",
    icon: History,
    label: "History",
  },
  {
    to: "/playlists",
    icon: ListVideo,
    label: "Playlists",
  },
];

const secondaryItems = [
  {
    to: "/liked",
    icon: ThumbsUp,
    label: "Liked Videos",
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <nav className="flex h-full flex-col p-4">
        <div className="space-y-2">
          {primaryItems.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
            />
          ))}
        </div>

        <hr className="my-4" />

        <div className="space-y-2">
          {secondaryItems.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;