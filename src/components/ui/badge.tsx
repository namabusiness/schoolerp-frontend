import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border border-zinc-300 bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200",
        secondary:
          "border border-zinc-200 bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
        destructive:
          "border-zinc-400 bg-zinc-300 text-zinc-900",
        outline: "border-zinc-300 text-zinc-800 bg-white",
        subtle: "border-zinc-200 bg-zinc-50 text-zinc-700",
        contrast: "border-zinc-800 bg-zinc-800 text-white font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
