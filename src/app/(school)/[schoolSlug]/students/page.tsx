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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search, Eye, Plus, User, Loader2 } from "lucide-react";
import { erpApi } from "@/lib/api";

interface StudentItem {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  grade: string;
  gender?: string;
  parentName: string;
  phone: string;
  attendanceRate: number;
  feeStatus: string;
  status: string;
  photoUrl?: string | null;
}

export default function StudentsDirectoryPage() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const [search, setSearch] = React.useState("");
  const [studentsList, setStudentsList] = React.useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    erpApi
      .getStudents()
      .then((res) => {
        if (!isMounted) return;
        const dbStudents = res?.students || (Array.isArray(res) ? res : []);
        if (Array.isArray(dbStudents)) {
          const mapped: StudentItem[] = dbStudents
            .filter((st: any) => st.id !== "student-alex-chen" && !st.id?.startsWith("demo-"))
            .map((st: any) => ({
            id: st.id,
            admissionNo: st.admissionNumber || "Pending",
            rollNo: st.rollNumber || "01",
            name: `${st.firstName || ""} ${st.lastName || ""}`.trim() || "Student",
            grade: st.gradeClass?.name
              ? `${st.gradeClass.name}${st.section?.name ? ` - ${st.section.name}` : ""}`
              : "Standard Grade",
            gender: st.gender || "Not Specified",
            parentName:
              st.parent?.guardianName ||
              st.parent?.fatherName ||
              st.parent?.motherName ||
              "Guardian",
            phone:
              st.parent?.phone ||
              st.parent?.fatherPhone ||
              st.parent?.motherPhone ||
              "Not Provided",
            attendanceRate: 98,
            feeStatus: "PAID",
            status: st.status || "ACTIVE",
            photoUrl: st.studentPhotoUrl || st.photoUrl || null,
          }));
          setStudentsList(mapped);
        } else {
          setStudentsList([]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch students list from DB:", err);
        if (isMounted) setStudentsList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [schoolSlug]);

  const filtered = studentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Student Directory & 360 Hubs
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            FLOW #26: STUDENT DIRECTORY • DATABASE PERSISTENCE & CENTRAL 360 HUBS
          </p>
        </div>

        <Link href={`/${schoolSlug}/admissions/new`}>
          <Button
            size="sm"
            className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New Admission
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="bg-white border-zinc-200 shadow-2xs">
        <CardContent className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by student name, roll number, admission number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-zinc-200 pl-9 text-xs text-zinc-950 placeholder:text-zinc-400 focus-visible:ring-zinc-950"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50/70">
                <TableHead className="text-xs text-zinc-700 font-semibold">Student</TableHead>
                <TableHead className="text-xs text-zinc-700 font-semibold">Admission & Roll</TableHead>
                <TableHead className="text-xs text-zinc-700 font-semibold">Class & Section</TableHead>
                <TableHead className="text-xs text-zinc-700 font-semibold">Parent / Contact</TableHead>
                <TableHead className="text-xs text-zinc-700 font-semibold">Attendance</TableHead>
                <TableHead className="text-xs text-zinc-700 font-semibold">Fee Status</TableHead>
                <TableHead className="text-xs text-zinc-700 font-semibold">Status</TableHead>
                <TableHead className="text-right text-xs text-zinc-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Clean Skeleton Loading Rows while receiving data from API
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="border-zinc-200">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-zinc-100 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 bg-zinc-100 rounded animate-pulse" />
                          <div className="h-2.5 w-16 bg-zinc-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 w-24 bg-zinc-100 rounded animate-pulse mb-1" />
                      <div className="h-2.5 w-14 bg-zinc-100 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 w-32 bg-zinc-100 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 w-24 bg-zinc-100 rounded animate-pulse mb-1" />
                      <div className="h-2.5 w-20 bg-zinc-100 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-3.5 w-12 bg-zinc-100 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-14 bg-zinc-100 rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-14 bg-zinc-100 rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-7 w-20 bg-zinc-100 rounded animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-zinc-500 text-xs font-mono"
                  >
                    {search ? (
                      <>No student records found matching "{search}".</>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Users className="h-8 w-8 text-zinc-300" />
                        <div className="text-sm font-semibold text-zinc-900">
                          No students registered yet
                        </div>
                        <p className="text-xs text-zinc-500 max-w-sm">
                          No students found for this school. Submit a registration form to enroll a student.
                        </p>
                        <Link href={`/${schoolSlug}/admissions/new`} className="mt-2">
                          <Button
                            size="sm"
                            className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> New Admission
                          </Button>
                        </Link>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((st) => (
                  <TableRow
                    key={st.id}
                    className="border-zinc-200 hover:bg-zinc-50/80 text-xs transition-colors"
                  >
                    {/* Student Name & Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full border border-zinc-300 overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0">
                          {st.photoUrl ? (
                            <img
                              src={st.photoUrl}
                              alt={st.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-950 text-xs flex items-center gap-1.5">
                            {st.name}
                            {st.gender && (
                              <span className="text-[10px] text-zinc-400 font-normal">
                                ({st.gender[0]})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            ID: {st.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Admission & Roll */}
                    <TableCell>
                      <div className="font-mono font-semibold text-zinc-950">
                        {st.admissionNo}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Roll: {st.rollNo}
                      </div>
                    </TableCell>

                    {/* Class & Section */}
                    <TableCell>
                      <div className="font-medium text-zinc-800">{st.grade}</div>
                    </TableCell>

                    {/* Parent */}
                    <TableCell>
                      <div className="text-zinc-800 font-medium">{st.parentName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{st.phone}</div>
                    </TableCell>

                    {/* Attendance */}
                    <TableCell>
                      <span className="font-mono text-zinc-900 font-medium">
                        {st.attendanceRate}%
                      </span>
                    </TableCell>

                    {/* Fee Clearance */}
                    <TableCell>
                      <Badge
                        variant={st.feeStatus === "PAID" ? "contrast" : "subtle"}
                        className="text-[10px] font-mono"
                      >
                        {st.feeStatus}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant="contrast" className="text-[10px] font-mono">
                        {st.status}
                      </Badge>
                    </TableCell>

                    {/* 360 Action */}
                    <TableCell className="text-right">
                      <Link href={`/${schoolSlug}/students/${st.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-zinc-200 hover:bg-zinc-100 font-mono"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View 360
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
