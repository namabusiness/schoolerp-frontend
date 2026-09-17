"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, BarChart2, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PLAN_SHARE = [
  { name: "Enterprise", value: 12, fill: "#ffffff" },
  { name: "Professional", value: 8, fill: "#a3a3a3" },
  { name: "Standard", value: 5, fill: "#525252" },
  { name: "Basic", value: 3, fill: "#262626" },
];

const MODULE_ADOPTION = [
  { module: "Attendance", schools: 28 },
  { module: "Academics", schools: 28 },
  { module: "Fees", schools: 26 },
  { module: "Admissions", schools: 24 },
  { module: "Exams", schools: 22 },
  { module: "Transport", schools: 18 },
  { module: "Library", schools: 17 },
  { module: "HR / Staff", schools: 15 },
  { module: "Health", schools: 14 },
];

export default function PlatformReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Reports & SaaS Analytics</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            CROSS-INSTITUTION REVENUE, ADOPTION RATES & CAPACITY AUDIT
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert("Exporting comprehensive platform SaaS metrics CSV report...")}
          className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export SaaS Intelligence (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-950">Subscription Plan Distribution</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Breakdown of schools across pricing tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PLAN_SHARE}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    fontSize={11}
                    fill="#18181b"
                  >
                    {PLAN_SHARE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#09090b", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-950">Module Adoption across Institutions</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Total schools with module active and in operation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MODULE_ADOPTION} layout="vertical">
                  <XAxis type="number" stroke="#737373" fontSize={11} />
                  <YAxis dataKey="module" type="category" stroke="#737373" fontSize={11} width={80} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#09090b", fontSize: "12px" }}
                  />
                  <Bar dataKey="schools" fill="#18181b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
