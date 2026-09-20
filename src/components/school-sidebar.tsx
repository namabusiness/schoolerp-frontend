"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserPlus,
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
  ShieldAlert,
  FileText,
  KeyRound,
  UserCheck,
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
import { erpApi } from "@/lib/api";

interface SchoolSidebarProps extends React.ComponentProps<typeof Sidebar> {
  schoolSlug: string;
}

export function SchoolSidebar({ schoolSlug, ...props }: SchoolSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = `/${schoolSlug}`;

  const [supportActive, setSupportActive] = React.useState(false);
  const [activeRole, setActiveRole] = React.useState<string>("SCHOOL_ADMIN");
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [classTeacherBadge, setClassTeacherBadge] = React.useState<string | null>(null);

  const currentTab = searchParams?.get("tab") || "timetable";

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("demo_role") || localStorage.getItem("auth_role") || "SCHOOL_ADMIN";
      setActiveRole(role);
      setSupportActive(localStorage.getItem("support_session_active") === "true");

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          setCurrentUser(parsed);
        } catch (e) {}
      }

      erpApi.getProfile().then((res) => {
        if (res) {
          setCurrentUser(res);
          const staff = res.staffProfile;
          if (staff?.managedClasses?.length > 0) {
            setClassTeacherBadge(staff.managedClasses[0].name);
          } else if (staff?.managedSections?.length > 0) {
            const sec = staff.managedSections[0];
            setClassTeacherBadge(`${sec.gradeClass?.name || "Class"} - ${sec.name}`);
          } else {
            setClassTeacherBadge(null);
          }
        }
      }).catch(() => {});
    }
  }, [pathname]);

  // -------------------------------------------------------------
  // TEACHER PORTAL ISOLATED MODULES (Requested 10 Features)
  // -------------------------------------------------------------
  const TEACHER_TEACHING_MODULES = [
    { title: "Timetable & Classes", tab: "timetable", url: `${basePath}/teacher?tab=timetable`, icon: CalendarCheck },
    { title: "Allotted Subjects", tab: "subjects", url: `${basePath}/teacher?tab=subjects`, icon: BookOpen },
    { title: "Question Papers & Exams", tab: "exams", url: `${basePath}/teacher?tab=exams`, icon: FileText },
    { title: "Homework & Assignments", tab: "homework", url: `${basePath}/teacher?tab=homework`, icon: Award },
  ];

  const TEACHER_CLASS_TEACHER_MODULES = [
    { title: "Class Students & Parents", tab: "roster", url: `${basePath}/teacher?tab=roster`, icon: Users },
    { title: "Daily Attendance & Excel", tab: "attendance", url: `${basePath}/teacher?tab=attendance`, icon: FileCheck2 },
    { title: "Marks Enrollment", tab: "marks", url: `${basePath}/teacher?tab=marks`, icon: Award },
  ];

  const TEACHER_FACULTY_MODULES = [
    { title: "Leave Applications", tab: "leaves", url: `${basePath}/teacher?tab=leaves`, icon: Briefcase },
    { title: "Academic Calendar", tab: "calendar", url: `${basePath}/teacher?tab=calendar`, icon: Calendar },
    { title: "Profile & Password Reset", tab: "profile", url: `${basePath}/teacher?tab=profile`, icon: Settings },
  ];

  // -------------------------------------------------------------
  // DRIVER PORTAL ISOLATED MODULES
  // -------------------------------------------------------------
  const DRIVER_MODULES = [
    { title: "Transport & My Route", url: `${basePath}/transport?tab=routes`, icon: Bus },
    { title: "Vehicle & Fleet Status", url: `${basePath}/transport?tab=fleet`, icon: ShieldCheck },
    { title: "Schedule & Daily Trips", url: `${basePath}/transport?tab=trips`, icon: CalendarCheck },
  ];

  // -------------------------------------------------------------
  // SCHOOL ADMIN & DEFAULT MODULES (Existing Flows Preserved)
  // -------------------------------------------------------------
  const ACADEMIC_MODULES = [
    { title: "Campus Overview", url: `${basePath}/dashboard`, icon: LayoutDashboard },
    { title: "New Admission", url: `${basePath}/admissions/new`, icon: UserPlus, badge: "NEW" },
    { title: "Admissions Pipeline", url: `${basePath}/admissions`, icon: GraduationCap },
    { title: "Document Vault & TC", url: `${basePath}/admissions?tab=vault`, icon: FileCheck2 },
    { title: "Students (360 Hub)", url: `${basePath}/students`, icon: Users },
    { title: "Academic Setup", url: `${basePath}/academics`, icon: BookOpen },
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
    name: currentUser?.name || (activeRole === "TEACHER" ? "Faculty Member" : activeRole === "DRIVER" ? "Fleet Driver" : "School Administrator"),
    email: currentUser?.email || (activeRole === "TEACHER" ? "faculty@greenwoodhigh.edu" : activeRole === "DRIVER" ? "driver@greenwoodhigh.edu" : "admin@greenwoodhigh.edu"),
    avatar: currentUser?.avatarUrl || "",
  };

  const isTeacher = activeRole === "TEACHER";
  const isDriver = activeRole === "DRIVER";

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-zinc-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-zinc-100">
              <Link href={isTeacher ? `${basePath}/teacher` : isDriver ? `${basePath}/transport` : `${basePath}/dashboard`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-xs uppercase">
                  {schoolSlug.substring(0, 2)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-zinc-950 capitalize">
                    {schoolSlug.replace("-", " ")}
                  </span>
                  <span className="truncate text-[10px] text-zinc-500 font-mono">
                    {isTeacher ? "Teacher Portal • Faculty" : isDriver ? "Driver Portal • Fleet" : "2026-2027 • Term 1"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {isTeacher && classTeacherBadge && (
          <div className="mx-2 my-1 px-2.5 py-1.5 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500 font-medium">CLASS TEACHER</span>
            <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-white text-zinc-900 border-zinc-300">
              {classTeacherBadge}
            </Badge>
          </div>
        )}

        {supportActive && (
          <div className="px-2 py-1.5 rounded-md bg-zinc-100 border border-zinc-300 flex items-center gap-2 text-[11px] text-zinc-900">
            <ShieldAlert className="size-3.5 text-zinc-950 shrink-0 animate-pulse" />
            <span className="truncate font-mono font-medium">Support Active</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {isTeacher ? (
          /* ========================================================= */
          /* TEACHER EXCLUSIVE SIDEBAR (All 10 Features, Nothing Else) */
          /* ========================================================= */
          <>
            {/* 1. Teaching & Classes */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
                Teaching & Classes
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {TEACHER_TEACHING_MODULES.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname?.includes("/teacher") && currentTab === item.tab;
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
                            <Icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* 2. Class Teacher Hub */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 flex items-center justify-between">
                <span>Class Teacher Hub</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {TEACHER_CLASS_TEACHER_MODULES.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname?.includes("/teacher") && currentTab === item.tab;
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
                            <Icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* 3. Faculty Workspace */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
                Faculty Workspace
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {TEACHER_FACULTY_MODULES.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname?.includes("/teacher") && currentTab === item.tab;
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
                            <Icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : isDriver ? (
          /* ========================================================= */
          /* DRIVER EXCLUSIVE SIDEBAR (Fleet & Assigned Routes Only)   */
          /* ========================================================= */
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
              Fleet Transport & Routes
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {DRIVER_MODULES.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname?.includes("/transport");
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
                          <Icon className="size-4 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          /* ========================================================= */
          /* SCHOOL ADMIN SIDEBAR (Existing Admin Navigation Intact)   */
          /* ========================================================= */
          <>
            {/* Academics Group */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
                Academics & Operations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ACADEMIC_MODULES.map((item) => {
                    const Icon = item.icon;
                    const isNewAdmission = item.url === `${basePath}/admissions/new`;
                    const isAdmissionsPipeline = item.url === `${basePath}/admissions`;
                    let isActive = false;
                    if (isNewAdmission) {
                      isActive = pathname === `${basePath}/admissions/new`;
                    } else if (isAdmissionsPipeline) {
                      isActive = pathname === `${basePath}/admissions` && !pathname.includes("/new");
                    } else if (item.url === `${basePath}/dashboard`) {
                      isActive = pathname === item.url;
                    } else {
                      isActive = pathname === item.url || (pathname?.startsWith(`${item.url}/`) ?? false);
                    }
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
                          <Link href={item.url} className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Icon className="size-4 shrink-0" />
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] font-mono font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded">
                                {item.badge}
                              </span>
                            )}
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
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200 p-2">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

