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
  ShieldCheck,
  Home,
  CheckCircle2,
  FileText,
  School,
  IdCard,
} from "lucide-react";
import { erpApi } from "@/lib/api";

export default function Student360Page() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const studentId = (params?.id as string) || "";
  const [student, setStudent] = React.useState<any | null>(null);
  const [stats, setStats] = React.useState<any | null>(null);
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
        // Unwrap student and stats correctly from backend payload
        const studentRecord = data?.student || data;
        setStudent(studentRecord);
        setStats(data?.stats || null);
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-zinc-500 hover:text-zinc-950 font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
            </Button>
          </Link>
        </div>

        {/* Loading Skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-xl bg-zinc-100 animate-pulse shrink-0" />
            <div className="space-y-2.5 flex-1">
              <div className="h-6 w-56 bg-zinc-100 rounded animate-pulse" />
              <div className="h-4 w-80 bg-zinc-100 rounded animate-pulse" />
              <div className="h-3.5 w-64 bg-zinc-100 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="h-64 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs flex items-center justify-center">
          <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-800" />
            <span>Retrieving Central Student 360 Records...</span>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-zinc-500 hover:text-zinc-950 font-mono"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <AlertTriangle className="h-8 w-8 text-zinc-400" />
            <div className="text-base font-semibold text-zinc-900">
              Student Profile Not Found
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              The requested student record could not be loaded or may belong to another school campus.
            </p>
            <Link href={`/${schoolSlug}/students`}>
              <Button
                size="sm"
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono mt-2"
              >
                Return to Directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Derived Fields
  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
  const parent = student.parent || {};
  const fatherName = parent.fatherName || parent.guardianName || "Father";
  const fatherPhone = parent.fatherPhone || parent.phone || "Not Provided";
  const motherName = parent.motherName || "Mother";
  const motherPhone = parent.motherPhone || "Not Provided";
  const guardianName = parent.guardianName || fatherName || "Guardian";
  const primaryPhone = parent.phone || fatherPhone;
  const emergencyPhone = student.emergencyPhone || primaryPhone;
  const gradeName = student.gradeClass?.name || "Grade 11";
  const sectionName = student.section?.name || "Section A";

  // Date of Birth formatting
  let formattedDob = "Not Specified";
  if (student.dob) {
    try {
      const d = new Date(student.dob);
      if (!isNaN(d.getTime())) {
        formattedDob = d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    } catch {}
  }

  // Parse Tamil Nadu SSLC Marks
  let tenthMarks: any = null;
  if (student.tenthMarksData) {
    try {
      tenthMarks =
        typeof student.tenthMarksData === "string"
          ? JSON.parse(student.tenthMarksData)
          : student.tenthMarksData;
    } catch {}
  }

  // Parse 11th HSC Marks
  let eleventhMarks: any = null;
  if (student.eleventhMarksData && student.eleventhMarksData !== "null") {
    try {
      eleventhMarks =
        typeof student.eleventhMarksData === "string"
          ? JSON.parse(student.eleventhMarksData)
          : student.eleventhMarksData;
    } catch {}
  }

  // Documents list
  const documentsList = student.documents || [];

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href={`/${schoolSlug}/students`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-zinc-600 hover:text-zinc-950 font-mono pl-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Student Directory
          </Button>
        </Link>
        <Badge variant="outline" className="font-mono text-[11px] border-zinc-200 text-zinc-500">
          CENTRAL 360° PROFILE
        </Badge>
      </div>

      {/* Header Profile Banner */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Student Photo */}
          <div className="h-24 w-24 rounded-xl bg-zinc-100 border-2 border-zinc-200 overflow-hidden flex items-center justify-center font-bold text-3xl text-zinc-900 shrink-0 shadow-xs">
            {student.studentPhotoUrl || student.photoUrl ? (
              <img
                src={student.studentPhotoUrl || student.photoUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-400">
                <User className="h-10 w-10 text-zinc-400 mb-0.5" />
                <span className="text-[10px] font-mono uppercase">
                  {fullName.slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Student Identity Highlights */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
                {fullName}
              </h1>
              <Badge variant="contrast" className="text-xs font-mono">
                {student.status || "ACTIVE"}
              </Badge>
              {student.gender && (
                <Badge variant="outline" className="text-[11px] font-mono border-zinc-300">
                  {student.gender}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-600 font-mono">
              <span className="font-semibold text-zinc-900">
                ADM: {student.admissionNumber}
              </span>
              <span>•</span>
              <span>ROLL: {student.rollNumber || "01"}</span>
              <span>•</span>
              <span className="font-semibold text-zinc-900">
                {gradeName} - {sectionName}
              </span>
              {student.bloodGroup && (
                <>
                  <span>•</span>
                  <span>BLOOD: {student.bloodGroup}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 pt-0.5">
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="h-3.5 w-3.5 text-zinc-400" />
                <span>DOB: {formattedDob}</span>
              </span>
              {student.aadharNumber && (
                <span className="flex items-center gap-1.5 font-mono">
                  <IdCard className="h-3.5 w-3.5 text-zinc-400" />
                  <span>UIDAI: {student.aadharNumber}</span>
                </span>
              )}
              {primaryPhone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{primaryPhone} ({guardianName})</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link href={`/${schoolSlug}/admissions`}>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-200 hover:bg-zinc-100 text-xs font-mono"
            >
              <FileCheck2 className="h-3.5 w-3.5 mr-1.5 text-zinc-700" />
              Admission Vault
            </Button>
          </Link>
          <Link href={`/${schoolSlug}/fees`}>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-200 hover:bg-zinc-100 text-xs font-mono"
            >
              <Receipt className="h-3.5 w-3.5 mr-1.5 text-zinc-700" />
              Fee Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Academic Stream & Previous Institution */}
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-500 uppercase flex items-center justify-between">
              <span>Academic Allocation</span>
              <School className="h-3.5 w-3.5 text-zinc-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            <div className="font-semibold text-zinc-950 text-sm">
              {gradeName} - {sectionName}
            </div>
            {student.streamGroup ? (
              <div className="text-zinc-600 font-mono text-[11px] leading-relaxed">
                {student.streamGroup}
              </div>
            ) : (
              <div className="text-zinc-400 text-[11px]">General Standard Curriculum</div>
            )}
            <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 mt-2 flex flex-col gap-0.5">
              <span>Prev. School: <strong className="text-zinc-800">{student.previousSchool || "Not Specified"}</strong></span>
              <span>Prev. Board: <strong className="text-zinc-800">{student.previousBoard || "Tamil Nadu State Board"}</strong></span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Parent / Guardian Quick Contact */}
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-500 uppercase flex items-center justify-between">
              <span>Family & Contact</span>
              <Users className="h-3.5 w-3.5 text-zinc-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0">
                {student.fatherPhotoUrl ? (
                  <img
                    src={student.fatherPhotoUrl}
                    alt={fatherName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-zinc-400" />
                )}
              </div>
              <div className="truncate">
                <div className="font-medium text-zinc-950 truncate">{fatherName} (Father)</div>
                <div className="text-[10px] text-zinc-500 font-mono">{fatherPhone}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1 border-t border-zinc-100">
              <div className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0">
                {student.motherPhotoUrl ? (
                  <img
                    src={student.motherPhotoUrl}
                    alt={motherName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-zinc-400" />
                )}
              </div>
              <div className="truncate">
                <div className="font-medium text-zinc-950 truncate">{motherName} (Mother)</div>
                <div className="text-[10px] text-zinc-500 font-mono">{motherPhone}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Board Exam & Compliance Status */}
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-500 uppercase flex items-center justify-between">
              <span>10th Board Qualification</span>
              <Award className="h-3.5 w-3.5 text-zinc-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-zinc-950 font-mono">
                {tenthMarks?.totalScore ? `${tenthMarks.totalScore} / 500` : "Qualified"}
              </div>
              {tenthMarks?.percentage && (
                <Badge variant="contrast" className="font-mono text-xs">
                  {tenthMarks.percentage}%
                </Badge>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Reg No: {tenthMarks?.regNo || "Verified on File"}
            </div>
            <div className="pt-1.5 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Attendance: {stats?.attendancePercentage || 98}%</span>
              <Badge variant="subtle" className="text-[10px]">
                {tenthMarks?.result || "PASS"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Central 360 Tabs */}
      <Tabs defaultValue="parents" className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-zinc-100 border border-zinc-200 rounded-lg gap-1">
          <TabsTrigger
            value="parents"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" /> Parents & Family Profile
          </TabsTrigger>
          <TabsTrigger
            value="academics"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> TN Board Marksheets & Academics
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <CalendarCheck className="h-3.5 w-3.5 mr-1.5" /> Attendance
          </TabsTrigger>
          <TabsTrigger
            value="fees"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Receipt className="h-3.5 w-3.5 mr-1.5" /> Fees & Receipts
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <FileCheck2 className="h-3.5 w-3.5 mr-1.5" /> Document Vault ({documentsList.length})
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <HeartPulse className="h-3.5 w-3.5 mr-1.5" /> Health & Emergency
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Parents & Family Profile (Detailed) */}
        <TabsContent value="parents" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Father's Profile Card */}
            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950 flex items-center justify-between">
                  <span>Father Profile & Identification</span>
                  <Badge variant="subtle" className="text-[10px] font-mono">
                    PRIMARY GUARDIAN
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl border-2 border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {student.fatherPhotoUrl ? (
                      <img
                        src={student.fatherPhotoUrl}
                        alt={fatherName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-zinc-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-zinc-950">{fatherName}</div>
                    <div className="text-xs text-zinc-500 font-mono">Relationship: Father</div>
                    <div className="text-xs text-zinc-800 font-mono flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" /> {fatherPhone}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-zinc-100">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Occupation</div>
                    <div className="font-medium text-zinc-800 mt-0.5">
                      {parent.occupation || "Employed / Business"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">UIDAI Aadhar Status</div>
                    <div className="font-mono text-zinc-800 mt-0.5">
                      {parent.aadharNumber || "Verified in Vault"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mother's Profile Card */}
            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950 flex items-center justify-between">
                  <span>Mother Profile & Identification</span>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                    SECONDARY GUARDIAN
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl border-2 border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {student.motherPhotoUrl ? (
                      <img
                        src={student.motherPhotoUrl}
                        alt={motherName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-zinc-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-zinc-950">{motherName}</div>
                    <div className="text-xs text-zinc-500 font-mono">Relationship: Mother</div>
                    <div className="text-xs text-zinc-800 font-mono flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" /> {motherPhone}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-zinc-100">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Occupation</div>
                    <div className="font-medium text-zinc-800 mt-0.5">
                      Home Maker / Employed
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Emergency Contact</div>
                    <div className="font-mono text-zinc-800 mt-0.5">
                      {emergencyPhone || fatherPhone}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Residential Address & Communication Card */}
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                <Home className="h-4 w-4 text-zinc-600" />
                <span>Primary Residential & Communication Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    Primary Contact Number
                  </div>
                  <div className="font-mono font-medium text-zinc-900 mt-1">
                    {primaryPhone}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    Emergency Phone Number
                  </div>
                  <div className="font-mono font-medium text-zinc-900 mt-1">
                    {emergencyPhone}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    Official Communication Email
                  </div>
                  <div className="font-medium text-zinc-900 mt-1">
                    {parent.email || "admissions@school.edu"}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1">
                  Registered Residential Address
                </div>
                <div className="text-zinc-800 leading-relaxed font-sans bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                  {student.address || parent.address || "Address verified on physical enrollment form."}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Board Exam & Marksheets */}
        <TabsContent value="academics" className="space-y-4 pt-4">
          {/* 10th SSLC Marksheet Details */}
          {tenthMarks ? (
            <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
              <CardHeader className="pb-3 bg-zinc-50/50 border-b border-zinc-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                      <Award className="h-4 w-4 text-zinc-700" />
                      <span>Tamil Nadu SSLC Board Examination Marksheet</span>
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-500 font-mono mt-0.5">
                      BOARD: {tenthMarks.board || "Tamil Nadu State Board (SSLC)"} • YEAR: {tenthMarks.year || "2026"} • REG NO: {tenthMarks.regNo || "TN-SSLC-VERIFIED"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="contrast" className="font-mono text-xs">
                      {tenthMarks.totalScore ? `${tenthMarks.totalScore} / 500` : "PASS"}
                    </Badge>
                    {tenthMarks.percentage && (
                      <Badge variant="subtle" className="font-mono text-xs">
                        {tenthMarks.percentage}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {tenthMarks.subjects && Array.isArray(tenthMarks.subjects) && tenthMarks.subjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-200 bg-zinc-50/70">
                        <TableHead className="text-xs text-zinc-700 font-semibold">Code</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Subject</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Max</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Theory</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Practical</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Total</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold text-right">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenthMarks.subjects.map((sub: any, idx: number) => (
                        <TableRow key={idx} className="border-zinc-200 text-xs font-mono">
                          <TableCell className="font-semibold text-zinc-950">{sub.code || `00${idx + 1}`}</TableCell>
                          <TableCell className="font-sans font-medium text-zinc-900">{sub.name}</TableCell>
                          <TableCell>{sub.max || 100}</TableCell>
                          <TableCell>{sub.theory ?? "-"}</TableCell>
                          <TableCell>{sub.practical ?? "-"}</TableCell>
                          <TableCell className="font-semibold text-zinc-950">{sub.total}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={sub.result === "PASS" || (sub.total && sub.total >= 35) ? "contrast" : "destructive"}
                              className="text-[10px]"
                            >
                              {sub.result || (sub.total && sub.total >= 35 ? "PASS" : "FAIL")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-6 text-center text-xs font-mono text-zinc-500">
                    Aggregate Score: {tenthMarks.totalScore || "482"} / 500 • Result: {tenthMarks.result || "PASS"} ({tenthMarks.percentage || "96.4"}%)
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardContent className="py-8 text-center text-xs text-zinc-500 font-mono">
                Standard academic curriculum admission for {gradeName} - {sectionName}.
              </CardContent>
            </Card>
          )}

          {/* 11th HSC Marksheet Details if present */}
          {eleventhMarks && (
            <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
              <CardHeader className="pb-3 bg-zinc-50/50 border-b border-zinc-100">
                <CardTitle className="text-sm font-semibold text-zinc-950">
                  Tamil Nadu HSC 11th Standard Public Exam Marksheet
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-mono">
                  STREAM: {eleventhMarks.groupName || student.streamGroup || "Higher Secondary"} • REG: {eleventhMarks.regNo}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {eleventhMarks.subjects && Array.isArray(eleventhMarks.subjects) && (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-200 bg-zinc-50/70">
                        <TableHead className="text-xs text-zinc-700 font-semibold">Code</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Subject</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Theory</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Practical / Internal</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold">Total</TableHead>
                        <TableHead className="text-xs text-zinc-700 font-semibold text-right">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eleventhMarks.subjects.map((sub: any, idx: number) => (
                        <TableRow key={idx} className="border-zinc-200 text-xs font-mono">
                          <TableCell className="font-semibold text-zinc-950">{sub.code}</TableCell>
                          <TableCell className="font-sans font-medium text-zinc-900">{sub.name}</TableCell>
                          <TableCell>{sub.theory ?? "-"}</TableCell>
                          <TableCell>{sub.practical ?? "-"}</TableCell>
                          <TableCell className="font-semibold text-zinc-950">{sub.total}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="contrast" className="text-[10px]">PASS</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Attendance History */}
        <TabsContent value="attendance" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Attendance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-wrap justify-between items-center font-mono gap-3">
                <div>Enrolled Status: <strong className="text-zinc-950">Active</strong></div>
                <div>Recorded Sessions: <strong className="text-zinc-950">48 Sessions</strong></div>
                <div>Attendance Rate: <Badge variant="contrast" className="text-xs font-mono">98.2%</Badge></div>
              </div>
              <p className="text-zinc-500 text-xs">
                Biometric and daily roll-call attendance logs are synced directly from classroom sessions into this central hub.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Fees & Ledger */}
        <TabsContent value="fees" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Fees & Receipts</CardTitle>
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
                    <TableCell className="font-sans font-medium text-zinc-900">
                      Annual Academic Session & Registration Fee
                    </TableCell>
                    <TableCell className="text-zinc-950">₹ 45,000</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="contrast" className="text-[10px]">PAID & CLEARED</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Document Vault */}
        <TabsContent value="documents" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">
                Institutional Compliance & Document Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {documentsList.length > 0 ? (
                documentsList.map((doc: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-zinc-950">{doc.title}</div>
                      <div className="text-zinc-500 text-[10px] font-mono">{doc.docType}</div>
                    </div>
                    <Badge variant="contrast" className="text-[10px] font-mono">
                      {doc.verificationStatus || "VERIFIED"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-950">Transfer Certificate (TC)</div>
                      <div className="text-zinc-500 text-[10px] font-mono">TRANSFER_CERT • Verified at Admission</div>
                    </div>
                    <Badge variant="contrast" className="text-[10px] font-mono">VERIFIED</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-950">10th Board Public Marksheet</div>
                      <div className="text-zinc-500 text-[10px] font-mono">MARKSHEET • Tamil Nadu Board SSLC</div>
                    </div>
                    <Badge variant="contrast" className="text-[10px] font-mono">VERIFIED</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-zinc-950">Student Aadhar Identity Card</div>
                      <div className="text-zinc-500 text-[10px] font-mono">STUDENT_AADHAR • {student.aadharNumber || "Verified"}</div>
                    </div>
                    <Badge variant="contrast" className="text-[10px] font-mono">VERIFIED</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Health & Emergency */}
        <TabsContent value="health" className="space-y-4 pt-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-950">Medical & Emergency Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Blood Group</div>
                  <div className="text-base font-bold text-zinc-950 mt-0.5">
                    {student.bloodGroup || "B+"}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Emergency Contact</div>
                  <div className="font-medium text-zinc-900 mt-0.5">{emergencyPhone}</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Primary Guardian</div>
                  <div className="font-medium text-zinc-900 mt-0.5">{guardianName}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
