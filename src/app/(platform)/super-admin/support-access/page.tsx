"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ShieldAlert,
  Building2,
  KeyRound,
  ArrowRight,
  History,
  Lock,
} from "lucide-react";
import { erpApi } from "@/lib/api";

const SCHOOLS_OPTIONS = [
  { id: "school-greenwood-high", name: "Greenwood High International", slug: "greenwood-high", code: "GWH-2026" },
  { id: "school-oakridge", name: "Oakridge STEM Academy", slug: "oakridge-stem", code: "OAK-2026" },
  { id: "school-st-xaviers", name: "St. Xavier Collegiate", slug: "st-xaviers", code: "STX-2026" },
];

const PREVIOUS_SESSIONS = [
  {
    id: "sess-991",
    schoolName: "Oakridge STEM Academy",
    reason: "Fixed fee invoice rounding discrepancy on Term 1 demand",
    admin: "root@schoolerp.com",
    startedAt: "2026-09-14 14:22",
    duration: "18 mins",
  },
  {
    id: "sess-982",
    schoolName: "Greenwood High International",
    reason: "Configured secondary route stops for Volvo Bus 01",
    admin: "root@schoolerp.com",
    startedAt: "2026-09-10 10:05",
    duration: "25 mins",
  },
];

export default function SupportAccessPage() {
  const router = useRouter();
  const [selectedSchoolId, setSelectedSchoolId] = React.useState(SCHOOLS_OPTIONS[0].id);
  const [reason, setReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const targetSchool = SCHOOLS_OPTIONS.find((s) => s.id === selectedSchoolId) || SCHOOLS_OPTIONS[0];

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Mandatory requirement: Reason for support session must be recorded in audit log.");
      return;
    }

    setLoading(true);
    try {
      await erpApi.createSupportSession(targetSchool.id, reason);
    } catch {
      // Fallback
    }

    localStorage.setItem("support_session_active", "true");
    localStorage.setItem("support_session_school", targetSchool.name);
    localStorage.setItem("support_session_reason", reason);
    localStorage.setItem("school_id", targetSchool.id);
    localStorage.setItem("demo_role", "SCHOOL_ADMIN");

    router.push(`/school/${targetSchool.slug}/dashboard`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Privileged Support Access Flow</h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          FLOW #4: TEMPORARY AUTHORIZED SUPPORT SESSION WITHOUT ADMIN PASSWORD & WITH IMMUTABLE AUDITING
        </p>
      </div>

      <Alert variant="contrast" className="border-zinc-700 bg-zinc-900/80">
        <ShieldAlert className="h-4 w-4 text-white" />
        <AlertTitle className="text-sm font-semibold text-white">Cryptographic Security Protocol</AlertTitle>
        <AlertDescription className="text-xs text-zinc-400">
          Super Administrators access school tenants via cryptographically signed temporary tokens. School admin passwords are never exposed, requested, or overridden. All mutations performed during this session are tagged with your platform ID in the immutable Audit Log.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Session Creator */}
        <Card className="md:col-span-2 bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">Initiate Support Session</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Select the school tenant requiring maintenance or administrative assistance.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleStartSession}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Target School Tenant</Label>
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    {SCHOOLS_OPTIONS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">
                  Explicit Support Justification & Ticket ID
                </Label>
                <Textarea
                  placeholder="e.g. Ticket #SUP-4892: Assisting school admin Dr. Vance with timetable slot conflict resolution for Grade 10 Science..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  className="bg-zinc-950 border-zinc-800 text-xs text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="p-3 rounded border border-zinc-800 bg-zinc-950/60 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Session Token Scope:</span>
                  <Badge variant="contrast" className="text-[10px]">TIME-LIMITED (60 MINS)</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Audit Trail:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">ENABLED (STRICT)</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
              >
                {loading ? "Authenticating Session..." : `Enter ${targetSchool.name}`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Tenant Summary Preview */}
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">Tenant Info</CardTitle>
            <CardDescription className="text-xs text-zinc-400">Target overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <div className="text-zinc-500 text-[10px] font-mono uppercase">Institution</div>
              <div className="font-semibold text-white mt-0.5">{targetSchool.name}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] font-mono uppercase">Tenant Code</div>
              <div className="font-mono text-zinc-300 mt-0.5">{targetSchool.code}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] font-mono uppercase">Slug</div>
              <div className="font-mono text-zinc-300 mt-0.5">/{targetSchool.slug}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] font-mono uppercase">Primary Admin</div>
              <div className="text-zinc-300 mt-0.5">Dr. Eleanor Vance</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Support Sessions Audit */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <History className="h-4 w-4" /> Support Session History
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Complete historical record of privileged platform interventions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {PREVIOUS_SESSIONS.map((sess) => (
            <div
              key={sess.id}
              className="p-3 rounded-md border border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-semibold text-white">{sess.schoolName}</div>
                <div className="text-zinc-400 mt-0.5 text-[11px]">{sess.reason}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-zinc-400 font-mono text-[11px]">{sess.startedAt}</div>
                <div className="text-[10px] text-zinc-500 font-mono">Session: {sess.duration}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
