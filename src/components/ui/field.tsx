import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
}

export function Field({
  label,
  description,
  error,
  children,
  className,
  ...props
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </label>
      )}
      {children}
      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {error && (
        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 underline decoration-zinc-500">
          {error}
        </p>
      )}
    </div>
  );
}

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Item({
  title,
  subtitle,
  value,
  icon,
  className,
  ...props
}: ItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-zinc-600 dark:text-zinc-400">{icon}</div>}
        <div>
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</div>
          {subtitle && <div className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</div>}
        </div>
      </div>
      {value && <div className="text-sm font-mono text-zinc-700 dark:text-zinc-300">{value}</div>}
    </div>
  );
}
