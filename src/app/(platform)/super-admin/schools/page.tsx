"use client";

import * as React from "react";
import Link from "next/link";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { erpApi } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/page-loader";

const ALL_ERP_MODULES = [
  { key: "ADMISSION", label: "Admissions Pipeline" },
  { key: "ACADEMICS", label: "Academics & Timetable" },
  { key: "ATTENDANCE", label: "Attendance & Daily Ops" },
  { key: "FEES", label: "Fees, Billing & Receipts" },
  { key: "EXAMS", label: "Exams & Report Cards" },
  { key: "TRANSPORT", label: "Transport & Fleet Trips" },
  { key: "LIBRARY", label: "Library Circulation" },
  { key: "COMMUNICATION", label: "Multi-Channel Broadcasts" },
  { key: "HR", label: "Staff & Payroll HR" },
  { key: "INVENTORY", label: "Inventory & Assets" },
  { key: "EVENTS", label: "Events & Certificates" },
  { key: "HEALTH", label: "Student Health & Incidents" },
  { key: "CERTIFICATES", label: "Bonafide & Transfer TC" },
  { key: "PROMOTION", label: "Promotion & Year Rollover" },
];

export default function SchoolsManagementPage() {
  const [schools, setSchools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Form State
  const [schoolName, setSchoolName] = React.useState("");
  const [schoolCode, setSchoolCode] = React.useState("");
  const [schoolSlug, setSchoolSlug] = React.useState("");
  const [adminName, setAdminName] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [studentLimit, setStudentLimit] = React.useState(1000);
  const [selectedModules, setSelectedModules] = React.useState<string[]>(
    ALL_ERP_MODULES.map((m) => m.key)
  );

  const fetchSchools = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await erpApi.getSchools();
      setSchools(data);
    } catch {
      // Mock fallback data
      setSchools([
        {
          id: "school-greenwood-high",
          name: "Greenwood High International",
          code: "GWH-2026",
          slug: "greenwood-high",
          status: "ACTIVE",
          studentLimit: 2500,
          staffLimit: 200,
          _count: { students: 1420, staff: 112 },
          schoolAdmins: [{ user: { name: "Dr. Eleanor Vance", email: "admin@greenwoodhigh.edu" } }],
        },
        {
          id: "school-oakridge",
          name: "Oakridge STEM Academy",
          code: "OAK-2026",
          slug: "oakridge-stem",
          status: "ACTIVE",
          studentLimit: 1200,
          staffLimit: 100,
          _count: { students: 840, staff: 65 },
          schoolAdmins: [{ user: { name: "Robert Sterling", email: "principal@oakridge.edu" } }],
        },
        {
          id: "school-st-xaviers",
          name: "St. Xavier Collegiate",
          code: "STX-2026",
          slug: "st-xaviers",
          status: "TRIAL",
          studentLimit: 500,
          staffLimit: 40,
          _count: { students: 310, staff: 28 },
          schoolAdmins: [{ user: { name: "Sister Maria Kelly", email: "admin@stxaviers.edu" } }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await erpApi.createSchool({
        name: schoolName,
        code: schoolCode,
        slug: schoolSlug || schoolCode.toLowerCase(),
        adminName,
        adminEmail,
        studentLimit: Number(studentLimit),
        enabledModules: selectedModules,
      });
      setIsCreateOpen(false);
      fetchSchools();
    } catch (err: any) {
      alert(`Error creating school: ${err.message}`);
    }
  };

  const toggleModule = (key: string) => {
    setSelectedModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">School Management Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #2: MULTI-TENANT ISOLATION, SLUGS, QUOTAS & MODULE ACTIVATION
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create School Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Create New School Tenant</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Setup institution profile, unique tenant slug, quota limits, and assign initial administrator.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSchool} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">School Name</Label>
                  <Input
                    placeholder="e.g. Apex Horizon Academy"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Unique Code</Label>
                  <Input
                    placeholder="e.g. APEX-2026"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Tenant Slug (Subdomain / URL)</Label>
                  <Input
                    placeholder="e.g. apex-horizon"
                    value={schoolSlug}
                    onChange={(e) => setSchoolSlug(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Student Enrollment Limit</Label>
                  <Input
                    type="number"
                    value={studentLimit}
                    onChange={(e) => setStudentLimit(Number(e.target.value))}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs font-semibold text-zinc-200 mb-2">School Administrator Account</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-400">Admin Full Name</Label>
                    <Input
                      placeholder="e.g. Dr. Thomas Wright"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                      className="bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-400">Admin Email (Invitation will be sent)</Label>
                    <Input
                      type="email"
                      placeholder="admin@apexacademy.edu"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="bg-zinc-900 border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs font-semibold text-zinc-200 mb-2">
                  Enabled Modules ({selectedModules.length}/{ALL_ERP_MODULES.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_ERP_MODULES.map((mod) => (
                    <div
                      key={mod.key}
                      onClick={() => toggleModule(mod.key)}
                      className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-zinc-900/60 cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                      <Checkbox
                        checked={selectedModules.includes(mod.key)}
                        onCheckedChange={() => toggleModule(mod.key)}
                      />
                      <span className="text-[11px] text-zinc-300 truncate">{mod.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="border-t border-zinc-800 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-zinc-800 text-zinc-300"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Provision School & Send Invite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by school name, code, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border-zinc-800 pl-9 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {["ALL", "ACTIVE", "TRIAL", "SUSPENDED", "EXPIRED", "ARCHIVED"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "contrast" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="h-7 text-[10px] px-2 border-zinc-800"
              >
                {st}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead>Institution Name & Slug</TableHead>
                  <TableHead>Tenant ID / Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Student Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                <TableRow key={school.id} className="border-zinc-800/60 hover:bg-zinc-900/40">
                  <TableCell>
                    <div className="font-semibold text-white text-xs">{school.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">/{school.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
                      {school.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        school.status === "ACTIVE"
                          ? "contrast"
                          : school.status === "TRIAL"
                          ? "subtle"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {school.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-zinc-300">
                      {school.schoolAdmins?.[0]?.user?.name || "Dr. Eleanor Vance"}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {school.schoolAdmins?.[0]?.user?.email || "admin@school.edu"}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-300">
                    {school._count?.students || 0} / {school.studentLimit}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/school/${school.slug}/dashboard`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-700 hover:bg-zinc-800">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Enter School
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
