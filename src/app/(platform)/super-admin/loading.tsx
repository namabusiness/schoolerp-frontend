import { DashboardSkeleton } from "@/components/ui/page-loader";

export default function SuperAdminLoading() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <DashboardSkeleton />
    </div>
  );
}
