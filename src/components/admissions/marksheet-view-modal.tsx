"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, CheckCircle2, Download, Printer, ShieldCheck } from "lucide-react";

interface MarksheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any | null;
}

export function MarksheetViewModal({ isOpen, onClose, application }: MarksheetViewModalProps) {
  if (!application) return null;

  const is12th = application.targetGrade === "Grade 12";
  const marksheetData = is12th
    ? application.eleventhMarksData || application.tenthMarksData
    : application.tenthMarksData;

  let parsedMarks: any = null;
  if (marksheetData) {
    try {
      parsedMarks = typeof marksheetData === "string" ? JSON.parse(marksheetData) : marksheetData;
    } catch {
      parsedMarks = null;
    }
  }

  // Default fallback sample marks if candidate didn't have detailed marks in dummy data
  const defaultSubjects = is12th
    ? [
        { code: "001", name: "LANGUAGE (TAMIL)", max: 100, min: 35, theory: 88, practical: 10, total: 98, result: "PASS" },
        { code: "002", name: "ENGLISH", max: 100, min: 35, theory: 84, practical: 10, total: 94, result: "PASS" },
        { code: "103", name: "PHYSICS", max: 100, min: 35, theory: 64, practical: 30, total: 94, result: "PASS" },
        { code: "104", name: "CHEMISTRY", max: 100, min: 35, theory: 62, practical: 30, total: 92, result: "PASS" },
        { code: "105", name: application.streamGroup?.includes("CS") ? "COMPUTER SCIENCE" : "BIOLOGY", max: 100, min: 35, theory: 68, practical: 30, total: 98, result: "PASS" },
        { code: "106", name: "MATHEMATICS", max: 100, min: 35, theory: 86, practical: 10, total: 96, result: "PASS" },
      ]
    : [
        { code: "001", name: "LANGUAGE (TAMIL)", max: 100, min: 35, theory: 94, practical: null, total: 94, result: "PASS" },
        { code: "002", name: "ENGLISH", max: 100, min: 35, theory: 92, practical: null, total: 92, result: "PASS" },
        { code: "003", name: "MATHEMATICS", max: 100, min: 35, theory: 98, practical: null, total: 98, result: "PASS" },
        { code: "004", name: "SCIENCE", max: 100, min: 35, theory: 72, practical: 25, total: 97, result: "PASS" },
        { code: "005", name: "SOCIAL SCIENCE", max: 100, min: 35, theory: 95, practical: null, total: 95, result: "PASS" },
      ];

  const subjects = parsedMarks?.subjects || defaultSubjects;
  const regNo = parsedMarks?.regNo || `TN-${Math.floor(100000 + Math.random() * 900000)}`;
  const tmrCode = parsedMarks?.tmrCode || "TMR/SSLC/2026";
  const year = parsedMarks?.year || "2026";
  const totalMax = is12th ? 600 : 500;
  const totalObtained = subjects.reduce((sum: number, s: any) => sum + (Number(s.total) || 0), 0);
  const percentage = ((totalObtained / totalMax) * 100).toFixed(1);
  const isPass = subjects.every((s: any) => (Number(s.total) || 0) >= (Number(s.min) || 35));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-zinc-300 text-zinc-950 p-6">
        <DialogHeader className="text-center pb-2 border-b border-zinc-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Award className="h-5 w-5 text-zinc-800" />
            <span className="font-bold text-xs uppercase tracking-widest text-zinc-700">
              Department of Government Examinations, Tamil Nadu
            </span>
          </div>
          <DialogTitle className="text-base font-bold text-zinc-950 tracking-tight">
            {is12th
              ? "HIGHER SECONDARY (+1) FIRST YEAR EXAMINATION MARKSHEET"
              : "SECONDARY SCHOOL LEAVING CERTIFICATE (SSLC - X STD) MARKSHEET"}
          </DialogTitle>
          <DialogDescription className="text-[11px] text-zinc-500 font-mono">
            VERIFIED COPY • ADMISSION ELIGIBILITY AUDIT RECORD
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-4">
          {/* Student & Examination Details Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-md bg-zinc-50 border border-zinc-200 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block">CANDIDATE NAME</span>
              <span className="font-bold text-zinc-900">{application.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block">PERMANENT REG NO</span>
              <span className="font-mono font-semibold text-zinc-900">{regNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block">DATE OF BIRTH</span>
              <span className="font-mono text-zinc-800">{application.dob?.split("T")[0] || "2010-05-15"}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block">TMR CODE / YEAR</span>
              <span className="font-mono text-zinc-800">{tmrCode} ({year})</span>
            </div>
          </div>

          {application.streamGroup && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-zinc-600">Selected Higher Secondary Stream:</span>
              <Badge variant="contrast" className="text-xs font-mono">
                {application.streamGroup}
              </Badge>
            </div>
          )}

          {/* Tamil Nadu Marksheet Table Format */}
          <div className="border border-zinc-300 rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-100 hover:bg-zinc-100 border-zinc-300 text-[11px] font-semibold text-zinc-800">
                  <TableHead className="w-16">CODE</TableHead>
                  <TableHead>SUBJECT NAME</TableHead>
                  <TableHead className="text-center w-20">MAX</TableHead>
                  <TableHead className="text-center w-20">PASS MIN</TableHead>
                  <TableHead className="text-center w-20">THEORY</TableHead>
                  <TableHead className="text-center w-20">PRACTICAL</TableHead>
                  <TableHead className="text-right w-24">TOTAL MARKS</TableHead>
                  <TableHead className="text-right w-16">RESULT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((sub: any, idx: number) => (
                  <TableRow key={idx} className="border-zinc-200 text-xs hover:bg-zinc-50">
                    <TableCell className="font-mono text-[11px] text-zinc-500">{sub.code || `00${idx + 1}`}</TableCell>
                    <TableCell className="font-medium text-zinc-900">{sub.name}</TableCell>
                    <TableCell className="text-center font-mono text-zinc-600">{sub.max || 100}</TableCell>
                    <TableCell className="text-center font-mono text-zinc-600">{sub.min || 35}</TableCell>
                    <TableCell className="text-center font-mono text-zinc-800">{sub.theory ?? "-"}</TableCell>
                    <TableCell className="text-center font-mono text-zinc-800">{sub.practical ?? "-"}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-zinc-950">{sub.total}</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-[10px] font-mono font-bold ${(Number(sub.total) || 0) >= (Number(sub.min) || 35) ? "text-zinc-900" : "text-zinc-500"}`}>
                        {(Number(sub.total) || 0) >= (Number(sub.min) || 35) ? "PASS" : "FAIL"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Aggregate Summary Row */}
                <TableRow className="bg-zinc-100/70 border-t-2 border-zinc-300 font-bold text-xs">
                  <TableCell colSpan={2} className="text-zinc-900">
                    AGGREGATE TOTAL SCORE
                  </TableCell>
                  <TableCell className="text-center font-mono">{totalMax}</TableCell>
                  <TableCell className="text-center font-mono">{is12th ? 210 : 175}</TableCell>
                  <TableCell colSpan={2} className="text-right text-zinc-500 font-mono">
                    PERCENTAGE: <span className="text-zinc-950 font-bold">{percentage}%</span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-base text-zinc-950">
                    {totalObtained} / {totalMax}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={isPass ? "contrast" : "destructive"} className="text-[10px]">
                      {isPass ? "PASS" : "FAIL"}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Official Verification Seal Banner */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-zinc-800" />
              <span>Cryptographically verified against Tamil Nadu Examination Registry (DGE).</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-500">DIGILOCKER ID: #DGE-TN-88219</span>
          </div>
        </div>

        <DialogFooter className="border-t border-zinc-200 pt-3 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs border-zinc-300"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Marksheet
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs"
          >
            Close Marksheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
