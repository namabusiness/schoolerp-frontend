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
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Plus,
  Building,
  UserCheck,
} from "lucide-react";

const CLASSES_DATA = [
  { id: "class-g10", name: "Grade 10", code: "G10", sections: ["Section A (35/40)", "Section B (32/40)"], subjectsCount: 6 },
  { id: "class-g9", name: "Grade 9", code: "G9", sections: ["Section A (38/40)", "Section B (36/40)"], subjectsCount: 6 },
  { id: "class-g8", name: "Grade 8", code: "G8", sections: ["Section A (30/40)"], subjectsCount: 5 },
  { id: "class-g7", name: "Grade 7", code: "G7", sections: ["Section A (34/40)"], subjectsCount: 5 },
];

const SUBJECTS_DATA = [
  { code: "MATH101", name: "Advanced Mathematics", grade: "Grade 10", teacher: "Prof. Marcus Sterling", periodsPerWeek: 5 },
  { code: "PHY101", name: "Physics & Lab Mechanics", grade: "Grade 10", teacher: "Dr. Catherine Brooks", periodsPerWeek: 4 },
  { code: "CHEM101", name: "Organic & Physical Chemistry", grade: "Grade 10", teacher: "Dr. Ronald Hayes", periodsPerWeek: 4 },
  { code: "ENG101", name: "English Literature & Composition", grade: "Grade 10", teacher: "Emily Watson", periodsPerWeek: 4 },
  { code: "BIO101", name: "Biology & Genetic Science", grade: "Grade 10", teacher: "Claire Davies", periodsPerWeek: 3 },
];

const TIMETABLE_GRID = [
  { period: "Period 1 (08:30 - 09:15)", mon: "MATH101 (Room 101)", tue: "PHY101 (Lab 2)", wed: "MATH101 (Room 101)", thu: "ENG101 (Room 101)", fri: "CHEM101 (Lab 1)" },
  { period: "Period 2 (09:15 - 10:00)", mon: "PHY101 (Lab 2)", tue: "MATH101 (Room 101)", wed: "CHEM101 (Lab 1)", thu: "MATH101 (Room 101)", fri: "ENG101 (Room 101)" },
  { period: "Break (10:00 - 10:20)", mon: "MORNING RECESS", tue: "MORNING RECESS", wed: "MORNING RECESS", thu: "MORNING RECESS", fri: "MORNING RECESS" },
  { period: "Period 3 (10:20 - 11:05)", mon: "CHEM101 (Lab 1)", tue: "ENG101 (Room 101)", wed: "BIO101 (Lab 3)", thu: "PHY101 (Lab 2)", fri: "MATH101 (Room 101)" },
  { period: "Period 4 (11:05 - 11:50)", mon: "ENG101 (Room 101)", tue: "CHEM101 (Lab 1)", wed: "PHY101 (Lab 2)", thu: "BIO101 (Lab 3)", fri: "SPORTS / PE" },
];

export default function AcademicSetupPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Academic Setup Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #10: ACADEMIC YEARS, TERMS, CLASSES, SECTIONS, SUBJECTS & TIMETABLE MATRIX
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="contrast" className="text-xs font-mono py-1 px-3">
            SESSION: 2026-2027 (READY)
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="classes" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Layers className="h-3.5 w-3.5 mr-1.5" /> Classes & Sections
          </TabsTrigger>
          <TabsTrigger value="subjects" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Subjects & Teachers
          </TabsTrigger>
          <TabsTrigger value="timetable" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> Timetable Matrix
          </TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-zinc-400 font-mono">ENROLLED GRADES (1-12)</div>
            <Button size="sm" className="h-8 bg-white text-black hover:bg-zinc-200 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Grade / Section
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLASSES_DATA.map((cls) => (
              <Card key={cls.id} className="bg-zinc-900/60 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-white">{cls.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px] border-zinc-700">{cls.code}</Badge>
                  </div>
                  <CardDescription className="text-xs text-zinc-400">
                    {cls.subjectsCount} registered academic subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-[11px] text-zinc-500 font-mono uppercase">Sections & Capacity</div>
                  <div className="flex flex-wrap gap-2">
                    {cls.sections.map((sec) => (
                      <span key={sec} className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono">
                        {sec}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-zinc-400 font-mono">CURRICULUM MAPPINGS</div>
            <Button size="sm" className="h-8 bg-white text-black hover:bg-zinc-200 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Assign Teacher to Subject
            </Button>
          </div>
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Assigned Grade</TableHead>
                    <TableHead>Faculty In Charge</TableHead>
                    <TableHead className="text-right">Periods / Wk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SUBJECTS_DATA.map((sub) => (
                    <TableRow key={sub.code} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell className="font-mono font-semibold text-white">{sub.code}</TableCell>
                      <TableCell className="font-medium text-white">{sub.name}</TableCell>
                      <TableCell className="text-zinc-400">{sub.grade}</TableCell>
                      <TableCell className="text-zinc-300 flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-zinc-400" /> {sub.teacher}
                      </TableCell>
                      <TableCell className="text-right font-mono text-white">{sub.periodsPerWeek}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timetable Tab */}
        <TabsContent value="timetable" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-zinc-400 font-mono">WEEKLY TIMETABLE GRID — GRADE 10 (SECTION A)</div>
            <Button size="sm" className="h-8 bg-white text-black hover:bg-zinc-200 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Re-solve / Edit Slot
            </Button>
          </div>
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="w-48">Period Time</TableHead>
                    <TableHead>Monday</TableHead>
                    <TableHead>Tuesday</TableHead>
                    <TableHead>Wednesday</TableHead>
                    <TableHead>Thursday</TableHead>
                    <TableHead>Friday</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TIMETABLE_GRID.map((slot, idx) => (
                    <TableRow key={idx} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                      <TableCell className="font-medium text-zinc-300">{slot.period}</TableCell>
                      <TableCell className="text-white">{slot.mon}</TableCell>
                      <TableCell className="text-white">{slot.tue}</TableCell>
                      <TableCell className="text-white">{slot.wed}</TableCell>
                      <TableCell className="text-white">{slot.thu}</TableCell>
                      <TableCell className="text-white">{slot.fri}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
