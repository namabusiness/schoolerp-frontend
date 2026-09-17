"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/super-admin-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SuperAdminSidebar variant="inset" />
      <SidebarInset className="bg-white">
        <DashboardHeader portalType="super-admin" />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
