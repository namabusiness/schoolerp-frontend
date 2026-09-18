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
  Loader2,
} from "lucide-react";
import { erpApi } from "@/lib/api";
import { NewAdmissionDialog } from "@/components/admissions/new-admission-dialog";
import { DocumentVaultModal } from "@/components/admissions/document-vault-modal";
import { MarksheetViewModal } from "@/components/admissions/marksheet-view-modal";

export default function AdmissionsPage() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  const [applications, setApplications] = React.useState<any[]>([]);
  const [enquiries, setEnquiries] = React.useState<any[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = React.useState(true);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = React.useState(true);
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

  // Fetch real API applications on mount
  React.useEffect(() => {
    let isMounted = true;
    setIsLoadingApplications(true);
    setIsLoadingEnquiries(true);

    erpApi
      .getApplications()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          // Keep only real database records, filter out mock IDs if any
          const realApps = data.filter(
            (app: any) => !app.id?.startsWith("app-10") && !app.id?.startsWith("demo-")
          );
          setApplications(realApps);
        } else {
          setApplications([]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch applications from API:", err);
        if (isMounted) setApplications([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingApplications(false);
      });

    erpApi
      .getEnquiries()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setEnquiries(data);
        } else {
          setEnquiries([]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch enquiries from API:", err);
        if (isMounted) setEnquiries([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingEnquiries(false);
      });

    return () => {
      isMounted = false;
    };
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

          <Link href={`/${schoolSlug}/admissions/new`}>
            <Button
              className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold h-9 px-4 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Admission Form
            </Button>
          </Link>
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
            Admission Applications ({isLoadingApplications ? "..." : applications.length})
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
            Inbound Enquiries & Counselling ({isLoadingEnquiries ? "..." : enquiries.length})
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
                  {isLoadingApplications ? (
                    // Elegant Skeleton Loading Rows while waiting for API data
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`app-skeleton-${i}`} className="border-zinc-200">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-full bg-zinc-100 animate-pulse shrink-0" />
                            <div className="space-y-1.5">
                              <div className="h-3.5 w-28 bg-zinc-100 rounded animate-pulse" />
                              <div className="h-2.5 w-36 bg-zinc-100 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-3.5 w-20 bg-zinc-100 rounded animate-pulse mb-1" />
                          <div className="h-2.5 w-32 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3.5 w-24 bg-zinc-100 rounded animate-pulse mb-1" />
                          <div className="h-2.5 w-20 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-7 w-28 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-24 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-7 w-20 bg-zinc-100 rounded animate-pulse ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : applications.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-zinc-500 text-xs font-mono"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <GraduationCap className="h-8 w-8 text-zinc-300" />
                          <div className="text-sm font-semibold text-zinc-900">
                            No admission applications found
                          </div>
                          <p className="text-xs text-zinc-500 max-w-sm">
                            Submit a new student registration to begin the admissions and verification workflow.
                          </p>
                          <Link href={`/${schoolSlug}/admissions/new`} className="mt-2">
                            <Button
                              size="sm"
                              className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" /> New Admission Form
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => {
                      const hasMarks = app.tenthMarksData || app.eleventhMarksData;
                      let docsCount = 0;
                      try {
                        if (app.documentsData) {
                          const parsed =
                            typeof app.documentsData === "string"
                              ? JSON.parse(app.documentsData)
                              : app.documentsData;
                          if (Array.isArray(parsed)) docsCount = parsed.length;
                        }
                      } catch {}

                      return (
                        <TableRow
                          key={app.id}
                          className="border-zinc-200 text-xs hover:bg-zinc-50/80"
                        >
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
                                    <span className="text-[10px] text-zinc-400 font-normal">
                                      ({app.gender[0]})
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono">
                                  UIDAI: {app.aadharNumber || "Pending"} •{" "}
                                  {app.appNo || app.applicationNo}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Target Grade & Stream */}
                          <TableCell>
                            <div className="font-semibold text-zinc-900">
                              {app.targetGrade}
                            </div>
                            {app.streamGroup ? (
                              <div
                                className="text-[10px] text-zinc-600 font-mono mt-0.5 max-w-[200px] truncate"
                                title={app.streamGroup}
                              >
                                {app.streamGroup.split(":")[1]?.trim() || app.streamGroup}
                              </div>
                            ) : (
                              <div className="text-[10px] text-zinc-400 font-mono">
                                General Curriculum
                              </div>
                            )}
                          </TableCell>

                          {/* Parent Details */}
                          <TableCell>
                            <div className="text-zinc-800 font-medium">
                              {app.fatherName || app.parentName}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {app.fatherPhone || app.parentPhone}
                            </div>
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
                              <span className="text-zinc-400 text-[11px] font-mono">
                                Standard Grade Entry
                              </span>
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
                                variant={
                                  docsCount >= 3
                                    ? "contrast"
                                    : docsCount > 0
                                    ? "subtle"
                                    : "outline"
                                }
                                className="text-[10px] py-0 px-2 font-mono"
                              >
                                <FileCheck2 className="h-3 w-3 mr-1" />
                                {docsCount > 0
                                  ? `${docsCount} Uploaded`
                                  : "Upload TC/Aadhar"}
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
                                    prev.map((a) =>
                                      a.id === app.id ? { ...a, status: "APPROVED" } : a
                                    )
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
                    })
                  )}
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
                  {isLoadingApplications ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`vault-skel-${i}`} className="border-zinc-200">
                        <TableCell>
                          <div className="h-3.5 w-28 bg-zinc-100 rounded animate-pulse mb-1" />
                          <div className="h-2.5 w-32 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3.5 w-16 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-7 w-24 bg-zinc-100 rounded animate-pulse ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : applications.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-zinc-500 text-xs font-mono"
                      >
                        <FileCheck2 className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-zinc-900">
                          No documents in vault
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          Candidate documents will be stored here upon admission registration.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => {
                      let docs: any[] = [];
                      try {
                        if (app.documentsData) {
                          docs =
                            typeof app.documentsData === "string"
                              ? JSON.parse(app.documentsData)
                              : app.documentsData;
                        }
                      } catch {}

                      const hasTC = docs.some((d) => d.docType === "TRANSFER_CERT");
                      const hasMark = docs.some((d) => d.docType === "MARKSHEET");
                      const hasAadhar = docs.some((d) => d.docType === "STUDENT_AADHAR");
                      const hasParent = docs.some((d) => d.docType === "PARENT_ID");

                      return (
                        <TableRow
                          key={app.id}
                          className="border-zinc-200 text-xs hover:bg-zinc-50"
                        >
                          <TableCell>
                            <div className="font-semibold text-zinc-950">
                              {app.studentName}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              UIDAI: {app.aadharNumber || "Pending"}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{app.targetGrade}</TableCell>
                          <TableCell>
                            <Badge
                              variant={hasTC ? "contrast" : "outline"}
                              className="text-[10px]"
                            >
                              {hasTC ? "VERIFIED" : "PENDING"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={hasMark ? "contrast" : "outline"}
                              className="text-[10px]"
                            >
                              {hasMark ? "VERIFIED" : "PENDING"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={hasAadhar ? "contrast" : "outline"}
                              className="text-[10px]"
                            >
                              {hasAadhar ? "VERIFIED" : "PENDING"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={hasParent ? "contrast" : "outline"}
                              className="text-[10px]"
                            >
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
                    })
                  )}
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
                  {isLoadingEnquiries ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`enq-skel-${i}`} className="border-zinc-200">
                        <TableCell>
                          <div className="h-3.5 w-28 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3.5 w-16 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3.5 w-24 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3.5 w-24 bg-zinc-100 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-3.5 w-20 bg-zinc-100 rounded animate-pulse ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : enquiries.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-zinc-500 text-xs font-mono"
                      >
                        <UserCheck className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-zinc-900">
                          No enquiries recorded
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          Inbound enquiries and counselling leads will appear here.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    enquiries.map((enq) => (
                      <TableRow
                        key={enq.id}
                        className="border-zinc-200 text-xs hover:bg-zinc-50"
                      >
                        <TableCell className="font-semibold text-zinc-950">
                          {enq.studentName}
                        </TableCell>
                        <TableCell className="font-mono">{enq.grade}</TableCell>
                        <TableCell>{enq.parentName}</TableCell>
                        <TableCell className="font-mono text-zinc-600">
                          {enq.phone}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-zinc-300"
                          >
                            {enq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-zinc-500">
                          {enq.date}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
              <DialogTitle className="text-base font-bold text-zinc-950">
                Issue Admission & Generate Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Admitting {selectedApp.studentName} into {selectedApp.targetGrade}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Student Name:</span>
                  <span className="font-semibold text-zinc-950">
                    {selectedApp.studentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Allocated Class:</span>
                  <span className="text-zinc-900 font-medium">
                    {selectedApp.targetGrade} - Section A
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Aadhar Verified:</span>
                  <span className="font-mono text-zinc-800">
                    {selectedApp.aadharNumber || "Verified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Academic Year:</span>
                  <span className="text-zinc-900 font-mono">2026-2027</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-700 font-medium">
                  Assign Class Roll Number
                </Label>
                <Input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="bg-white border-zinc-300 text-zinc-950 font-mono h-8 text-xs"
                />
              </div>

              <div className="space-y-1 text-zinc-500 text-[11px] pt-1">
                <div>
                  • Automatic generation of unique Admission Number (ADM-2026-XXXX)
                </div>
                <div>
                  • Creation of Father & Mother linked guardian profiles with photos
                </div>
                <div>
                  • Archival of Tamil Nadu Marksheet and TC in Student 360 Vault
                </div>
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
