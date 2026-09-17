"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  Shield,
  CreditCard,
  LifeBuoy,
  FileText,
  BarChart3,
  LayoutDashboard,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { Badge } from "@/components/ui/badge";

const SUPER_ADMIN_NAV = [
  { title: "Platform Overview", url: "/super-admin", icon: LayoutDashboard },
  { title: "Schools & Tenants", url: "/super-admin/schools", icon: Building2 },
  { title: "School Administrators", url: "/super-admin/administrators", icon: Users },
  { title: "Roles & Permissions", url: "/super-admin/roles", icon: Shield },
  { title: "Subscriptions & Plans", url: "/super-admin/subscriptions", icon: CreditCard },
  { title: "Support Access", url: "/super-admin/support-access", icon: LifeBuoy },
  { title: "Platform Audit Logs", url: "/super-admin/audit-logs", icon: FileText },
  { title: "Platform Reports", url: "/super-admin/reports", icon: BarChart3 },
];

export function SuperAdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const user = {
    name: "Platform Master",
    email: "admin@schoolerp.io",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-zinc-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-zinc-100">
              <Link href="/super-admin">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-xs">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-zinc-950">SUPER ADMIN</span>
                  <span className="truncate text-[10px] text-zinc-500 font-mono">Platform Control</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
            Platform Master Flows
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SUPER_ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-zinc-100 font-semibold text-zinc-950 border border-zinc-300 shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                      }
                    >
                      <Link href={item.url}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
            Campus Quick Switch
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Enter Greenwood High">
                  <Link href="/greenwood-high/dashboard" className="text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100">
                    <Building2 className="size-4" />
                    <span>Greenwood High</span>
                    <ExternalLink className="ml-auto size-3 text-zinc-400" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200 p-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] text-zinc-500 font-mono">
          <span>ROOT NODE</span>
          <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-zinc-200 text-zinc-800">
            ACTIVE
          </Badge>
        </div>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
