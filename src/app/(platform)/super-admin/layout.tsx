"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Users,
  Shield,
  CreditCard,
  LifeBuoy,
  FileText,
  BarChart3,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SUPER_ADMIN_NAV = [
  { label: "Platform Overview", href: "/super-admin", icon: LayoutDashboard },
  { label: "Schools & Tenants", href: "/super-admin/schools", icon: Building2 },
  { label: "School Administrators", href: "/super-admin/administrators", icon: Users },
  { label: "Roles & Permissions", href: "/super-admin/roles", icon: Shield },
  { label: "Subscriptions & Plans", href: "/super-admin/subscriptions", icon: CreditCard },
  { label: "Support Access", href: "/super-admin/support-access", icon: LifeBuoy },
  { label: "Platform Audit Logs", href: "/super-admin/audit-logs", icon: FileText },
  { label: "Platform Reports", href: "/super-admin/reports", icon: BarChart3 },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-white text-zinc-950 selection:bg-zinc-200 selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white font-bold text-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-zinc-950 tracking-wide">SUPER ADMIN</div>
            <div className="text-[10px] text-zinc-500 font-mono">PLATFORM CONTROL</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
            Platform Master
          </div>
          {SUPER_ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all",
                  isActive
                    ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm border border-zinc-300"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-zinc-200 space-y-2">
          <div className="flex items-center justify-between px-3 py-1.5 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-[11px] text-zinc-600 font-medium">Root Node</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-zinc-200 text-zinc-900">ACTIVE</Badge>
          </div>
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
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search schools, admins, records..."
                className="h-9 w-72 rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <Badge variant="subtle" className="font-mono text-[10px] bg-zinc-100 text-zinc-700 border-zinc-200">
              SAAS TIER: ENTERPRISE GLOBAL
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/greenwood-high/dashboard">
              <Button variant="secondary" size="sm" className="text-xs bg-zinc-100 border-zinc-300 hover:bg-zinc-200 text-zinc-800">
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                Go to Greenwood High Portal
              </Button>
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
              <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold">
                SA
              </div>
              <div className="text-xs text-left">
                <div className="font-medium text-white">Super Administrator</div>
                <div className="text-[10px] text-zinc-400 font-mono">root@schoolerp.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
