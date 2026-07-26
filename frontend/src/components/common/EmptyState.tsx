import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState = ({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
      <div className="mb-6 rounded-full bg-muted p-5">
        {icon ?? (
          <Inbox className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

/*Developer Study Notes: React.ReactNode in TypeScript
1. Core Definition
What it is: React.ReactNode is a built-in TypeScript type provided by the @types/react package.

Core Philosophy: It is the broadest and most permissive type in React. It represents anything that React can render inside a component's JSX layout.

2. What Does React.ReactNode Include?
React.ReactNode is a union type that covers all possible renderable entities:

JSX Elements / React Elements: <button>Click me</button>, <AvatarImage/>

Primitive Values: Strings ("Hello World"), Numbers (42)

Arrays & Fragments: [<li key="1">A</li>, <li key="2">B</li>], <>...</>

Falsy Values (Render nothing): null, undefined, boolean (true / false)

React Portals */