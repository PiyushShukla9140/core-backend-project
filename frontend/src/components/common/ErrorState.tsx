/*TypeScript Props Interfaces & Component Rules
1. Core Definition
What it is: In TypeScript, defining a Props interface (e.g., interface CommentCardProps { ... }) is a contract that explicitly declares what data types a component must receive from its parent.
Core Philosophy: TypeScript enforces static type safety. Defining props beforehand prevents runtime bugs by ensuring that components receive valid data shapes at compile time before the code ever runs in production.

2. Why Define Props Interfaces First?
Compile-Time Error Prevention (No Runtime Crashes):
Without Types: If a component expects comment.owner.fullName and the parent accidentally passes null or a completely different prop name like user, JavaScript will throw a runtime crash (TypeError: Cannot read properties of undefined).
With Types: TypeScript immediately underlines the code in red inside your IDE (VS Code) before you save or run the app, warning you that the parent component is missing required props. */


import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps{
    message:string;
    onRetry?:()=>void
    //onRetry is optional because not every error screen needs a retry button.

}

const ErrorState = ({
  message,
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed">
      <div className="max-w-md space-y-4 text-center">
        <AlertTriangle className="mx-auto h-14 w-14 text-destructive" />

        <div>
          <h2 className="text-2xl font-semibold">
            Something went wrong
          </h2>

          <p className="mt-2 text-muted-foreground">
            {message}
          </p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;

