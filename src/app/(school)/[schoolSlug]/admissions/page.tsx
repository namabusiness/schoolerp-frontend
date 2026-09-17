"use client";

import * as React from "react";
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
  FileCheck2,
  Eye,
  Upload,
  User,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { erpApi } from "@/lib/api";
import { NewAdmissionDialog } from "@/components/admissions/new-admission-dialog";
import { DocumentVaultModal } from "@/components/admissions/document-vault-modal";
import { MarksheetViewModal } from "@/components/admissions/marksheet-view-modal";

const ENQUIRIES = [
  { id: "enq-1", studentName: "K. Saravanan", parentName: "S. Kandasamy", phone: "+91 98401 23456", grade: "Grade 11", status: "COUNSELLING", date: "2026-09-17" },
  { id: "enq-2", studentName: "Maya Patel", parentName: "Anita Patel", phone: "+91 98765 43210", grade: "Grade 10", status: "APPLIED", date: "2026-09-14" },
  { id: "enq-3", studentName: "R. Priyadarshini", parentName: "M. Ramanathan", phone: "+91 94440 12345", grade: "Grade 12", status: "ENQUIRY", date: "2026-09-12" },
];

const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    appNo: "APP-2026-088",
    studentName: "K. Saravanan",
    dob: "2010-06-15",
    gender: "Male",
    aadharNumber: "5482 9104 8821",
    studentPhotoUrl: null,
    fatherName: "S. Kandasamy",
    fatherPhone: "+91 98401 23456",
    motherName: "K. Meenakshi",
    motherPhone: "+91 98402 34567",
    parentName: "S. Kandasamy",
    parentPhone: "+91 98401 23456",
    targetGrade: "Grade 11",
    streamGroup: "Group 1: Biology + Mathematics (Bio-Maths)",
    tenthMarksData: JSON.stringify({
      regNo: "TN-SSLC-847291",
      tmrCode: "TMR/2026/04",
      year: "2026",
      board: "Tamil Nadu State Board (SSLC)",
      subjects: [
        { code: "001", name: "Language (Tamil)", max: 100, min: 35, theory: 96, practical: null, total: 96, result: "PASS" },
        { code: "002", name: "English", max: 100, min: 35, theory: 92, practical: null, total: 92, result: "PASS" },
        { code: "003", name: "Mathematics", max: 100, min: 35, theory: 98, practical: null, total: 98, result: "PASS" },
        { code: "004", name: "Science", max: 100, min: 35, theory: 72, practical: 25, total: 97, result: "PASS" },
        { code: "005", name: "Social Science", max: 100, min: 35, theory: 95, practical: null, total: 95, result: "PASS" },
      ],
      totalScore: 478,
      percentage: "95.6",
      result: "PASS",
    }),
    documentsData: JSON.stringify([
      { id: "d1", docType: "TRANSFER_CERT", title: "Transfer Certificate (TC)", filename: "Saravanan_TC.pdf", fileSize: "1.2 MB", uploadedAt: "2026-09-15", verificationStatus: "VERIFIED" },
      { id: "d2", docType: "MARKSHEET", title: "10th Public Exam Marksheet", filename: "Saravanan_TN_SSLC.pdf", fileSize: "2.4 MB", uploadedAt: "2026-09-15", verificationStatus: "VERIFIED" },
      { id: "d3", docType: "STUDENT_AADHAR", title: "Student Aadhar Card", filename: "Aadhar_548291048821.pdf", fileSize: "640 KB", uploadedAt: "2026-09-15", verificationStatus: "VERIFIED" },
    ]),
    status: "UNDER_REVIEW",
    interviewScore: 94,
    docsVerified: true,
  },
  {
    id: "app-102",
    appNo: "APP-2026-089",
    studentName: "R. Priyadarshini",
    dob: "2009-04-18",
    gender: "Female",
    aadharNumber: "8821 4452 1099",
    studentPhotoUrl: null,
    fatherName: "M. Ramanathan",
    fatherPhone: "+91 94440 12345",
    motherName: "R. Vasanthi",
    motherPhone: "+91 94440 54321",
    parentName: "M. Ramanathan",
    parentPhone: "+91 94440 12345",
    targetGrade: "Grade 12",
    streamGroup: "Group 2: Computer Science + Mathematics (CS-Maths)",
    tenthMarksData: JSON.stringify({
      regNo: "TN-SSLC-719283",
      year: "2025",
      subjects: [
        { code: "001", name: "Language (Tamil)", max: 100, min: 35, theory: 90, total: 90, result: "PASS" },
        { code: "002", name: "English", max: 100, min: 35, theory: 88, total: 88, result: "PASS" },
        { code: "003", name: "Mathematics", max: 100, min: 94, theory: 94, total: 94, result: "PASS" },
        { code: "004", name: "Science", max: 100, min: 35, theory: 68, practical: 25, total: 93, result: "PASS" },
        { code: "005", name: "Social Science", max: 100, min: 35, theory: 91, total: 91, result: "PASS" },
      ],
      totalScore: 456,
      percentage: "91.2",
      result: "PASS",
    }),
    eleventhMarksData: JSON.stringify({
      regNo: "TN-HSC-729104",
      groupName: "Group 2: Computer Science + Mathematics",
      subjects: [
        { code: "001", name: "Language (Tamil)", max: 100, min: 35, theory: 86, practical: 10, total: 96, result: "PASS" },
        { code: "002", name: "English", max: 100, min: 35, theory: 84, practical: 10, total: 94, result: "PASS" },
        { code: "103", name: "Physics", max: 100, min: 35, theory: 65, practical: 30, total: 95, result: "PASS" },
        { code: "104", name: "Chemistry", max: 100, min: 35, theory: 62, practical: 30, total: 92, result: "PASS" },
        { code: "107", name: "Computer Science", max: 100, min: 35, theory: 68, practical: 30, total: 98, result: "PASS" },
        { code: "106", name: "Mathematics", max: 100, min: 35, theory: 88, practical: 10, total: 98, result: "PASS" },
      ],
      totalScore: 573,
      maxScore: 600,
      percentage: "95.5",
      result: "PASS",
    }),
    documentsData: JSON.stringify([
      { id: "d1", docType: "TRANSFER_CERT", title: "Transfer Certificate (TC)", filename: "Priya_TC.pdf", fileSize: "1.1 MB", uploadedAt: "2026-09-14", verificationStatus: "VERIFIED" },
      { id: "d2", docType: "MARKSHEET", title: "11th Public Exam Marksheet", filename: "Priya_TN_HSC1.pdf", fileSize: "2.0 MB", uploadedAt: "2026-09-14", verificationStatus: "VERIFIED" },
      { id: "d3", docType: "STUDENT_AADHAR", title: "Student Aadhar Card", filename: "Aadhar_882144521099.pdf", fileSize: "720 KB", uploadedAt: "2026-09-14", verificationStatus: "VERIFIED" },
    ]),
    status: "APPROVED",
    interviewScore: 96,
    docsVerified: true,
  },
  {
    id: "app-103",
    appNo: "APP-2026-090",
    studentName: "Maya Patel",
    dob: "2010-09-22",
    gender: "Female",
    aadharNumber: "7712 9001 3345",
    studentPhotoUrl: null,
    fatherName: "Anita Patel",
    fatherPhone: "+91 98765 43210",
    motherName: null,
    motherPhone: null,
    parentName: "Anita Patel",
    parentPhone: "+91 98765 43210",
    targetGrade: "Grade 10",
    streamGroup: null,
    status: "UNDER_REVIEW",
    interviewScore: 88,
    docsVerified: false,
    documentsData: "[]",
  },
];

