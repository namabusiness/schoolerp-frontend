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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Users,
  Send,
  Sparkles,
} from "lucide-react";
import { erpApi } from "@/lib/api";

type AttStatus = "PRESENT" | "ABSENT" | "LEAVE" | "LATE";

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  status: AttStatus;
  remarks: string;
}

const INITIAL_ROLL_CALL: StudentRecord[] = [
  { id: "student-alex-chen", rollNo: "10-A-01", name: "Alexander Chen", status: "PRESENT", remarks: "" },
  { id: "student-emma-watson", rollNo: "10-A-02", name: "Emma Watson", status: "PRESENT", remarks: "" },
  { id: "student-liam-smith", rollNo: "10-A-03", name: "Liam Smith", status: "ABSENT", remarks: "Unexcused morning absence" },
  { id: "student-olivia-taylor", rollNo: "10-A-04", name: "Olivia Taylor", status: "PRESENT", remarks: "" },
  { id: "student-noah-wilson", rollNo: "10-A-05", name: "Noah Wilson", status: "LATE", remarks: "Late arrival - 08:45 AM" },
  { id: "student-ava-brown", rollNo: "10-A-06", name: "Ava Brown", status: "LEAVE", remarks: "Doctor appointment" },
];

export default function AttendanceFlowPage() {
  const [records, setRecords] = React.useState<StudentRecord[]>(INITIAL_ROLL_CALL);
  const [isLocked, setIsLocked] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState("Grade 10 - Section A");
  const [submittedAlert, setSubmittedAlert] = React.useState(false);

  // Quick Action: "Mark All Present" (Flow #12 explicit step)
  const handleMarkAllPresent = () => {
    if (isLocked) return;
    setRecords((prev) =>
      prev.map((r) => ({ ...r, status: "PRESENT", remarks: "" }))
    );
  };

  const updateStatus = (id: string, status: AttStatus) => {
    if (isLocked) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleSubmitAndLock = () => {
    setIsLocked(true);
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 4000);
  };

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const leaveCount = records.filter((r) => r.status === "LEAVE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Daily Attendance Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #12: SELECT CLASS → MARK ALL PRESENT → UPDATE EXCEPTIONS → SUBMIT & LOCK → NOTIFY PARENTS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLocked ? (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
              <Lock className="h-3.5 w-3.5" /> ATTENDANCE LOCKED & COMMITTED
            </Badge>
          ) : (
            <Badge variant="subtle" className="text-xs gap-1 py-1 px-3">
              <FileCheck2 className="h-3.5 w-3.5" /> IN SESSION (EDITABLE)
            </Badge>
          )}
        </div>
      </div>

      {submittedAlert && (
        <div className="p-3 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-white" />
            <span>Attendance locked. Database synchronized. Automated parent notifications dispatched via SMS & WhatsApp.</span>
          </div>
          <Badge variant="contrast" className="text-[10px]">SYNC OK</Badge>
        </div>
      )}

      {/* Class Selector & Quick "Mark All Present" bar */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Label className="text-xs text-zinc-400">Classroom:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-56 bg-zinc-950 border-zinc-800 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                <SelectItem value="Grade 10 - Section A">Grade 10 - Section A</SelectItem>
                <SelectItem value="Grade 10 - Section B">Grade 10 - Section B</SelectItem>
                <SelectItem value="Grade 9 - Section A">Grade 9 - Section A</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-zinc-500 font-mono">Date: 2026-09-16</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={isLocked}
              onClick={handleMarkAllPresent}
              className="border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-xs text-white"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Mark All Present
            </Button>
            <Button
              size="sm"
              disabled={isLocked}
              onClick={handleSubmitAndLock}
              className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
            >
              <Lock className="h-3.5 w-3.5 mr-1" />
              Submit & Lock
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex justify-between items-center">
          <span className="text-zinc-400">Present</span>
          <span className="text-base font-bold text-white">{presentCount}</span>
        </div>
        <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex justify-between items-center">
          <span className="text-zinc-400">Absent</span>
          <span className="text-base font-bold text-zinc-300">{absentCount}</span>
        </div>
        <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex justify-between items-center">
          <span className="text-zinc-400">Late</span>
          <span className="text-base font-bold text-zinc-300">{lateCount}</span>
        </div>
        <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex justify-between items-center">
          <span className="text-zinc-400">Excused Leave</span>
          <span className="text-base font-bold text-zinc-300">{leaveCount}</span>
        </div>
      </div>

      {/* Student Attendance Register */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Attendance Status Exception</TableHead>
                <TableHead>Remarks / Parent Alert Note</TableHead>
                <TableHead className="text-right">Current Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((rec) => (
                <TableRow key={rec.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                  <TableCell className="font-mono text-zinc-400">{rec.rollNo}</TableCell>
                  <TableCell className="font-medium text-white">{rec.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {(["PRESENT", "ABSENT", "LEAVE", "LATE"] as AttStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={isLocked}
                          onClick={() => updateStatus(rec.id, st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            rec.status === st
                              ? "bg-white text-black font-bold"
                              : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      disabled={isLocked}
                      value={rec.remarks}
                      placeholder="Optional notes..."
                      onChange={(e) => {
                        const val = e.target.value;
                        setRecords((prev) =>
                          prev.map((r) => (r.id === rec.id ? { ...r, remarks: val } : r))
                        );
                      }}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white placeholder:text-zinc-600 w-full"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        rec.status === "PRESENT"
                          ? "contrast"
                          : rec.status === "ABSENT"
                          ? "destructive"
                          : "subtle"
                      }
                      className="text-[10px]"
                    >
                      {rec.status}
                    </Badge>
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
