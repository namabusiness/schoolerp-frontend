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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRightLeft, CheckCircle2, AlertTriangle, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

interface ClearanceStudent {
  id: string;
  name: string;
  rollNo: string;
  currentClass: string;
  examScore: number;
  attendanceRate: number;
  feeCleared: boolean;
  libraryCleared: boolean;
  transportCleared: boolean;
  decision: "PROMOTED" | "REPEAT" | "TRANSFER_EXIT";
}

const PROMOTION_ROSTER: ClearanceStudent[] = [
  { id: "st-1", name: "Alexander Chen", rollNo: "10-A-01", currentClass: "Grade 10", examScore: 93.3, attendanceRate: 98, feeCleared: true, libraryCleared: true, transportCleared: true, decision: "PROMOTED" },
  { id: "st-2", name: "Emma Watson", rollNo: "10-A-02", currentClass: "Grade 10", examScore: 89.2, attendanceRate: 94, feeCleared: true, libraryCleared: true, transportCleared: true, decision: "PROMOTED" },
  { id: "st-3", name: "Liam Smith", rollNo: "10-A-03", currentClass: "Grade 10", examScore: 75.8, attendanceRate: 91, feeCleared: false, libraryCleared: false, transportCleared: true, decision: "REPEAT" },
  { id: "st-4", name: "Julian Ross", rollNo: "10-A-07", currentClass: "Grade 10", examScore: 82.0, attendanceRate: 90, feeCleared: true, libraryCleared: true, transportCleared: true, decision: "TRANSFER_EXIT" },
];

export default function PromotionRolloverPage() {
  const [roster, setRoster] = React.useState<ClearanceStudent[]>(PROMOTION_ROSTER);
  const [selectedStudent, setSelectedStudent] = React.useState<ClearanceStudent | null>(null);
  const [rolloverCompleted, setRolloverCompleted] = React.useState(false);

  const updateDecision = (id: string, decision: "PROMOTED" | "REPEAT" | "TRANSFER_EXIT") => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, decision } : s))
    );
  };

  const handleExecuteRollover = () => {
    setRolloverCompleted(true);
    setTimeout(() => setRolloverCompleted(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Student Promotion & Rollover Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOWS #24 & #25: CLEARANCE AUDIT, PROMOTION, REPEAT, EXIT TC & ACADEMIC SESSION ROLLOVER
          </p>
        </div>

        <div className="flex items-center gap-2">
          {rolloverCompleted ? (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" /> ACADEMIC YEAR 2027-2028 ROLLED OVER & ACTIVE
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleExecuteRollover}
              className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 mr-1.5" />
              Execute Annual Rollover Wizard
            </Button>
          )}
        </div>
      </div>

      {/* Clearance Checklist Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Batch Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">{roster.length} Candidates</div>
            <p className="text-[11px] text-zinc-500 mt-1">Grade 10 Completing Class of 2026</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Promoted to Grade 11</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {roster.filter((s) => s.decision === "PROMOTED").length} Students
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">All clearances verified</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Repeating Grade 10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {roster.filter((s) => s.decision === "REPEAT").length} Students
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Academic / fee clearance pending</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Transfer Exit (TC)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {roster.filter((s) => s.decision === "TRANSFER_EXIT").length} Students
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Transfer Certificate auto-generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Promotion Roster Table */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white">Annual Clearance & Promotion Decisions</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Flow #24 verification matrix before advancing students to the next session
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Roll No & Name</TableHead>
                <TableHead>Final Exam %</TableHead>
                <TableHead>Annual Att. %</TableHead>
                <TableHead>Fee Clearance</TableHead>
                <TableHead>Library Clearance</TableHead>
                <TableHead>Transport</TableHead>
                <TableHead>Promotion Decision</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((st) => (
                <TableRow key={st.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-white">{st.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Roll: {st.rollNo}</div>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-200">{st.examScore}%</TableCell>
                  <TableCell className="font-mono text-zinc-200">{st.attendanceRate}%</TableCell>
                  <TableCell>
                    <Badge variant={st.feeCleared ? "contrast" : "destructive"} className="text-[10px]">
                      {st.feeCleared ? "CLEARED" : "DUES PENDING"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={st.libraryCleared ? "contrast" : "outline"} className="text-[10px]">
                      {st.libraryCleared ? "NO OVERDUES" : "BOOKS HELD"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="contrast" className="text-[10px]">CLEARED</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {(["PROMOTED", "REPEAT", "TRANSFER_EXIT"] as const).map((dec) => (
                        <button
                          key={dec}
                          type="button"
                          onClick={() => updateDecision(st.id, dec)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                            st.decision === dec
                              ? "bg-white text-black font-bold"
                              : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {dec === "TRANSFER_EXIT" ? "EXIT (TC)" : dec}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStudent(st)}
                      className="h-7 text-xs text-zinc-300 hover:text-white"
                    >
                      Audit Record
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Checklist */}
      {selectedStudent && (
        <Dialog open={Boolean(selectedStudent)} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white text-xs">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Year-End Clearance File</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Detailed audit verification for {selectedStudent.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Academics Grade:</span>
                  <span className="text-white font-bold">{selectedStudent.examScore}% (Eligible)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Fee Accounts Ledger:</span>
                  <span className="text-white font-bold">{selectedStudent.feeCleared ? "Zero Outstanding" : "$1,600.00 Dues"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Library Records:</span>
                  <span className="text-white font-bold">{selectedStudent.libraryCleared ? "All Copies Returned" : "1 Overdue Book"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Transport Account:</span>
                  <span className="text-white font-bold">Clear</span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400">
                {selectedStudent.decision === "TRANSFER_EXIT"
                  ? "Student is marked for transfer exit. Clicking execute will create official Transfer Certificate (TC), deactivate student enrollment, and archive academic transcripts."
                  : `Student decision is confirmed as ${selectedStudent.decision}. Advancing to Grade 11 Section A upon rollover confirmation.`}
              </div>
            </div>

            <DialogFooter>
              <Button size="sm" onClick={() => setSelectedStudent(null)} className="bg-white text-black hover:bg-zinc-200">
                Acknowledge & Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
