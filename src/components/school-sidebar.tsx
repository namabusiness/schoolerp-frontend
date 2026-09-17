"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  BookOpen,
  FileCheck2,
  Receipt,
  Bus,
  Library,
  Megaphone,
  Briefcase,
  Boxes,
  Calendar,
  HeartPulse,
  Award,
  ArrowRightLeft,
  Settings,
  ShieldCheck,
  ArrowLeft,
  ShieldAlert,
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

interface SchoolSidebarProps extends React.ComponentProps<typeof Sidebar> {
  schoolSlug: string;
}

export function SchoolSidebar({ schoolSlug, ...props }: SchoolSidebarProps) {
  const pathname = usePathname();
  const basePath = `/${schoolSlug}`;

  const [supportActive, setSupportActive] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportActive(localStorage.getItem("support_session_active") === "true");
    }
  }, []);

  const ACADEMIC_MODULES = [
    { title: "Campus Overview", url: `${basePath}/dashboard`, icon: LayoutDashboard },
    { title: "Academic Setup", url: `${basePath}/academics`, icon: BookOpen },
    { title: "Admissions Pipeline", url: `${basePath}/admissions`, icon: GraduationCap },
    { title: "Students (360 Hub)", url: `${basePath}/students`, icon: Users },
    { title: "Daily Operations", url: `${basePath}/daily-ops`, icon: CalendarCheck },
    { title: "Attendance Engine", url: `${basePath}/attendance`, icon: FileCheck2 },
    { title: "Homework & Learning", url: `${basePath}/homework`, icon: BookOpen },
    { title: "Examinations & Marks", url: `${basePath}/examinations`, icon: Award },
  ];

  const OPS_MODULES = [
    { title: "Fees & Invoicing", url: `${basePath}/fees`, icon: Receipt },
    { title: "Transport & Fleet", url: `${basePath}/transport`, icon: Bus },
    { title: "Library Circulation", url: `${basePath}/library`, icon: Library },
    { title: "Communication Notices", url: `${basePath}/communication`, icon: Megaphone },
    { title: "Staff & HR Payroll", url: `${basePath}/hr`, icon: Briefcase },
    { title: "Inventory & Assets", url: `${basePath}/inventory`, icon: Boxes },
  ];

  const CAMPUS_MODULES = [
    { title: "Events & Calendar", url: `${basePath}/events`, icon: Calendar },
    { title: "Infirmary & Health", url: `${basePath}/health`, icon: HeartPulse },
    { title: "Certificates & TC", url: `${basePath}/certificates`, icon: Award },
    { title: "Promotion & Rollover", url: `${basePath}/promotion`, icon: ArrowRightLeft },
    { title: "School Settings", url: `${basePath}/settings`, icon: Settings },
  ];

  const user = {
    name: "Dr. Eleanor Vance",
    email: "principal@greenwood.edu",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-zinc-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-zinc-100">
              <Link href={`${basePath}/dashboard`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-xs uppercase">
                  {schoolSlug.substring(0, 2)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-zinc-950 capitalize">
                    {schoolSlug.replace("-", " ")}
                  </span>
                  <span className="truncate text-[10px] text-zinc-500 font-mono">
                    2026-2027 • Term 1
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {supportActive && (
          <div className="px-2 py-1.5 rounded-md bg-zinc-100 border border-zinc-300 flex items-center gap-2 text-[11px] text-zinc-900">
            <ShieldAlert className="size-3.5 text-zinc-950 shrink-0 animate-pulse" />
            <span className="truncate font-mono font-medium">Support Active</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Academics Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
            Academics & Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ACADEMIC_MODULES.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url || (item.url !== `${basePath}/dashboard` && pathname?.startsWith(item.url));
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

        {/* Finance & Operations Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
            Finance & Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {OPS_MODULES.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url || pathname?.startsWith(item.url);
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

        {/* Campus Administration Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
            Campus Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CAMPUS_MODULES.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url || pathname?.startsWith(item.url);
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

        {/* Super Admin Return Link */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Super Admin Console">
                  <Link href="/super-admin" className="text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100">
                    <ShieldCheck className="size-4 text-zinc-800" />
                    <span>Super Admin Console</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200 p-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
