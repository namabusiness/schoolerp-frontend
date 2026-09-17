import * as React from "react";
import { cn } from "@/lib/utils";

// Questionnaire component (for student admission interviews, staff appraisals, exam surveys)
export interface QuestionnaireItem {
  id: string;
  question: string;
  options: string[];
}

export function Questionnaire({
  items,
  values,
  onChange,
  className,
}: {
  items: QuestionnaireItem[];
  values: Record<string, string>;
  onChange: (id: string, option: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
        >
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            {idx + 1}. {item.question}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.options.map((opt) => {
              const isSelected = values[item.id] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(item.id, opt)}
                  className={cn(
                    "flex items-center justify-start px-3 py-2 text-xs rounded-md border text-left transition-all",
                    isSelected
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-medium"
                      : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                  )}
                >
                  <span className="truncate">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Direction component (RTL/LTR indicator or direction wrapper)
export function Direction({
  dir = "ltr",
  children,
  className,
}: {
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div dir={dir} className={cn("w-full", className)}>
      {children}
    </div>
  );
}

// Typography components
export function Typography({
  variant = "p",
  children,
  className,
}: {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted";
  children: React.ReactNode;
  className?: string;
}) {
  switch (variant) {
    case "h1":
      return (
        <h1 className={cn("scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl text-zinc-900 dark:text-zinc-50", className)}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={cn("scroll-m-20 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50", className)}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={cn("scroll-m-20 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50", className)}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={cn("scroll-m-20 text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-50", className)}>
          {children}
        </h4>
      );
    case "lead":
      return (
        <p className={cn("text-lg text-zinc-600 dark:text-zinc-300 font-normal", className)}>
          {children}
        </p>
      );
    case "muted":
      return (
        <p className={cn("text-xs text-zinc-500 dark:text-zinc-400", className)}>
          {children}
        </p>
      );
    default:
      return (
        <p className={cn("leading-7 text-zinc-700 dark:text-zinc-300", className)}>
          {children}
        </p>
      );
  }
}
