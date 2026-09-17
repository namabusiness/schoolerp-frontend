import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton, TableSkeleton } from "@/components/ui/page-loader";

export default function ExaminationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="space-y-1">
          <Skeleton className="h-7 w-52 bg-zinc-200" />
          <Skeleton className="h-4 w-72 bg-zinc-100" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-md bg-zinc-200" />
        </div>
      </div>

      <CardGridSkeleton count={3} />

      <TableSkeleton rows={6} columns={6} />
    </div>
  );
}
