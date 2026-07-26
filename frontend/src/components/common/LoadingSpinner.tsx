import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner = ({
  text = "Loading...",
  className,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-4",
        className
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />

      <p className="text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;