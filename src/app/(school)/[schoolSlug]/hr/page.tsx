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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Users,
  Search,
  BookOpen,
  Phone,
  Mail,
  GraduationCap,
  IdCard,
  Trash2,
  Loader2,
  KeyRound,
  ShieldCheck,
  User,
} from "lucide-react";
import { erpApi } from "@/lib/api";

export default function StaffHrPage() {
  const [activeTab, setActiveTab] = React.useState("directory");
  const [staffList, setStaffList] = React.useState<any[]>([]);
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [leaves, setLeaves] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState("ALL");
  const [notification, setNotification] = React.useState<string | null>(null);

  // Add Faculty Modal States
  const [isAddFacultyOpen, setIsAddFacultyOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [facultyForm, setFacultyForm] = React.useState({
    name: "",
    gender: "MALE",
    dob: "",
    bloodGroup: "O+",
    phone: "",
    email: "",
    aadharNumber: "",
    photoUrl: "",
    address: "",
    emergencyPhone: "",
    employeeCode: "",
    role: "TEACHER",
    designation: "Teacher",
    departmentId: "",
    qualification: "M.Sc, B.Ed",
    specialization: "Mathematics",
    experienceYears: "5",
    employmentType: "FULL_TIME",
    joiningDate: new Date().toISOString().split("T")[0],
    salary: "45000",
    createLogin: true,
    password: "Faculty@123",
  });

  const [payrollRan, setPayrollRan] = React.useState(false);
  const [selectedPayslip, setSelectedPayslip] = React.useState<any | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [sData, dData, lData] = await Promise.all([
        erpApi.getStaff().catch(() => []),
        erpApi.getDepartments().catch(() => []),
        erpApi.getLeaves().catch(() => []),
      ]);
      setStaffList(Array.isArray(sData) ? sData : []);
      setDepartments(Array.isArray(dData) ? dData : []);
      setLeaves(Array.isArray(lData) ? lData : []);
    } catch (err) {
      console.error("Failed to load staff/HR data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await erpApi.addStaff(facultyForm);
      showToast(`Faculty member "${facultyForm.name}" enrolled successfully in database.`);
      setIsAddFacultyOpen(false);
      setFacultyForm({
        name: "",
        gender: "MALE",
        dob: "",
        bloodGroup: "O+",
        phone: "",
        email: "",
        aadharNumber: "",
        photoUrl: "",
        address: "",
        emergencyPhone: "",
        employeeCode: "",
        role: "TEACHER",
        designation: "Teacher",
        departmentId: "",
        qualification: "M.Sc, B.Ed",
        specialization: "Mathematics",
        experienceYears: "5",
        employmentType: "FULL_TIME",
        joiningDate: new Date().toISOString().split("T")[0],
        salary: "45000",
        createLogin: true,
        password: "Faculty@123",
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add faculty member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Remove faculty member "${name}" from records?`)) return;
    try {
      await erpApi.deleteStaff(id);
      showToast("Staff record removed.");
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete staff");
    }
  };

  const handleRunPayroll = async () => {
    try {
      const now = new Date();
      await erpApi.runPayroll(now.getMonth() + 1, now.getFullYear());
      setPayrollRan(true);
      showToast("Monthly payroll processed for all active staff.");
      setTimeout(() => setPayrollRan(false), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to run payroll");
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDeptFilter === "ALL" || s.departmentId === selectedDeptFilter || s.department?.name === selectedDeptFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Faculty & Staff HR Hub</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            HUMAN RESOURCES, FACULTY ONBOARDING, TEACHING PROFILES & INSTITUTIONAL PAYROLL
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {payrollRan && (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" /> Payroll Processed
            </Badge>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunPayroll}
            className="border-zinc-300 hover:bg-zinc-100 text-xs font-mono"
          >
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            Run Monthly Payroll
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddFacultyOpen(true)}
            className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Faculty Member
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-mono shadow-xs animate-in fade-in">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-100 border border-zinc-200 p-1">
          <TabsTrigger
            value="directory"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Faculty Directory ({staffList.length})
          </TabsTrigger>
          <TabsTrigger
            value="leaves"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Leave Management ({leaves.length})
          </TabsTrigger>
          <TabsTrigger
            value="payroll"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            Payroll & Digital Payslips
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FACULTY DIRECTORY */}
        <TabsContent value="directory" className="space-y-4 pt-2">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-zinc-200">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <Input
                placeholder="Search by name, subject, or employee code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs bg-zinc-50 border-zinc-200"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-zinc-500 font-mono">Dept:</span>
              <Select value={selectedDeptFilter} onValueChange={setSelectedDeptFilter}>
                <SelectTrigger className="text-xs w-44 bg-zinc-50 border-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Directory Table */}
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading faculty directory...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-zinc-100 bg-zinc-50/50">
                      <TableHead className="text-xs font-mono text-zinc-500">EMPLOYEE</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">ROLE & DESIGNATION</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">QUALIFICATION & SUBJECTS</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">CONTACT</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">LOGIN ACCESS</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">STATUS</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500 text-right">ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-xs text-zinc-400">
                          No faculty members found. Click &quot;Add Faculty Member&quot; to register teachers and staff.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id} className="border-b border-zinc-100 text-xs hover:bg-zinc-50/60">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="h-9 w-9 rounded-full border border-zinc-200 bg-zinc-100 overflow-hidden flex items-center justify-center shrink-0">
                                {staff.photoUrl ? (
                                  <img
                                    src={staff.photoUrl}
                                    alt={staff.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-4 w-4 text-zinc-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-zinc-950">{staff.name}</div>
                                <div className="text-[10px] font-mono text-zinc-400">
                                  {staff.employeeCode} {staff.gender ? `• ${staff.gender}` : ""}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="font-medium text-zinc-900">{staff.designation}</div>
                            <div className="text-[10px] font-mono text-zinc-500">
                              {staff.department?.name || staff.role || "General"}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-zinc-800 font-mono text-[11px]">
                              {staff.qualification || "Graduate"}
                            </div>
                            {staff.specialization && (
                              <div className="text-[10px] text-zinc-500">
                                Subject: {staff.specialization}
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="font-mono text-[11px] text-zinc-700">{staff.phone}</div>
                            <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">{staff.email}</div>
                          </TableCell>

                          <TableCell>
                            {staff.user ? (
                              <Badge variant="subtle" className="text-[10px] font-mono gap-1 text-emerald-700 bg-emerald-50 border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                {staff.user.role}
                              </Badge>
                            ) : (
                              <span className="text-zinc-400 text-[10px] font-mono italic">No Account</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={staff.status === "ACTIVE" ? "contrast" : "outline"}
                              className="text-[10px] font-mono"
                            >
                              {staff.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStaff(staff.id, staff.name)}
                              className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: LEAVES */}
        <TabsContent value="leaves" className="space-y-4 pt-2">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950">Leave Applications</CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Staff leave requests and institutional approvals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50/50">
                    <TableHead className="text-xs font-mono text-zinc-500">FACULTY</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">LEAVE TYPE</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">DATES</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">REASON</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-xs text-zinc-400">
                        No pending or past leave applications on record.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaves.map((l) => (
                      <TableRow key={l.id} className="border-b border-zinc-100 text-xs">
                        <TableCell className="font-semibold text-zinc-950">
                          {l.staff?.name || "Staff Member"}
                        </TableCell>
                        <TableCell className="font-mono text-zinc-700">{l.leaveType}</TableCell>
                        <TableCell className="font-mono text-[11px] text-zinc-600">
                          {new Date(l.startDate).toLocaleDateString()} — {new Date(l.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-zinc-600">{l.reason}</TableCell>
                        <TableCell>
                          <Badge variant="contrast" className="text-[10px] font-mono">
                            {l.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PAYROLL */}
        <TabsContent value="payroll" className="space-y-4 pt-2">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-950">Payroll & Payslips</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Monthly remuneration schedule and payslip downloads
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={handleRunPayroll}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono"
              >
                <DollarSign className="h-3.5 w-3.5 mr-1" /> Execute Payroll
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {staffList.slice(0, 6).map((staff) => (
                  <div
                    key={staff.id}
                    className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 flex flex-col justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-zinc-950">{staff.name}</div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {staff.designation} • {staff.employeeCode}
                      </div>
                      <div className="mt-2 text-zinc-900 font-mono font-bold text-sm">
                        ₹{(staff.salary || 45000).toLocaleString()} <span className="text-[10px] font-normal text-zinc-500">/ mo</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPayslip(staff)}
                      className="h-6 text-[11px] border-zinc-300 hover:bg-zinc-100 font-mono mt-1"
                    >
                      <Download className="h-3 w-3 mr-1" /> View Digital Payslip
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: ADD FACULTY MEMBER */}
      <Dialog open={isAddFacultyOpen} onOpenChange={setIsAddFacultyOpen}>
        <DialogContent className="sm:max-w-2xl bg-white text-zinc-950 max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleAddFaculty}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Faculty & Staff Enrollment Form</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Complete institutional profile registration and ERP access configuration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              {/* SECTION 1: PERSONAL DETAILS */}
              <div>
                <div className="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono border-b border-zinc-200 pb-1 mb-2">
                  1. Personal & Identity
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name *</Label>
                    <Input
                      required
                      placeholder="e.g. Dr. Priya Sundaram"
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <Select
                      value={facultyForm.gender}
                      onValueChange={(val) => setFacultyForm({ ...facultyForm, gender: val })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Date of Birth</Label>
                    <Input
                      type="date"
                      value={facultyForm.dob}
                      onChange={(e) => setFacultyForm({ ...facultyForm, dob: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Blood Group</Label>
                    <Select
                      value={facultyForm.bloodGroup}
                      onValueChange={(val) => setFacultyForm({ ...facultyForm, bloodGroup: val })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O+">O Positive</SelectItem>
                        <SelectItem value="O-">O Negative</SelectItem>
                        <SelectItem value="A+">A Positive</SelectItem>
                        <SelectItem value="A-">A Negative</SelectItem>
                        <SelectItem value="B+">B Positive</SelectItem>
                        <SelectItem value="B-">B Negative</SelectItem>
                        <SelectItem value="AB+">AB Positive</SelectItem>
                        <SelectItem value="AB-">AB Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Aadhar Card Number</Label>
                    <Input
                      placeholder="12-digit UIDAI"
                      value={facultyForm.aadharNumber}
                      onChange={(e) => setFacultyForm({ ...facultyForm, aadharNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <Label className="text-xs">Faculty Photo URL</Label>
                  <Input
                    placeholder="https://images.unsplash.com/... or public image link"
                    value={facultyForm.photoUrl}
                    onChange={(e) => setFacultyForm({ ...facultyForm, photoUrl: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION 2: CONTACT & RESIDENCE */}
              <div>
                <div className="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono border-b border-zinc-200 pb-1 mb-2">
                  2. Contact & Residence
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number *</Label>
                    <Input
                      required
                      placeholder="+91 9876543210"
                      value={facultyForm.phone}
                      onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Official Email *</Label>
                    <Input
                      required
                      type="email"
                      placeholder="priya.s@greenwoodhigh.edu"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Emergency Contact</Label>
                    <Input
                      placeholder="+91 9444012345 (Spouse/Parent)"
                      value={facultyForm.emergencyPhone}
                      onChange={(e) => setFacultyForm({ ...facultyForm, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <Label className="text-xs">Residential Address</Label>
                  <Input
                    placeholder="Door No, Street Name, City, Postal Code"
                    value={facultyForm.address}
                    onChange={(e) => setFacultyForm({ ...facultyForm, address: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION 3: ACADEMIC & EMPLOYMENT */}
              <div>
                <div className="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono border-b border-zinc-200 pb-1 mb-2">
                  3. Academic & Employment
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Employee Code</Label>
                    <Input
                      placeholder="e.g. FAC-1021"
                      value={facultyForm.employeeCode}
                      onChange={(e) => setFacultyForm({ ...facultyForm, employeeCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">System Role</Label>
                    <Select
                      value={facultyForm.role}
                      onValueChange={(val) => setFacultyForm({ ...facultyForm, role: val })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="TRANSPORT_MANAGER">Transport Manager</SelectItem>
                        <SelectItem value="STAFF">Administrative Staff</SelectItem>
                        <SelectItem value="PRINCIPAL">Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Designation *</Label>
                    <Input
                      required
                      placeholder="PGT Mathematics Teacher"
                      value={facultyForm.designation}
                      onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Highest Qualification</Label>
                    <Input
                      placeholder="M.Sc, B.Ed, M.Phil"
                      value={facultyForm.qualification}
                      onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Subject / Specialization</Label>
                    <Input
                      placeholder="e.g. Mathematics & Statistics"
                      value={facultyForm.specialization}
                      onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Experience (Years)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={facultyForm.experienceYears}
                      onChange={(e) => setFacultyForm({ ...facultyForm, experienceYears: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Employment Type</Label>
                    <Select
                      value={facultyForm.employmentType}
                      onValueChange={(val) => setFacultyForm({ ...facultyForm, employmentType: val })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="CONTRACT">Contractual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Joining Date</Label>
                    <Input
                      type="date"
                      value={facultyForm.joiningDate}
                      onChange={(e) => setFacultyForm({ ...facultyForm, joiningDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Monthly Basic Salary (₹)</Label>
                    <Input
                      type="number"
                      value={facultyForm.salary}
                      onChange={(e) => setFacultyForm({ ...facultyForm, salary: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: ERP LOGIN ACCESS SETUP */}
              <div>
                <div className="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono border-b border-zinc-200 pb-1 mb-2 flex items-center justify-between">
                  <span>4. ERP Access Setup</span>
                  <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facultyForm.createLogin}
                      onChange={(e) => setFacultyForm({ ...facultyForm, createLogin: e.target.checked })}
                      className="rounded border-zinc-300 text-zinc-900"
                    />
                    <span className="font-semibold text-zinc-900">Provision ERP Login Account Automatically</span>
                  </label>
                  {facultyForm.createLogin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Initial Password</Label>
                        <Input
                          type="text"
                          value={facultyForm.password}
                          onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Account Tier</Label>
                        <div className="p-2 rounded border border-zinc-200 bg-white font-mono text-xs text-zinc-700">
                          Role: {facultyForm.role}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddFacultyOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Saving to Database..." : "Enroll Faculty Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: VIEW PAYSLIP */}
      {selectedPayslip && (
        <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
          <DialogContent className="sm:max-w-md bg-white text-zinc-950">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Digital Remuneration Slip</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Institutional payroll disbursement voucher
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Employee:</span>
                  <span className="font-bold text-zinc-900">{selectedPayslip.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Employee ID:</span>
                  <span>{selectedPayslip.employeeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Designation:</span>
                  <span>{selectedPayslip.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Basic Pay:</span>
                  <span>₹{(selectedPayslip.salary || 45000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">HRA + Allowances (15%):</span>
                  <span>+₹{Math.round((selectedPayslip.salary || 45000) * 0.15).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">PF + Deductions (5%):</span>
                  <span>-₹{Math.round((selectedPayslip.salary || 45000) * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 font-bold text-zinc-950 text-sm">
                  <span>Net Salary:</span>
                  <span>₹{Math.round((selectedPayslip.salary || 45000) * 1.1).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedPayslip(null)}
                className="text-xs border-zinc-300"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
