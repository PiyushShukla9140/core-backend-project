import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*The cn Utility Function (utils.ts)
1. Core Definition
What it is: The cn (Class Name) utility is a helper function that combines two powerful packages: clsx and tailwind-merge.

Core Philosophy: It is the foundational structural utility used by modern UI component libraries (like Shadcn UI) to handle dynamic, conditional, and overridable Tailwind CSS classes cleanly without breaking the UI layouts.

2. Why this File is Mandatory in Modern Tailwind Production
Solves the Tailwind Class Conflict Problem (tailwind-merge):

Tailwind classes do not native-override each other predictably based on the order you write them in a string. It depends on how they are defined in the underlying CSS stylesheet.

The Issue: If a component has a default class of px-4 (padding horizontal) and you pass a prop with px-6, the browser might still execute px-4 because of CSS specificity order.

The Solution: twMerge intelligently reads the string, recognizes that px-6 is meant to override px-4, and automatically drops the old class, resulting cleanly in just px-6.

Enables Dynamic & Conditional Classes (clsx):

It allows you to toggle utility classes on and off effortlessly based on application state variables (like boolean toggles or loading states).

You can pass objects, arrays, or conditional ternaries directly into it:

JavaScript
// Example usage
cn("bg-blue-500 text-white", isPending && "opacity-50", hasError ? "border-red-500" : "border-gray-200")
Powers Reusable Component Building Blocks:

When constructing generic layout components (like a base Custom Button or Dialog panel), you want a baseline default style while still giving pages the flexibility to inject custom styles from the outside via a standard className prop.

The cn utility aggregates the component's internal styles with external props seamlessly, ensuring the external overrides win without messy string concatenations.

3. Deep Architectural Breakdown of Line 5
TypeScript
return twMerge(clsx(inputs));
inputs (Rest Parameter): The ...inputs syntax gathers any number of arguments (strings, arrays, objects, conditionals) into a single array structure.

clsx(inputs): First, clsx processes this array. It evaluates all conditionals, strips out falsy values (false, null, undefined), and outputs one clean, unified string of active CSS classes.

twMerge(...): Finally, twMerge takes that clean string, checks it for conflicting Tailwind constraints (like overlapping margins, paddings, or colors), resolves the overrides so the last utility declared wins, and spits out the definitive production-safe class list. */