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
} from "lucide-react";

export default function Student360Page() {
  const params = useParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const studentId = (params?.id as string) || "student-alex-chen";
  const basePath = `/school/${schoolSlug}`;

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href={`${basePath}/students`}>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Directory
          </Button>
        </Link>
      </div>

      {/* Header Profile Banner (Pure Monochrome) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-2xl text-white">
            AC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Alexander Chen</h1>
              <Badge variant="contrast" className="text-xs">ACTIVE STUDENT</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono mt-1">
              <span>ADM: ADM-2026-1001</span>
              <span>•</span>
              <span>ROLL: 10-A-01</span>
              <span>•</span>
              <span>GRADE 10 - SECTION A</span>
              <span>•</span>
              <span>BLOOD GROUP: O+</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> +1 (555) 482-9901 (Parent: David Chen)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 742 Evergreen Terrace
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`${basePath}/certificates`}>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Generate Certificate
            </Button>
          </Link>
          <Link href={`${basePath}/fees`}>
            <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-xs text-white">
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Fee Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* 360 Central Connection Tabs */}
      <Tabs defaultValue="academics" className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-zinc-900 border border-zinc-800 gap-1">
          <TabsTrigger value="academics" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <BookOpen className="h-3.5 w-3.5 mr-1" /> Academics & Grades
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <CalendarCheck className="h-3.5 w-3.5 mr-1" /> Attendance (98%)
          </TabsTrigger>
          <TabsTrigger value="fees" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Receipt className="h-3.5 w-3.5 mr-1" /> Fees & Receipts
          </TabsTrigger>
          <TabsTrigger value="transport" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Bus className="h-3.5 w-3.5 mr-1" /> Transport (Route 101)
          </TabsTrigger>
          <TabsTrigger value="library" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Library className="h-3.5 w-3.5 mr-1" /> Library Loans
          </TabsTrigger>
          <TabsTrigger value="health" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <HeartPulse className="h-3.5 w-3.5 mr-1" /> Health & Incidents
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <FileCheck2 className="h-3.5 w-3.5 mr-1" /> Document Vault
          </TabsTrigger>
        </TabsList>

        {/* Academics & Exams */}
        <TabsContent value="academics" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Cumulative GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-mono">3.92 / 4.0</div>
                <p className="text-[11px] text-zinc-500 mt-1">Grade Standing: A+ (Rank #2 in Section A)</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Latest Term 1 Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-mono">94.8%</div>
                <p className="text-[11px] text-zinc-500 mt-1">Midterm Exams Completed</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Official Report Card</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`${basePath}/examinations`}>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 hover:bg-zinc-800 w-full mt-1">
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Download Report Card PDF
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Subject Evaluation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Course Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Teacher Faculty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-zinc-800/60 text-xs font-mono">
                    <TableCell className="text-white">MATH101</TableCell>
                    <TableCell className="font-sans font-medium text-white">Advanced Mathematics</TableCell>
                    <TableCell className="text-white">96 / 100</TableCell>
                    <TableCell><Badge variant="contrast" className="text-[10px]">A+</Badge></TableCell>
                    <TableCell className="font-sans text-zinc-400">Prof. Marcus Sterling</TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-800/60 text-xs font-mono">
                    <TableCell className="text-white">PHY101</TableCell>
                    <TableCell className="font-sans font-medium text-white">Physics & Lab Mechanics</TableCell>
                    <TableCell className="text-white">94 / 100</TableCell>
                    <TableCell><Badge variant="contrast" className="text-[10px]">A</Badge></TableCell>
                    <TableCell className="font-sans text-zinc-400">Dr. Catherine Brooks</TableCell>
                  </TableRow>
                  <TableRow className="border-zinc-800/60 text-xs font-mono">
                    <TableCell className="text-white">CHEM101</TableCell>
                    <TableCell className="font-sans font-medium text-white">Organic & Physical Chemistry</TableCell>
                    <TableCell className="text-white">91 / 100</TableCell>
                    <TableCell><Badge variant="contrast" className="text-[10px]">A</Badge></TableCell>
                    <TableCell className="font-sans text-zinc-400">Dr. Ronald Hayes</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Attendance Audit Log (Past 30 Sessions)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex justify-between items-center font-mono">
                <div>Total Recorded Days: <strong>60</strong></div>
                <div>Present: <strong className="text-white">59</strong></div>
                <div>Excused Leaves: <strong className="text-zinc-400">1</strong></div>
                <div>Attendance Rate: <Badge variant="contrast" className="text-xs">98.3%</Badge></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Billing & Receipts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Billing Description</TableHead>
                    <TableHead>Demanded</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Receipt No</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-zinc-800/60 text-xs font-mono">
                    <TableCell className="text-white">INV-2026-001</TableCell>
                    <TableCell className="font-sans font-medium text-white">Term 1 Tuition & Laboratory Fee</TableCell>
                    <TableCell>$1,850.00</TableCell>
                    <TableCell className="text-white">$1,850.00</TableCell>
                    <TableCell className="text-zinc-400">RCP-2026-001</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="contrast" className="text-[10px]">PAID IN FULL</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Transport Route & Transit Pass</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Assigned Route</div>
                  <div className="font-semibold text-white mt-1">Route 101 - North Valley Express</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">Vehicle: BUS-GWH-01 (Volvo 45-Seater)</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Assigned Stop & Schedule</div>
                  <div className="font-semibold text-white mt-1">Evergreen Terrace Square (Stop #1)</div>
                  <div className="text-zinc-400 text-[11px] font-mono mt-0.5">Pickup: 07:20 AM • Drop: 03:40 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Active Library Loans</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Book Title</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Circulation Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-zinc-800/60 text-xs">
                    <TableCell className="font-medium text-white">The Feynman Lectures on Physics - Vol 1</TableCell>
                    <TableCell className="font-mono text-zinc-400">978-0465024933</TableCell>
                    <TableCell className="font-mono text-zinc-400">2026-09-10</TableCell>
                    <TableCell className="font-mono text-zinc-300">2026-09-24</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-[10px] border-zinc-700">ISSUED (ON TIME)</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Medical Profile & Incident History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Blood Group</div>
                  <div className="text-base font-bold text-white mt-0.5">O+</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Known Allergies</div>
                  <div className="font-medium text-zinc-200 mt-0.5">Peanuts, Penicillin</div>
                </div>
                <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Emergency Contact</div>
                  <div className="font-medium text-zinc-200 mt-0.5">+1 (555) 482-9901</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Vault */}
        <TabsContent value="documents" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Verified Student Documents Vault</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { title: "Official Birth Certificate", type: "Government ID", status: "VERIFIED" },
                { title: "Previous School Transfer Certificate (TC)", type: "Academic Transfer", status: "VERIFIED" },
                { title: "Parent National ID Proof", type: "Guardian Verification", status: "VERIFIED" },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{doc.title}</div>
                    <div className="text-zinc-500 text-[10px] font-mono">{doc.type}</div>
                  </div>
                  <Badge variant="contrast" className="text-[10px]">{doc.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
