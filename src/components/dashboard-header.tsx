"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Building2, ShieldAlert, ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  portalType: "super-admin" | "school";
  schoolSlug?: string;
}

export function DashboardHeader({ portalType, schoolSlug }: DashboardHeaderProps) {
  const pathname = usePathname();

  const [supportSessionActive, setSupportSessionActive] = React.useState(false);
  const [supportReason, setSupportReason] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setSupportSessionActive(localStorage.getItem("support_session_active") === "true");
      setSupportReason(localStorage.getItem("support_session_reason") || "");
    }
  }, []);

  const handleExitSupport = () => {
    localStorage.removeItem("support_session_active");
    localStorage.removeItem("support_session_reason");
    localStorage.setItem("demo_role", "SUPER_ADMIN");
    window.location.href = "/super-admin/support-access";
  };

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <>
      {/* Support Session Active Notice Banner (Flow #4) */}
      {supportSessionActive && portalType === "school" && (
        <div className="bg-zinc-100 border-b border-zinc-300 px-6 py-2 flex items-center justify-between text-xs z-30">
          <div className="flex items-center gap-2 text-zinc-900 font-mono">
            <ShieldAlert className="size-4 text-zinc-950 animate-pulse" />
            <span>
              <strong>PRIVILEGED SUPPORT SESSION ACTIVE:</strong> Platform Support Impersonation ({supportReason})
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleExitSupport}
            className="h-7 text-xs bg-zinc-200 text-zinc-900 border border-zinc-300 hover:bg-zinc-300 font-semibold"
          >
            <ArrowLeft className="size-3 mr-1" /> Exit to Super Admin
          </Button>
        </div>
      )}

      {/* Main Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-white/95 backdrop-blur px-4 lg:px-6 sticky top-0 z-20 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="-ml-1 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-300" />

          {/* Breadcrumbs */}
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-xs text-zinc-500">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={portalType === "super-admin" ? "/super-admin" : `/${schoolSlug}/dashboard`}>
                    {portalType === "super-admin" ? "Platform" : schoolSlug?.replace("-", " ") || "School"}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.length > 1 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize font-medium text-zinc-900">
                      {pathSegments[pathSegments.length - 1].replace("-", " ")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search flows, records..."
              className="h-8 w-56 lg:w-72 rounded-md border border-zinc-300 bg-white pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-400"
            />
          </div>

          {portalType === "super-admin" ? (
            <div className="flex items-center gap-2">
              <Badge variant="subtle" className="text-[10px] font-mono border-zinc-200 bg-zinc-100 text-zinc-700 hidden lg:inline-flex">
                GLOBAL CLUSTER: US-EAST-1
              </Badge>
              <Link href="/greenwood-high/dashboard">
                <Button variant="secondary" size="sm" className="h-8 text-xs bg-zinc-100 border border-zinc-300 hover:bg-zinc-200 text-zinc-800">
                  <Building2 className="size-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Greenwood High</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Badge variant="secondary" className="text-[10px] font-mono bg-zinc-100 text-zinc-700 border-zinc-200">
              ACADEMIC YEAR 2026-2027
            </Badge>
          )}
        </div>
      </header>
    </>
  );
}
