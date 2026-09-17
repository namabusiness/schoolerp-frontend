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
