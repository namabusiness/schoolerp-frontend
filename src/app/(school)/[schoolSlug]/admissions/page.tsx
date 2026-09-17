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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  UserCheck,
  Award,
} from "lucide-react";
import { erpApi } from "@/lib/api";

const ENQUIRIES = [
  { id: "enq-1", studentName: "Liam O'Connor", parentName: "Sean O'Connor", phone: "+1 555-234-5678", grade: "Grade 9", status: "COUNSELLING", date: "2026-09-15" },
  { id: "enq-2", studentName: "Maya Patel", parentName: "Anita Patel", phone: "+1 555-876-5432", grade: "Grade 10", status: "APPLIED", date: "2026-09-14" },
  { id: "enq-3", studentName: "Lucas Silva", parentName: "Mateo Silva", phone: "+1 555-345-6789", grade: "Grade 11", status: "ENQUIRY", date: "2026-09-12" },
];

const APPLICATIONS = [
  {
    id: "app-101",
    appNo: "APP-2026-088",
    studentName: "Maya Patel",
    dob: "2010-09-22",
    gender: "Female",
    parentName: "Anita Patel",
    parentPhone: "+1 555-876-5432",
    targetGrade: "Grade 10",
    status: "UNDER_REVIEW",
    interviewScore: 92,
    docsVerified: true,
  },
  {
    id: "app-102",
    appNo: "APP-2026-089",
    studentName: "Ethan Zhang",
    dob: "2011-03-11",
    gender: "Male",
    parentName: "Wei Zhang",
    parentPhone: "+1 555-901-2345",
    targetGrade: "Grade 9",
    status: "APPROVED",
    interviewScore: 88,
    docsVerified: true,
  },
  {
    id: "app-103",
    appNo: "APP-2026-090",
    studentName: "Sophia Rossi",
    dob: "2010-11-05",
    gender: "Female",
    parentName: "Elena Rossi",
    parentPhone: "+1 555-456-7890",
    targetGrade: "Grade 10",
    status: "WAITLISTED",
    interviewScore: 74,
    docsVerified: true,
  },
];

export default function AdmissionsPage() {
  const [applications, setApplications] = React.useState(APPLICATIONS);
  const [selectedApp, setSelectedApp] = React.useState<any | null>(null);
  const [isEnrollOpen, setIsEnrollOpen] = React.useState(false);

  // Enrollment fields
  const [rollNumber, setRollNumber] = React.useState("10-A-02");
  const [enrolledSuccess, setEnrolledSuccess] = React.useState(false);

  const handleEnrollStudent = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "ENROLLED" } : a))
    );
    setEnrolledSuccess(true);
    setIsEnrollOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Complete Admission Pipeline</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #9: ENQUIRY → COUNSELLING → APPLICATION → DOCS → INTERVIEW → DECISION → ACTIVE ENROLLMENT
          </p>
        </div>

        {enrolledSuccess && (
          <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" /> Student Enrolled: ADM-2026-1002
          </Badge>
        )}
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="applications" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" /> Admission Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="enquiries" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <UserCheck className="h-3.5 w-3.5 mr-1.5" /> Inbound Enquiries & Counselling
          </TabsTrigger>
        </TabsList>

        {/* Applications */}
        <TabsContent value="applications" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>App No & Candidate</TableHead>
                    <TableHead>Target Grade</TableHead>
                    <TableHead>Parent / Contact</TableHead>
                    <TableHead>Interview Score</TableHead>
                    <TableHead>Document Vault</TableHead>
                    <TableHead>Decision Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell>
                        <div className="font-semibold text-white">{app.studentName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{app.appNo} • {app.gender}</div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{app.targetGrade}</TableCell>
                      <TableCell>
                        <div className="text-zinc-300">{app.parentName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{app.parentPhone}</div>
                      </TableCell>
                      <TableCell className="font-mono text-zinc-200">
                        {app.interviewScore ? `${app.interviewScore}%` : "Pending"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-700">
                          {app.docsVerified ? "Verified (Birth/ID/TC)" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            app.status === "ENROLLED"
                              ? "contrast"
                              : app.status === "APPROVED"
                              ? "subtle"
                              : app.status === "WAITLISTED"
                              ? "outline"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {app.status === "APPROVED" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsEnrollOpen(true);
                            }}
                            className="h-7 text-xs bg-white text-black hover:bg-zinc-200 font-semibold"
                          >
                            Finalize Enrollment
                          </Button>
                        )}
                        {app.status === "UNDER_REVIEW" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setApplications((prev) =>
                                prev.map((a) => (a.id === app.id ? { ...a, status: "APPROVED" } : a))
                              );
                            }}
                            className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                          >
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enquiries */}
        <TabsContent value="enquiries" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Prospective Student</TableHead>
                    <TableHead>Target Grade</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Contact Phone</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ENQUIRIES.map((enq) => (
                    <TableRow key={enq.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell className="font-medium text-white">{enq.studentName}</TableCell>
                      <TableCell>{enq.grade}</TableCell>
                      <TableCell>{enq.parentName}</TableCell>
                      <TableCell className="font-mono">{enq.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-700">
                          {enq.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-zinc-500">{enq.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enrollment Wizard Dialog */}
      {selectedApp && (
        <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Issue Admission & Generate Profile</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Admitting {selectedApp.studentName} into {selectedApp.targetGrade}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Student Name:</span>
                  <span className="font-semibold text-white">{selectedApp.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Allocated Class:</span>
                  <span className="text-white">{selectedApp.targetGrade} - Section A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Academic Year:</span>
                  <span className="text-white">2026-2027</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Assign Class Roll Number</Label>
                <Input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div>• Automatic generation of unique Admission Number (ADM-2026-XXXX)</div>
                <div>• Auto-linking of parent guardian contact account</div>
                <div>• Creation of initial Term Fee Invoice demand</div>
                <div>• Activation of Student 360 Central Record Hub</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsEnrollOpen(false)} className="border-zinc-800">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleEnrollStudent(selectedApp.id)}
                className="bg-white text-black hover:bg-zinc-200 font-semibold"
              >
                Confirm Admission & Activate Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
