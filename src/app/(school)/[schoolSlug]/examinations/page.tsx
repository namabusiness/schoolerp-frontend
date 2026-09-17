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
import { Award, Plus, FileText, Download, CheckCircle2, Calculator } from "lucide-react";

const DEMO_EXAMS = [
  {
    id: "exam-midterm-2026",
    name: "Term 1 Midterm Formal Examinations",
    term: "Term 1 (Fall 2026)",
    startDate: "2026-10-12",
    endDate: "2026-10-22",
    status: "SCHEDULED",
    isPublished: true,
  },
  {
    id: "exam-unit-1",
    name: "STEM Unit 1 Diagnostic Assessments",
    term: "Term 1 (Fall 2026)",
    startDate: "2026-09-05",
    endDate: "2026-09-09",
    status: "EVALUATED",
    isPublished: true,
  },
];

const GRADE_10_MARKS_ENTRY = [
  { id: "st-1", rollNo: "10-A-01", name: "Alexander Chen", math: 96, physics: 94, chem: 91, english: 92, total: 373, pct: 93.3, grade: "A+" },
  { id: "st-2", rollNo: "10-A-02", name: "Emma Watson", math: 88, physics: 85, chem: 89, english: 95, total: 357, pct: 89.2, grade: "A" },
  { id: "st-3", rollNo: "10-A-03", name: "Liam Smith", math: 74, physics: 78, chem: 71, english: 80, total: 303, pct: 75.8, grade: "B" },
  { id: "st-4", rollNo: "10-A-04", name: "Olivia Taylor", math: 98, physics: 96, chem: 95, english: 97, total: 386, pct: 96.5, grade: "A+" },
];

export default function ExaminationsPage() {
  const [selectedStudentRC, setSelectedStudentRC] = React.useState<any | null>(null);
  const [approvedReportCards, setApprovedReportCards] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Examination & Results Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #14: EXAM SCHEDULES → MARKS ENTRY → AUTOMATIC GPA/GRADE CALCULATION → REPORT CARDS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {approvedReportCards ? (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" /> RESULTS APPROVED & PUBLISHED
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => setApprovedReportCards(true)}
              className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
            >
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Approve & Publish Results
            </Button>
          )}
        </div>
      </div>

      {/* Exam Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_EXAMS.map((exam) => (
          <Card key={exam.id} className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">{exam.name}</CardTitle>
                <Badge variant={exam.status === "EVALUATED" ? "contrast" : "outline"} className="text-[10px]">
                  {exam.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-zinc-400">{exam.term}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
                <span>Window: {exam.startDate} to {exam.endDate}</span>
                <span>Schedule Published: Yes</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teacher Marks Entry & GPA Matrix */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white">Marks Entry & Automatic Grade Computation</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Grade 10 Section A • Diagnostic Assessment Matrix (Max 100 / subject)
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <Calculator className="h-3.5 w-3.5" /> AUTO CALCULATING GPA & TOTAL
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Math</TableHead>
                <TableHead className="text-center">Physics</TableHead>
                <TableHead className="text-center">Chemistry</TableHead>
                <TableHead className="text-center">English</TableHead>
                <TableHead className="text-center">Total / 400</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-right">Report Card</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GRADE_10_MARKS_ENTRY.map((st) => (
                <TableRow key={st.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                  <TableCell className="text-zinc-400">{st.rollNo}</TableCell>
                  <TableCell className="font-sans font-medium text-white">{st.name}</TableCell>
                  <TableCell className="text-center text-white">{st.math}</TableCell>
                  <TableCell className="text-center text-white">{st.physics}</TableCell>
                  <TableCell className="text-center text-white">{st.chem}</TableCell>
                  <TableCell className="text-center text-white">{st.english}</TableCell>
                  <TableCell className="text-center font-bold text-white">{st.total}</TableCell>
                  <TableCell className="text-center text-zinc-300">{st.pct}%</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="contrast" className="text-[10px]">{st.grade}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStudentRC(st)}
                      className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                    >
                      <FileText className="h-3 w-3 mr-1" /> View PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Printable Report Card Modal (Monochrome) */}
      {selectedStudentRC && (
        <Dialog open={Boolean(selectedStudentRC)} onOpenChange={() => setSelectedStudentRC(null)}>
          <DialogContent className="max-w-xl bg-white text-black border-zinc-300">
            <DialogHeader className="border-b border-zinc-200 pb-4 text-center sm:text-center">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">Official Report of Progress</div>
              <DialogTitle className="text-lg font-bold text-black uppercase tracking-wide">
                Greenwood High International
              </DialogTitle>
              <div className="text-xs text-zinc-600 font-serif">42 Academic Boulevard, Metro West • Academic Year 2026-2027</div>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="grid grid-cols-2 gap-2 border border-zinc-200 p-3 bg-zinc-50">
                <div><strong>Student Name:</strong> {selectedStudentRC.name}</div>
                <div><strong>Roll Number:</strong> {selectedStudentRC.rollNo}</div>
                <div><strong>Class & Section:</strong> Grade 10 - Section A</div>
                <div><strong>Admission Number:</strong> ADM-2026-1001</div>
              </div>

              <Table className="border border-zinc-300">
                <TableHeader>
                  <TableRow className="border-zinc-300 bg-zinc-100">
                    <TableHead className="text-black font-bold">Academic Course</TableHead>
                    <TableHead className="text-center text-black font-bold">Max</TableHead>
                    <TableHead className="text-center text-black font-bold">Marks Scored</TableHead>
                    <TableHead className="text-center text-black font-bold">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-zinc-200 text-xs">
                    <TableCell>Advanced Mathematics</TableCell>
                    <TableCell className="text-center">100</TableCell>
                    <TableCell className="text-center font-bold">{selectedStudentRC.math}</TableCell>
                    <TableCell className="text-center font-bold">A+</TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-200 text-xs">
                    <TableCell>Physics & Lab Mechanics</TableCell>
                    <TableCell className="text-center">100</TableCell>
                    <TableCell className="text-center font-bold">{selectedStudentRC.physics}</TableCell>
                    <TableCell className="text-center font-bold">A</TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-200 text-xs">
                    <TableCell>Organic & Physical Chemistry</TableCell>
                    <TableCell className="text-center">100</TableCell>
                    <TableCell className="text-center font-bold">{selectedStudentRC.chem}</TableCell>
                    <TableCell className="text-center font-bold">A</TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-200 text-xs">
                    <TableCell>English Literature</TableCell>
                    <TableCell className="text-center">100</TableCell>
                    <TableCell className="text-center font-bold">{selectedStudentRC.english}</TableCell>
                    <TableCell className="text-center font-bold">A+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex justify-between border-t border-zinc-200 pt-3 text-xs">
                <div>Aggregate Total: <strong>{selectedStudentRC.total} / 400</strong></div>
                <div>Percentage: <strong>{selectedStudentRC.pct}%</strong></div>
                <div>Standing: <strong>{selectedStudentRC.grade} (Distinction)</strong></div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-3 flex justify-between sm:justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono">SEAL & SIGNATURE VERIFIED</span>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="bg-black text-white hover:bg-zinc-800 text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Print Official Report Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
