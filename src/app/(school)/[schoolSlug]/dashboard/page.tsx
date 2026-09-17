"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Bus,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

const ATTENDANCE_WEEK_DATA = [
  { day: "Mon", rate: 96 },
  { day: "Tue", rate: 94 },
  { day: "Wed", rate: 98 },
  { day: "Thu", rate: 95 },
  { day: "Fri", rate: 97 },
];

export default function SchoolDashboardPage() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const basePath = `/school/${schoolSlug}`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Greenwood High International</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            CAMPUS OPERATIONAL OVERVIEW • ACADEMIC SESSION 2026-2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`${basePath}/attendance`}>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs">
              <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
              Take Today's Attendance
            </Button>
          </Link>
          <Link href={`${basePath}/admissions`}>
            <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs">
              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
              New Admission
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,420</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">Capacity: 2,500 enrolled</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Today's Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">97.2%</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">1,380 Present • 40 Absent</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Term Fee Collection</CardTitle>
            <Receipt className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$248,600</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">88% of Term 1 demand cleared</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Fleet In Transit</CardTitle>
            <Bus className="h-4 w-4 text-zinc-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">6 Routes</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">All morning trips on schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Attendance Trend & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white border-zinc-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-zinc-950">Weekly Student Attendance %</CardTitle>
              <CardDescription className="text-xs text-zinc-500">Average percentage across Grade 1 to 12</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ATTENDANCE_WEEK_DATA}>
                    <XAxis dataKey="day" stroke="#737373" fontSize={11} tickLine={false} />
                    <YAxis domain={[80, 100]} stroke="#737373" fontSize={11} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#09090b", fontSize: "12px" }}
                    />
                    <Bar dataKey="rate" fill="#18181b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Operations Checklist */}
        <Card className="bg-zinc-900/60 border-zinc-800 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">Daily Operational Actions</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Tasks pending school administrator action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={`${basePath}/attendance`}>
              <div className="p-2.5 rounded border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 transition-colors flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-white">Lock Grade 10 Attendance</div>
                  <div className="text-[10px] text-zinc-500">Roll call completed by Prof. Sterling</div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </div>
            </Link>

            <Link href={`${basePath}/admissions`}>
              <div className="p-2.5 rounded border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 transition-colors flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-white">4 New Applications to Review</div>
                  <div className="text-[10px] text-zinc-500">Entrance tests completed</div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </div>
            </Link>

            <Link href={`${basePath}/fees`}>
              <div className="p-2.5 rounded border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 transition-colors flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-white">Generate Term 2 Fee Invoices</div>
                  <div className="text-[10px] text-zinc-500">Scheduled demand issuance</div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </div>
            </Link>

            <Link href={`${basePath}/certificates`}>
              <div className="p-2.5 rounded border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 transition-colors flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-white">2 Transfer Certificates Pending</div>
                  <div className="text-[10px] text-zinc-500">Library and fee clearance validated</div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </div>
            </Link>
          </CardContent>
          <div className="p-4 border-t border-zinc-800">
            <Link href={`${basePath}/students/student-alex-chen`}>
              <Button variant="outline" size="sm" className="w-full text-xs border-zinc-700 bg-zinc-950 hover:bg-zinc-800">
                Inspect Alexander Chen (Student 360 Hub)
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
