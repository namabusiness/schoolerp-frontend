import * as React from "react";
import { cn } from "@/lib/utils";

// Marker component (e.g. for attendance indicators, timeline indicators, status dots)
export function Marker({
  status = "neutral",
  className,
}: {
  status?: "active" | "inactive" | "neutral" | "warning";
  className?: string;
}) {
  const statusClasses = {
    active: "bg-black dark:bg-white border-zinc-500",
    inactive: "bg-transparent border-zinc-400 dark:border-zinc-600",
    neutral: "bg-zinc-400 dark:bg-zinc-600 border-zinc-300",
    warning: "bg-zinc-600 dark:bg-zinc-300 border-zinc-800",
  };

  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full border",
        statusClasses[status],
        className
      )}
    />
  );
}

// Message and Bubble components (used for communication, notifications, student counseling chat)
export function Message({
  sender,
  time,
  children,
  isOutgoing = false,
  className,
}: {
  sender?: string;
  time?: string;
  children: React.ReactNode;
  isOutgoing?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col mb-3 max-w-[80%]",
        isOutgoing ? "ml-auto items-end" : "mr-auto items-start",
        className
      )}
    >
      {(sender || time) && (
        <div className="flex items-center gap-2 mb-1 text-[11px] text-zinc-500 dark:text-zinc-400 px-1">
          {sender && <span className="font-semibold">{sender}</span>}
          {time && <span>{time}</span>}
        </div>
      )}
      <div
        className={cn(
          "rounded-xl px-4 py-2 text-sm shadow-sm",
          isOutgoing
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-br-none"
            : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Bubble({
  count,
  className,
}: {
  count: number | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-black text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] dark:bg-white dark:text-black",
        className
      )}
    >
      {count}
    </span>
  );
}

export function MessageScroller({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-y-auto p-4 space-y-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/40 dark:bg-zinc-900/20 max-h-[420px]",
        className
      )}
    >
      {children}
    </div>
  );
}