export default function AdmissionsPage() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  const [applications, setApplications] = React.useState(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = React.useState<any | null>(null);

  // Modals state
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = React.useState(false);
  const [isDocumentVaultOpen, setIsDocumentVaultOpen] = React.useState(false);
  const [isMarksheetOpen, setIsMarksheetOpen] = React.useState(false);
  const [vaultCandidate, setVaultCandidate] = React.useState<any | null>(null);
  const [marksheetCandidate, setMarksheetCandidate] = React.useState<any | null>(null);

  // Enrollment fields
  const [isEnrollOpen, setIsEnrollOpen] = React.useState(false);
  const [rollNumber, setRollNumber] = React.useState("11-A-04");
  const [enrolledSuccess, setEnrolledSuccess] = React.useState<string | null>(null);

  // Try fetching real API applications on mount
  React.useEffect(() => {
    erpApi.getApplications()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with rich demo fields
          setApplications(data);
        }
      })
      .catch(() => {
        // use initial seed state
      });
  }, [schoolSlug]);

  const handleAdmissionCreated = (newApp: any) => {
    setApplications((prev) => [newApp, ...prev]);
    // Immediately open document vault for this newly registered student
    setVaultCandidate(newApp);
    setIsDocumentVaultOpen(true);
  };

  const handleDocumentsSaved = (applicationId: string, docs: any[]) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              documentsData: JSON.stringify(docs),
              docsVerified: docs.length >= 3,
            }
          : app
      )
    );
  };

  const handleEnrollStudent = async (appId: string) => {
    const candidate = applications.find((a) => a.id === appId);
    try {
      await erpApi.decideAdmission(appId, "APPROVED", {
        classId: candidate?.targetGrade || "Grade 11",
        sectionId: "Section A",
        academicYearId: "2026-2027",
        rollNumber,
      }).catch(() => {});
    } finally {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: "ENROLLED" } : a))
      );
      setEnrolledSuccess(candidate?.studentName || "Student");
      setIsEnrollOpen(false);
      setTimeout(() => setEnrolledSuccess(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Admissions Pipeline & Compliance
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            FLOW #9: REGISTRATION → TAMIL NADU MARKSHEETS → DOCUMENT VAULT → INTERVIEW → ENROLLMENT
          </p>
        </div>

        <div className="flex items-center gap-2">
          {enrolledSuccess && (
            <Badge variant="contrast" className="text-xs gap-1 py-1.5 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled: {enrolledSuccess}
            </Badge>
          )}

          <Button
            onClick={() => setIsNewAdmissionOpen(true)}
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold h-9 px-4 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Admission
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="bg-zinc-100 border border-zinc-200">
          <TabsTrigger
            value="applications"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm"
          >
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            Admission Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger
            value="vault"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm"
          >
            <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
            Document Vault & TC Compliance
          </TabsTrigger>
          <TabsTrigger
            value="enquiries"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm"
          >
            <UserCheck className="h-3.5 w-3.5 mr-1.5" />
            Inbound Enquiries & Counselling ({ENQUIRIES.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Applications */}
        <TabsContent value="applications" className="space-y-4 pt-3">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50/50">
                    <TableHead>Candidate & Aadhar Proof</TableHead>
                    <TableHead>Applying Grade & Stream</TableHead>
                    <TableHead>Parents / Phone</TableHead>
                    <TableHead>Public Exam Marksheet</TableHead>
                    <TableHead>Document Vault</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => {
                    const hasMarks = app.tenthMarksData || app.eleventhMarksData;
                    let docsCount = 0;
                    try {
                      if (app.documentsData) {
                        const parsed = typeof app.documentsData === "string" ? JSON.parse(app.documentsData) : app.documentsData;
                        if (Array.isArray(parsed)) docsCount = parsed.length;
                      }
                    } catch {}

                    return (
                      <TableRow key={app.id} className="border-zinc-200 text-xs hover:bg-zinc-50/80">
                        {/* Candidate with Photo Avatar */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-full border border-zinc-300 overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0">
                              {app.studentPhotoUrl ? (
                                <img
                                  src={app.studentPhotoUrl}
                                  alt={app.studentName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-zinc-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-950 text-xs flex items-center gap-1.5">
                                {app.studentName}
                                {app.gender && (
                                  <span className="text-[10px] text-zinc-400 font-normal">({app.gender[0]})</span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                UIDAI: {app.aadharNumber || "Pending"} • {app.appNo || (app as any).applicationNo}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Target Grade & Stream */}
                        <TableCell>
                          <div className="font-semibold text-zinc-900">{app.targetGrade}</div>
                          {app.streamGroup ? (
                            <div className="text-[10px] text-zinc-600 font-mono mt-0.5 max-w-[200px] truncate" title={app.streamGroup}>
                              {app.streamGroup.split(":")[1]?.trim() || app.streamGroup}
                            </div>
                          ) : (
                            <div className="text-[10px] text-zinc-400 font-mono">General Curriculum</div>
                          )}
                        </TableCell>

                        {/* Parent Details */}
                        <TableCell>
                          <div className="text-zinc-800 font-medium">{app.fatherName || app.parentName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{app.fatherPhone || app.parentPhone}</div>
                        </TableCell>

                        {/* Tamil Nadu Marksheet Button */}
                        <TableCell>
                          {hasMarks ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setMarksheetCandidate(app);
                                setIsMarksheetOpen(true);
                              }}
                              className="h-7 text-xs border-zinc-200 hover:bg-zinc-100 gap-1 font-mono"
                            >
                              <Award className="h-3.5 w-3.5 text-zinc-700" />
                              View TN Marksheet
                            </Button>
                          ) : (
                            <span className="text-zinc-400 text-[11px] font-mono">Standard Grade Entry</span>
                          )}
                        </TableCell>

                        {/* Document Vault Status */}
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setVaultCandidate(app);
                              setIsDocumentVaultOpen(true);
                            }}
                            className="h-7 text-xs hover:bg-zinc-100 gap-1.5 p-1"
                          >
                            <Badge
                              variant={docsCount >= 3 ? "contrast" : docsCount > 0 ? "subtle" : "outline"}
                              className="text-[10px] py-0 px-2 font-mono"
                            >
                              <FileCheck2 className="h-3 w-3 mr-1" />
                              {docsCount > 0 ? `${docsCount} Uploaded` : "Upload TC/Aadhar"}
                            </Badge>
                          </Button>
                        </TableCell>

                        {/* Status */}
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
                            className="text-[10px] font-mono"
                          >
                            {app.status}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right space-x-1.5">
                          {app.status === "APPROVED" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedApp(app);
                                setIsEnrollOpen(true);
                              }}
                              className="h-7 text-xs bg-zinc-900 text-white hover:bg-zinc-800 font-semibold"
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
                              className="h-7 text-xs border-zinc-200 hover:bg-zinc-100"
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Document Vault Overview */}
        <TabsContent value="vault" className="space-y-4 pt-3">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-950">
                    Institutional Document Vault & Verification Queue
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Audit TC certificates, Tamil Nadu Board marksheets, and UIDAI Aadhar documents across all registered candidates.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-zinc-300 font-mono text-xs">
                  {applications.filter((a) => a.docsVerified).length} / {applications.length} Fully Compliant
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 bg-zinc-50/50">
                    <TableHead>Candidate</TableHead>
                    <TableHead>Target Grade</TableHead>
                    <TableHead>Transfer Certificate (TC)</TableHead>
                    <TableHead>Public Marksheet</TableHead>
                    <TableHead>Student Aadhar</TableHead>
                    <TableHead>Parent ID</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => {
                    let docs: any[] = [];
                    try {
                      if (app.documentsData) {
                        docs = typeof app.documentsData === "string" ? JSON.parse(app.documentsData) : app.documentsData;
                      }
                    } catch {}

                    const hasTC = docs.some((d) => d.docType === "TRANSFER_CERT");
                    const hasMark = docs.some((d) => d.docType === "MARKSHEET");
                    const hasAadhar = docs.some((d) => d.docType === "STUDENT_AADHAR");
                    const hasParent = docs.some((d) => d.docType === "PARENT_ID");

                    return (
                      <TableRow key={app.id} className="border-zinc-200 text-xs hover:bg-zinc-50">
                        <TableCell>
                          <div className="font-semibold text-zinc-950">{app.studentName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">UIDAI: {app.aadharNumber || "Pending"}</div>
                        </TableCell>
                        <TableCell className="font-mono">{app.targetGrade}</TableCell>
                        <TableCell>
                          <Badge variant={hasTC ? "contrast" : "outline"} className="text-[10px]">
                            {hasTC ? "VERIFIED" : "PENDING"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={hasMark ? "contrast" : "outline"} className="text-[10px]">
                            {hasMark ? "VERIFIED" : "PENDING"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={hasAadhar ? "contrast" : "outline"} className="text-[10px]">
                            {hasAadhar ? "VERIFIED" : "PENDING"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={hasParent ? "contrast" : "outline"} className="text-[10px]">
                            {hasParent ? "VERIFIED" : "PENDING"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setVaultCandidate(app);
                              setIsDocumentVaultOpen(true);
                            }}
                            className="h-7 text-xs border-zinc-200 hover:bg-zinc-100 font-medium"
                          >
                            <Upload className="h-3.5 w-3.5 mr-1.5" /> Manage Vault
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Enquiries */}
        <TabsContent value="enquiries" className="space-y-4 pt-3">
          <Card className="bg-white border-zinc-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 bg-zinc-50/50">
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
                    <TableRow key={enq.id} className="border-zinc-200 text-xs hover:bg-zinc-50">
                      <TableCell className="font-semibold text-zinc-950">{enq.studentName}</TableCell>
                      <TableCell className="font-mono">{enq.grade}</TableCell>
                      <TableCell>{enq.parentName}</TableCell>
                      <TableCell className="font-mono text-zinc-600">{enq.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-300">
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

      {/* New Admission Multi-Step Dialog */}
      <NewAdmissionDialog
        isOpen={isNewAdmissionOpen}
        onClose={() => setIsNewAdmissionOpen(false)}
        schoolSlug={schoolSlug}
        onAdmissionCreated={handleAdmissionCreated}
      />

      {/* Document Vault Modal */}
      <DocumentVaultModal
        isOpen={isDocumentVaultOpen}
        onClose={() => setIsDocumentVaultOpen(false)}
        application={vaultCandidate}
        onDocumentsSaved={handleDocumentsSaved}
      />

      {/* Tamil Nadu Marksheet Viewer Modal */}
      <MarksheetViewModal
        isOpen={isMarksheetOpen}
        onClose={() => setIsMarksheetOpen(false)}
        application={marksheetCandidate}
      />

      {/* Finalize Enrollment Wizard Dialog */}
      {selectedApp && (
        <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
          <DialogContent className="max-w-md bg-white border-zinc-200 text-zinc-950 p-6">
            <DialogHeader className="border-b border-zinc-100 pb-3">
              <DialogTitle className="text-base font-bold text-zinc-950">Issue Admission & Generate Profile</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Admitting {selectedApp.studentName} into {selectedApp.targetGrade}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Student Name:</span>
                  <span className="font-semibold text-zinc-950">{selectedApp.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Allocated Class:</span>
                  <span className="text-zinc-900 font-medium">{selectedApp.targetGrade} - Section A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Aadhar Verified:</span>
                  <span className="font-mono text-zinc-800">{selectedApp.aadharNumber || "Verified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Academic Year:</span>
                  <span className="text-zinc-900 font-mono">2026-2027</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-700 font-medium">Assign Class Roll Number</Label>
                <Input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="bg-white border-zinc-300 text-zinc-950 font-mono h-8 text-xs"
                />
              </div>

              <div className="space-y-1 text-zinc-500 text-[11px] pt-1">
                <div>• Automatic generation of unique Admission Number (ADM-2026-XXXX)</div>
                <div>• Creation of Father & Mother linked guardian profiles with photos</div>
                <div>• Archival of Tamil Nadu Marksheet and TC in Student 360 Vault</div>
                <div>• Issuance of initial Term Fee demand invoice</div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-100 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEnrollOpen(false)}
                className="border-zinc-200 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleEnrollStudent(selectedApp.id)}
                className="bg-zinc-900 text-white hover:bg-zinc-800 font-semibold text-xs"
              >
                Confirm Admission & Enroll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
