import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-zinc-200 text-zinc-900 border border-zinc-300 shadow-sm hover:bg-zinc-300 active:bg-zinc-400 font-medium",
        destructive: "bg-zinc-300 text-zinc-950 hover:bg-zinc-400 border border-zinc-400 font-medium",
        outline: "border border-zinc-300 bg-white text-zinc-800 shadow-sm hover:bg-zinc-100 hover:text-black font-medium",
        secondary: "bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-sm hover:bg-zinc-200 font-medium",
        ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-black font-medium",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        contrast: "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-900 font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
