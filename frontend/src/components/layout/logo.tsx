import { Link } from "react-router-dom";
import { Menu, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sideBarContext";
const Logo=() =>{
  const { toggleSidebar } = useSidebar();
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Link
        to="/"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
          <Play
            className="ml-0.5 h-5 w-5 fill-current"
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight">
            StreamHub
          </span>

          <span className="text-xs text-muted-foreground">
            Watch • Upload • Share
          </span>
        </div>
      </Link>
    </div>
  );
}

export default Logo;