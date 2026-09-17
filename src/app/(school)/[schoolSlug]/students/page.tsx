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
import { Users, Search, Eye, Plus, ArrowUpRight } from "lucide-react";

const DEMO_STUDENTS = [
  {
    id: "student-alex-chen",
    admissionNo: "ADM-2026-1001",
    rollNo: "10-A-01",
    name: "Alexander Chen",
    grade: "Grade 10 - Section A",
    gender: "Male",
    parentName: "David Chen",
    phone: "+1 555-482-9901",
    attendanceRate: 98,
    feeStatus: "PAID",
    status: "ACTIVE",
  },
  {
    id: "student-emma-watson",
    admissionNo: "ADM-2026-1002",
    rollNo: "10-A-02",
    name: "Emma Watson",
    grade: "Grade 10 - Section A",
    gender: "Female",
    parentName: "Chris Watson",
    phone: "+1 555-391-4422",
    attendanceRate: 94,
    feeStatus: "PARTIAL",
    status: "ACTIVE",
  },
  {
    id: "student-liam-smith",
    admissionNo: "ADM-2026-1003",
    rollNo: "10-A-03",
    name: "Liam Smith",
    grade: "Grade 10 - Section A",
    gender: "Male",
    parentName: "Emily Smith",
    phone: "+1 555-112-9988",
    attendanceRate: 91,
    feeStatus: "PAID",
    status: "ACTIVE",
  },
  {
    id: "student-olivia-taylor",
    admissionNo: "ADM-2026-1004",
    rollNo: "10-A-04",
    name: "Olivia Taylor",
    grade: "Grade 10 - Section A",
    gender: "Female",
    parentName: "Robert Taylor",
    phone: "+1 555-776-3311",
    attendanceRate: 99,
    feeStatus: "PAID",
    status: "ACTIVE",
  },
];

export default function StudentsDirectoryPage() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const [search, setSearch] = React.useState("");

  const filtered = DEMO_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Student Directory & 360 Hubs</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #26: STUDENT — CENTRAL CONNECTION HUB LINKING ALL 14 SCHOOL DOMAINS
          </p>
        </div>

        <Link href={`/school/${schoolSlug}/admissions`}>
          <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Admit New Student
          </Button>
        </Link>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by student name, roll number, admission number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-950 border-zinc-800 pl-9 text-xs text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Admission No & Roll</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class & Section</TableHead>
                <TableHead>Parent / Guardian</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Fee Clearance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">360 Hub</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((st) => (
                <TableRow key={st.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                  <TableCell>
                    <div className="font-mono font-semibold text-white">{st.admissionNo}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Roll: {st.rollNo}</div>
                  </TableCell>
                  <TableCell className="font-medium text-white">{st.name}</TableCell>
                  <TableCell className="text-zinc-300">{st.grade}</TableCell>
                  <TableCell>
                    <div className="text-zinc-300">{st.parentName}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{st.phone}</div>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-200">{st.attendanceRate}%</TableCell>
                  <TableCell>
                    <Badge variant={st.feeStatus === "PAID" ? "contrast" : "subtle"} className="text-[10px]">
                      {st.feeStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="contrast" className="text-[10px]">{st.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/school/${schoolSlug}/students/${st.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-700 hover:bg-zinc-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Open 360° Hub
                      </Button>
                    </Link>
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
