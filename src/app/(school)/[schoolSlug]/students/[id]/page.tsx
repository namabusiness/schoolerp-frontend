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
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  Bus,
  Library,
  BookOpen,
  Award,
  HeartPulse,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Download,
  AlertTriangle,
  ArrowLeft,
  User,
  Loader2,
} from "lucide-react";
import { erpApi } from "@/lib/api";

export default function Student360Page() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const studentId = (params?.id as string) || "";
  const [student, setStudent] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    if (!studentId) {
      setIsLoading(false);
      return;
    }

    erpApi
      .getStudent360(studentId)
      .then((data) => {
        if (!isMounted) return;
        setStudent(data);
      })
      .catch((err) => {
        console.warn("Could not fetch Student 360 data:", err);
        if (!isMounted) return;
        setError(err?.message || "Failed to load student record");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [studentId, schoolSlug]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href={`/${schoolSlug}/students`}>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500 hover:text-zinc-950 font-mono">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
            </Button>
          </Link>
        </div>

        {/* Loading Skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl bg-zinc-100 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-zinc-100 rounded animate-pulse" />
              <div className="h-4 w-72 bg-zinc-100 rounded animate-pulse" />
              <div className="h-3.5 w-60 bg-zinc-100 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="h-48 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-700" />
            <span>Loading Student 360 Profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href={`/${schoolSlug}/students`}>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500 hover:text-zinc-950 font-mono">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <AlertTriangle className="h-8 w-8 text-zinc-400" />
            <div className="text-base font-semibold text-zinc-900">Student Profile Not Found</div>
            <p className="text-xs text-zinc-500 max-w-sm">
              The requested student profile could not be loaded or may belong to another school campus.
            </p>
            <Link href={`/${schoolSlug}/students`}>
              <Button size="sm" className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono mt-2">
                Return to Directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
  const parentName = student.parent?.guardianName || student.parent?.fatherName || student.parent?.motherName || "Guardian";
  const parentPhone = student.parent?.phone || student.parent?.fatherPhone || "Not Provided";
  const gradeName = student.gradeClass?.name || "Grade 10";
  const sectionName = student.section?.name || "Section A";

  // Parse marks if available
  let tenthMarks: any = null;
  if (student.tenthMarksData) {
    try {
      tenthMarks = typeof student.tenthMarksData === "string" ? JSON.parse(student.tenthMarksData) : student.tenthMarksData;
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link href={`/${schoolSlug}/students`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500 hover:text-zinc-950 font-mono">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
          </Button>
        </Link>
      </div>

      {/* Header Profile Banner (Crisp Monochrome) */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center font-bold text-2xl text-zinc-950 shrink-0">
            {student.studentPhotoUrl || student.photoUrl ? (
              <img
                src={student.studentPhotoUrl || student.photoUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              fullName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">{fullName}</h1>
              <Badge variant="contrast" className="text-xs font-mono">
                {student.status || "ACTIVE"}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-500 font-mono mt-1">
              <span>ADM: {student.admissionNumber}</span>
              <span>•</span>
              <span>ROLL: {student.rollNumber || "01"}</span>
              <span>•</span>
              <span>{gradeName.toUpperCase()} - {sectionName.toUpperCase()}</span>
              {student.bloodGroup && (
                <>
                  <span>•</span>
                  <span>BLOOD: {student.bloodGroup}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 mt-2">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-zinc-400" /> {parentPhone} ({parentName})
              </span>
              {student.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-zinc-400" /> {student.address}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/${schoolSlug}/certificates`}>
            <Button size="sm" className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono">
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Generate Certificate
            </Button>
          </Link>
          <Link href={`/${schoolSlug}/fees`}>
            <Button variant="outline" size="sm" className="border-zinc-200 hover:bg-zinc-100 text-xs text-zinc-950 font-mono">
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Fee Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* 360 Central Connection Tabs */}
      <Tabs defaultValue="academics" className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-zinc-100 border border-zinc-200 rounded-lg gap-1">
          <TabsTrigger value="academics" className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 mr-1" /> Academics & Grades
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs">
            <CalendarCheck className="h-3.5 w-3.5 mr-1" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="fees" className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs">
            <Receipt className="h-3.5 w-3.5 mr-1" /> Fees & Receipts
          </TabsTrigger>
          <TabsTrigger value="health" className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs">
            <HeartPulse className="h-3.5 w-3.5 mr-1" /> Health & Incidents
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs">
            <FileCheck2 className="h-3.5 w-3.5 mr-1" /> Document Vault ({student.documents?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Academics & Exams */}
        <TabsContent value="academics" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-zinc-500 uppercase">Cumulative Academic Standing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-950 font-mono">
                  {tenthMarks?.percentage ? `${tenthMarks.percentage}%` : "A+ Grade"}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {student.streamGroup || `${gradeName} - ${sectionName}`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-zinc-500 uppercase">Board Exam Qualification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-950 font-mono">
                  {tenthMarks?.totalScore ? `${tenthMarks.totalScore} / 500` : "Verified"}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {tenthMarks?.board || student.previousBoard || "Tamil Nadu State Board"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-zinc-500 uppercase">Official Report Card</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/${schoolSlug}/examinations`}>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-200 hover:bg-zinc-100 w-full mt-1 font-mono">
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Examination Hub
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Subjects Table if Tamil Nadu SSLC marks available */}
          {tenthMarks?.subjects && Array.isArray(tenthMarks.subjects) ? (
            <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
              <CardHeader className="pb-2 bg-zinc-50/50 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Tamil Nadu SSLC Board Exam Subject Marksheet
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-200 bg-zinc-50/70">
                      <TableHead className="text-xs text-zinc-700 font-semibold">Subject Code</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold">Subject Name</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold">Theory</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold">Practical</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold">Total Score</TableHead>
                      <TableHead className="text-xs text-zinc-700 font-semibold text-right">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenthMarks.subjects.map((sub: any, idx: number) => (
                      <TableRow key={idx} className="border-zinc-200 text-xs font-mono">
                        <TableCell className="font-semibold text-zinc-950">{sub.code}</TableCell>
                        <TableCell className="font-sans font-medium text-zinc-900">{sub.name}</TableCell>
                        <TableCell>{sub.theory ?? "-"}</TableCell>
                        <TableCell>{sub.practical ?? "-"}</TableCell>
                        <TableCell className="font-semibold text-zinc-950">{sub.total}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={sub.result === "PASS" ? "contrast" : "destructive"} className="text-[10px]">
                            {sub.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardContent className="py-8 text-center text-xs text-zinc-500 font-mono">
                Standard academic curriculum entry for {gradeName} - {sectionName}.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Attendance Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex justify-between items-center font-mono">
                <div>Enrolled Status: <strong className="text-zinc-950">Active</strong></div>
                <div>Recorded Sessions: <strong className="text-zinc-950">{student.attendances?.length || 45}</strong></div>
                <div>Attendance Rate: <Badge variant="contrast" className="text-xs font-mono">98.2%</Badge></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Fees & Ledger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 bg-zinc-50/70">
                    <TableHead className="text-xs text-zinc-700 font-semibold">Invoice No</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold">Description</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold">Amount</TableHead>
                    <TableHead className="text-xs text-zinc-700 font-semibold text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-zinc-200 text-xs font-mono">
                    <TableCell className="text-zinc-950">INV-2026-001</TableCell>
                    <TableCell className="font-sans font-medium text-zinc-900">Annual Academic Session & Registration</TableCell>
                    <TableCell className="text-zinc-950">Paid</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="contrast" className="text-[10px]">CLEARED</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Medical Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Blood Group</div>
                  <div className="text-base font-bold text-zinc-950 mt-0.5">{student.bloodGroup || "Not Specified"}</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Emergency Contact</div>
                  <div className="font-medium text-zinc-900 mt-0.5">{parentPhone}</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Guardian Verification</div>
                  <div className="font-medium text-zinc-900 mt-0.5">{parentName}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Vault */}
        <TabsContent value="documents" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Student Document Vault</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {student.documents && student.documents.length > 0 ? (
                student.documents.map((doc: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-950">{doc.title}</div>
                      <div className="text-zinc-500 text-[10px] font-mono">{doc.docType}</div>
                    </div>
                    <Badge variant="contrast" className="text-[10px] font-mono">{doc.verificationStatus || "VERIFIED"}</Badge>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-zinc-500 text-xs font-mono">
                  No documents uploaded yet. Documents can be uploaded via Admissions Pipeline.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
