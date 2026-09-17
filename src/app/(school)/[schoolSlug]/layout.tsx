"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
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
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SCHOOL_NAV = [
  { label: "School Dashboard", hrefSuffix: "/dashboard", icon: LayoutDashboard },
  { label: "Academic Setup", hrefSuffix: "/academics", icon: BookOpen },
  { label: "Admissions Pipeline", hrefSuffix: "/admissions", icon: GraduationCap },
  { label: "Students (360 Hub)", hrefSuffix: "/students", icon: Users },
  { label: "Daily Operations", hrefSuffix: "/daily-ops", icon: CalendarCheck },
  { label: "Attendance Engine", hrefSuffix: "/attendance", icon: FileCheck2 },
  { label: "Homework & Learning", hrefSuffix: "/homework", icon: BookOpen },
  { label: "Examinations & Results", hrefSuffix: "/examinations", icon: Award },
  { label: "Fees & Invoicing", hrefSuffix: "/fees", icon: Receipt },
  { label: "Transport & Fleet", hrefSuffix: "/transport", icon: Bus },
  { label: "Library Circulation", hrefSuffix: "/library", icon: Library },
  { label: "Communication Notices", hrefSuffix: "/communication", icon: Megaphone },
  { label: "Staff & HR Payroll", hrefSuffix: "/hr", icon: Briefcase },
  { label: "Inventory & Assets", hrefSuffix: "/inventory", icon: Boxes },
  { label: "Events & Awards", hrefSuffix: "/events", icon: Calendar },
  { label: "Health & Incidents", hrefSuffix: "/health", icon: HeartPulse },
  { label: "Certificates & TC", hrefSuffix: "/certificates", icon: Award },
  { label: "Promotion & Rollover", hrefSuffix: "/promotion", icon: ArrowRightLeft },
  { label: "School Settings", hrefSuffix: "/settings", icon: Settings },
];

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  const [supportSessionActive, setSupportSessionActive] = React.useState(false);
  const [supportReason, setSupportReason] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const active = localStorage.getItem("support_session_active") === "true";
      const reason = localStorage.getItem("support_session_reason") || "";
      setSupportSessionActive(active);
      setSupportReason(reason);
    }
  }, []);

  const handleExitSupport = () => {
    localStorage.removeItem("support_session_active");
    localStorage.removeItem("support_session_reason");
    localStorage.setItem("demo_role", "SUPER_ADMIN");
    router.push("/super-admin/support-access");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const basePath = `/${schoolSlug}`;

  return (
    <div className="flex min-h-screen bg-white text-zinc-950 selection:bg-zinc-200 selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col fixed inset-y-0 z-30">
        {/* School Header */}
        <div className="h-16 flex items-center px-4 border-b border-zinc-200 gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs">
            GW
          </div>
          <div className="truncate">
            <div className="font-bold text-xs text-zinc-950 truncate">Greenwood High</div>
            <div className="text-[10px] text-zinc-500 font-mono">GWH-2026 • Term 1</div>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <div className="px-2 py-1.5 text-[9px] font-mono tracking-wider text-zinc-500 uppercase">
            School ERP Modules
          </div>
          {SCHOOL_NAV.map((item) => {
            const Icon = item.icon;
            const fullHref = `${basePath}${item.hrefSuffix}`;
            const isActive = pathname === fullHref || pathname?.startsWith(`${fullHref}/`);
            return (
              <Link
                key={item.hrefSuffix}
                href={fullHref}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm border border-zinc-300"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 space-y-2">
          <Link href="/super-admin">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              Super Admin Console
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        {/* Support Session Top Banner (Flow #4) */}
        {supportSessionActive && (
          <div className="bg-zinc-100 border-b border-zinc-300 px-6 py-2 flex items-center justify-between text-xs z-30">
            <div className="flex items-center gap-2 text-zinc-800 font-mono">
              <ShieldAlert className="h-4 w-4 text-zinc-950 animate-pulse" />
              <span>
                <strong>PRIVILEGED SUPPORT SESSION ACTIVE:</strong> Platform Support Impersonation ({supportReason})
              </span>
            </div>
            <Button
              size="sm"
              onClick={handleExitSupport}
              className="h-7 text-xs bg-zinc-200 text-zinc-900 border border-zinc-300 hover:bg-zinc-300 font-semibold"
            >
              <ArrowLeft className="h-3 w-3 mr-1" /> Exit to Super Admin
            </Button>
          </div>
        )}

        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-[10px] font-mono bg-zinc-100 text-zinc-800 border-zinc-300">
              ACADEMIC YEAR 2026-2027
            </Badge>
            <span className="text-xs text-zinc-500 font-mono">• SESSION ACTIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-semibold text-zinc-950">Dr. Eleanor Vance</div>
              <div className="text-[10px] text-zinc-500 font-mono">School Administrator</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-900">
              EV
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
