import { PageLoader } from "@/components/ui/page-loader";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <PageLoader
        message="Loading School ERP"
        subtext="Initializing multi-tenant workspace..."
      />
    </div>
  );
}
