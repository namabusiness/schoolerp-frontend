import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Student360Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Student Header Skeleton */}
      <Card className="border-zinc-200 bg-white p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full bg-zinc-200" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48 bg-zinc-200" />
                <Skeleton className="h-5 w-16 rounded-full bg-zinc-100" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-4 w-28 bg-zinc-100" />
                <Skeleton className="h-4 w-24 bg-zinc-100" />
                <Skeleton className="h-4 w-32 bg-zinc-100" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-md bg-zinc-200" />
            <Skeleton className="h-9 w-32 rounded-md bg-zinc-200" />
          </div>
        </div>
      </Card>

      {/* 360 KPI Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-zinc-200 bg-white p-4 space-y-2">
            <Skeleton className="h-3 w-20 bg-zinc-100" />
            <Skeleton className="h-6 w-16 bg-zinc-200" />
          </Card>
        ))}
      </div>

      {/* Tabs & Content Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-zinc-200 pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md bg-zinc-100" />
          ))}
        </div>
        <Card className="border-zinc-200 bg-white p-6 space-y-4">
          <Skeleton className="h-6 w-48 bg-zinc-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-zinc-50 rounded" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
