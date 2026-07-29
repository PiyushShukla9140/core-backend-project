import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import UserDropdown from "./userDropDrown";

import { useAppSelector } from "@/store/hooks";

function UserMenu() {

  const currentUser = useAppSelector(
    (state)=>state.auth.user
  )
  const [isOpen, setIsOpen] = useState(false);

  const initials =
  currentUser?.fullName
    ?.trim()
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="relative flex items-center gap-4">
      <Button asChild variant="outline">
        <Link to="/upload">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full p-0"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar className="h-10 w-10">
          

          <AvatarFallback className="bg-red-500 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Button>

      <UserDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export default UserMenu;