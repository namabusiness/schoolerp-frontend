"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SchoolSidebar } from "@/components/school-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("demo_role")) {
        localStorage.setItem("demo_role", "SCHOOL_ADMIN");
      }
      localStorage.setItem("school_id", schoolSlug);
    }
  }, [schoolSlug]);

  return (
    <SidebarProvider>
      <SchoolSidebar variant="inset" schoolSlug={schoolSlug} />
      <SidebarInset className="bg-white">
        <DashboardHeader portalType="school" schoolSlug={schoolSlug} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
