"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Plus,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
} from "recharts";

const MONTHLY_GROWTH_DATA = [
  { month: "Apr", schools: 6, students: 2400, mrr: 2100 },
  { month: "May", schools: 8, students: 3100, mrr: 3200 },
  { month: "Jun", schools: 12, students: 4800, mrr: 4800 },
  { month: "Jul", schools: 15, students: 6200, mrr: 5900 },
  { month: "Aug", schools: 21, students: 8900, mrr: 8400 },
  { month: "Sep", schools: 28, students: 12400, mrr: 11200 },
];

const RECENT_SCHOOLS = [
  {
    id: "school-greenwood-high",
    name: "Greenwood High International",
    slug: "greenwood-high",
    code: "GWH-2026",
    plan: "Enterprise",
    status: "ACTIVE",
    studentsCount: 1420,
    staffCount: 112,
    renewalDate: "2027-05-31",
  },
  {
    id: "school-oakridge",
    name: "Oakridge STEM Academy",
    slug: "oakridge-stem",
    code: "OAK-2026",
    plan: "Professional",
    status: "ACTIVE",
    studentsCount: 840,
    staffCount: 65,
    renewalDate: "2027-04-15",
  },
  {
    id: "school-st-xaviers",
    name: "St. Xavier Collegiate",
    slug: "st-xaviers",
    code: "STX-2026",
    plan: "Standard",
    status: "TRIAL",
    studentsCount: 310,
    staffCount: 28,
    renewalDate: "2026-10-15",
  },
  {
    id: "school-cambridge",
    name: "Northbridge Grammar School",
    slug: "northbridge",
    code: "NBG-2026",
    plan: "Enterprise",
    status: "SUSPENDED",
    studentsCount: 920,
    staffCount: 74,
    renewalDate: "2026-08-01",
  },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Master Dashboard</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            GLOBAL SAAS HEALTH, MULTI-TENANT MONITORING & REVENUE ENGINE
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/super-admin/support-access">
            <Button variant="outline" size="sm" className="text-xs border-zinc-700 bg-zinc-900 hover:bg-zinc-800">
              <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
              Support Access Session
            </Button>
          </Link>
          <Link href="/super-admin/schools">
            <Button size="sm" className="text-xs bg-white text-black hover:bg-zinc-200">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Register New School
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">28</div>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="h-3 w-3 text-zinc-300" /> +6 new tenants this quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,400</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Across all enrolled institutions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Staff & Faculty</CardTitle>
            <Users className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">980</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Teachers, admins, transport & HR
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">SaaS Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$11,200</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Recurring subscription billing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts in Monochrome */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-950">Tenant Growth & Adoptions</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Number of schools active on the platform over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_GROWTH_DATA}>
                  <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={11} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#09090b", fontSize: "12px" }}
                  />
                  <Bar dataKey="schools" fill="#18181b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-950">Total Students Enrolled</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Active student accounts receiving timetable, attendance and exams updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_GROWTH_DATA}>
                  <XAxis dataKey="month" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={11} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#09090b", fontSize: "12px" }}
                  />
                  <Line type="monotone" dataKey="students" stroke="#18181b" strokeWidth={2} dot={{ fill: "#18181b", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schools Table */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white">Institutional Tenants</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Overview of active school subscriptions and operational status
            </CardDescription>
          </div>
          <Link href="/super-admin/schools">
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
              View All Schools <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>School Name & Code</TableHead>
                <TableHead>ERP Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Faculty / Staff</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_SCHOOLS.map((school) => (
                <TableRow key={school.id} className="border-zinc-800/60 hover:bg-zinc-900/40">
                  <TableCell>
                    <div className="font-medium text-white text-xs">{school.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{school.code} • /{school.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300 font-mono">
                      {school.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        school.status === "ACTIVE"
                          ? "contrast"
                          : school.status === "TRIAL"
                          ? "subtle"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {school.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{school.studentsCount}</TableCell>
                  <TableCell className="font-mono text-xs">{school.staffCount}</TableCell>
                  <TableCell className="text-xs text-zinc-400 font-mono">{school.renewalDate}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/school/${school.slug}/dashboard`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-700 hover:bg-zinc-800">
                        Launch Portal
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
