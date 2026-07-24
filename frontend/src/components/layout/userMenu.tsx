import { Link } from "react-router-dom";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const UserMenu = ()=> {
  return (
    <div className="flex items-center gap-3">
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
      >
        <Avatar className="h-9 w-9">
          <AvatarImage
            src=""
            alt="User Avatar"
          />

          <AvatarFallback>
            U
          </AvatarFallback>
        </Avatar>
      </Button>
    </div>
  );
}

export default UserMenu;