import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Empty({
  icon = <Inbox className="h-10 w-10 text-zinc-400 stroke-1" />,
  title = "No data available",
  description = "There are no records found matching this view.",
  action,
  className,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20",
        className
      )}
      {...props}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mb-4">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
