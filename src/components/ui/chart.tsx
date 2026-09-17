"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Monochrome color tokens for analytics
export const MONO_CHART_COLORS = [
  "#171717", // near black
  "#525252", // dark grey
  "#737373", // neutral grey
  "#a3a3a3", // medium grey
  "#d4d4d4", // light grey
  "#000000", // black
];

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function ChartContainer({
  title,
  description,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h4>}
          {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
