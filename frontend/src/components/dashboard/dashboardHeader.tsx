import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    // this flex col is for responsive layour
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      {/* Left Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Creator Dashboard
        </h1>

        <p className="text-muted-foreground">
          Manage your uploaded videos and monitor your channel performance.
        </p>
      </div>

      {/* Right Section */}
      <Button
        onClick={() => navigate("/upload")}
        size="lg"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Video
      </Button>
    </div>
  );
};

export default DashboardHeader;