"use client";

import * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  subtext?: string;
  className?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message = "Loading...",
  subtext = "Fetching system records",
  className,
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4",
        fullScreen ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 min-h-screen" : "min-h-[400px] w-full",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
        <div className="absolute h-7 w-7 rounded-full bg-zinc-100 border border-zinc-300" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-900 tracking-tight">{message}</p>
        {subtext && <p className="text-xs text-zinc-500 font-mono">{subtext}</p>}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-zinc-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <Skeleton className="h-4 w-24 bg-zinc-100" />
            <Skeleton className="h-4 w-4 rounded-full bg-zinc-200" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-7 w-20 bg-zinc-200" />
            <Skeleton className="h-3 w-32 bg-zinc-100" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
      <div className="border-b border-zinc-200 bg-zinc-50 p-3 flex items-center justify-between">
        <Skeleton className="h-5 w-36 bg-zinc-200" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 bg-zinc-200 rounded-md" />
          <Skeleton className="h-8 w-8 bg-zinc-200 rounded-md" />
        </div>
      </div>
      <div className="divide-y divide-zinc-200">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-3.5 flex items-center justify-between gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                className={cn(
                  "h-4 bg-zinc-100",
                  c === 0 ? "w-1/4" : c === columns - 1 ? "w-16" : "w-1/6"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="space-y-1">
          <Skeleton className="h-7 w-48 bg-zinc-200" />
          <Skeleton className="h-4 w-64 bg-zinc-100" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-md bg-zinc-200" />
          <Skeleton className="h-9 w-32 rounded-md bg-zinc-200" />
        </div>
      </div>

      <CardGridSkeleton count={4} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-zinc-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40 bg-zinc-200" />
            <Skeleton className="h-4 w-24 bg-zinc-100" />
          </div>
          <Skeleton className="h-64 w-full bg-zinc-100 rounded-md" />
        </Card>
        <Card className="border-zinc-200 bg-white p-6 space-y-4">
          <Skeleton className="h-5 w-32 bg-zinc-200" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 bg-zinc-100" />
                <Skeleton className="h-4 w-12 bg-zinc-200" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <TableSkeleton rows={5} columns={5} />
    </div>
  );
}
