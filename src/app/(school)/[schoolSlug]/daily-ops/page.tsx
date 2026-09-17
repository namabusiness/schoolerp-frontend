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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarCheck,
  Plus,
  Users,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";

const INITIAL_SUBSTITUTIONS = [
  {
    id: "sub-1",
    date: "2026-09-16",
    period: "Period 3 (10:20 - 11:05)",
    class: "Grade 10 - Section A",
    subject: "Chemistry Lab",
    originalTeacher: "Dr. Ronald Hayes (Sick Leave)",
    substituteTeacher: "Prof. Marcus Sterling",
    status: "ACTIVE_DUTY",
  },
  {
    id: "sub-2",
    date: "2026-09-16",
    period: "Period 4 (11:05 - 11:50)",
    class: "Grade 9 - Section B",
    subject: "English Literature",
    originalTeacher: "Emily Watson (Attending Seminar)",
    substituteTeacher: "Claire Davies",
    status: "ACTIVE_DUTY",
  },
];

export default function DailyOperationsPage() {
  const [substitutions, setSubstitutions] = React.useState(INITIAL_SUBSTITUTIONS);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [period, setPeriod] = React.useState("Period 2 (09:15 - 10:00)");
  const [targetClass, setTargetClass] = React.useState("Grade 8 - Section A");
  const [originalTeacher, setOriginalTeacher] = React.useState("Claire Davies");
  const [substituteTeacher, setSubstituteTeacher] = React.useState("Dr. Catherine Brooks");
  const [reason, setReason] = React.useState("Emergency Medical Leave");

  const handleAddSubstitution = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub = {
      id: `sub-${Date.now()}`,
      date: "2026-09-16",
      period,
      class: targetClass,
      subject: "Biology & General Science",
      originalTeacher: `${originalTeacher} (${reason})`,
      substituteTeacher,
      status: "ACTIVE_DUTY",
    };
    setSubstitutions([newSub, ...substitutions]);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Daily School Operations Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #11: MORNING ARRIVAL, STAFF DUTY, TEACHER SUBSTITUTIONS & END-OF-DAY AUDIT
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Arrange Teacher Substitution
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Arrange Teacher Substitution</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Prevent unattended classroom periods when faculty are on leave or attending official events.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubstitution} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Period Slot</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="Period 1 (08:30 - 09:15)">Period 1 (08:30 - 09:15)</SelectItem>
                    <SelectItem value="Period 2 (09:15 - 10:00)">Period 2 (09:15 - 10:00)</SelectItem>
                    <SelectItem value="Period 3 (10:20 - 11:05)">Period 3 (10:20 - 11:05)</SelectItem>
                    <SelectItem value="Period 4 (11:05 - 11:50)">Period 4 (11:05 - 11:50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Class & Section</Label>
                <Input value={targetClass} onChange={(e) => setTargetClass(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-400">Absent Teacher</Label>
                  <Input value={originalTeacher} onChange={(e) => setOriginalTeacher(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-400">Substitute Teacher</Label>
                  <Input value={substituteTeacher} onChange={(e) => setSubstituteTeacher(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-400">Reason / Duty Description</Label>
                <Input value={reason} onChange={(e) => setReason(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Dispatch Substitution
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Staff Attendance Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">110 / 112</div>
            <p className="text-[11px] text-zinc-500 mt-1">98.2% Faculty Reporting • 2 on Approved Leave</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Classroom Substitution Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{substitutions.length} Active</div>
            <p className="text-[11px] text-zinc-500 mt-1">Zero unattended class periods recorded</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Automated Parent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">38 Dispatched</div>
            <p className="text-[11px] text-zinc-500 mt-1">Instant SMS & WhatsApp for unexcused absence</p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Substitution Register */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white">Daily Teacher Substitution Register</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Live adjustments to daily academic schedule
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Period Slot</TableHead>
                <TableHead>Classroom</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Original Teacher (Absent)</TableHead>
                <TableHead>Substitute Teacher</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {substitutions.map((sub) => (
                <TableRow key={sub.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                  <TableCell className="font-mono text-white">{sub.period}</TableCell>
                  <TableCell className="font-medium text-white">{sub.class}</TableCell>
                  <TableCell className="text-zinc-300">{sub.subject}</TableCell>
                  <TableCell className="text-zinc-400">{sub.originalTeacher}</TableCell>
                  <TableCell className="font-semibold text-white flex items-center gap-1">
                    <ArrowRightLeft className="h-3 w-3 text-zinc-400" /> {sub.substituteTeacher}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="contrast" className="text-[10px]">{sub.status}</Badge>
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
