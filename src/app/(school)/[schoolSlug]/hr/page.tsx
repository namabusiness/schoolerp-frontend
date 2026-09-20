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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  Pencil,
  CalendarDays,
  Check,
  Layers,
  AlertCircle,
  Building,
} from "lucide-react";
import { erpApi } from "@/lib/api";
import { cn } from "@/lib/utils";

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
  const [classes, setClasses] = React.useState<any[]>([]);

  // Edit Faculty & Subject Mapping Modal States
  const [isEditFacultyOpen, setIsEditFacultyOpen] = React.useState(false);
  const [editingStaff, setEditingStaff] = React.useState<any | null>(null);
  const [editFacultyForm, setEditFacultyForm] = React.useState({
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
    salary: "45000",
    status: "ACTIVE",
  });
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>([]);
  const [editFacultyGradeId, setEditFacultyGradeId] = React.useState<string>("");
  const [editSubmitting, setEditSubmitting] = React.useState(false);

  // Modern In-App Confirm Dialog State
  const [confirmModal, setConfirmModal] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    variant?: "destructive" | "default";
    icon?: React.ReactNode;
    itemDetails?: {
      label?: string;
      title: string;
      subtitle?: string;
      badge?: string;
    };
    onConfirm: () => Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: async () => { },
  });
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [sData, dData, lData, cData] = await Promise.all([
        erpApi.getStaff().catch(() => []),
        erpApi.getDepartments().catch(() => []),
        erpApi.getLeaves().catch(() => []),
        erpApi.getClasses().catch(() => []),
      ]);
      setStaffList(Array.isArray(sData) ? sData : []);
      setDepartments(Array.isArray(dData) ? dData : []);
      setLeaves(Array.isArray(lData) ? lData : []);
      setClasses(Array.isArray(cData) ? cData : []);
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

  // 3-Second Field Error Thrower State
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const errorTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showErrors = (errors: Record<string, string>) => {
    setFormErrors(errors);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = setTimeout(() => {
      setFormErrors({});
    }, 3000);
  };

  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!facultyForm.name.trim()) errs.faculty_name = "Full name is required";
    if (!facultyForm.phone.trim()) errs.faculty_phone = "Contact phone number is required";
    if (!facultyForm.email.trim()) {
      errs.faculty_email = "Official email address is required";
    } else if (!facultyForm.email.includes("@")) {
      errs.faculty_email = "Please provide a valid email address";
    }
    if (!facultyForm.designation.trim()) errs.faculty_designation = "Official designation is required";
    if (!facultyForm.salary || Number(facultyForm.salary) <= 0) errs.faculty_salary = "Valid monthly basic salary is required";
    if (facultyForm.createLogin && !facultyForm.password.trim()) {
      errs.faculty_password = "Password is required when login provisioning is active";
    }

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

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
      showErrors({ faculty_form: err.message || "Failed to add faculty member" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = (id: string, name: string) => {
    setConfirmModal({
      open: true,
      title: "Remove Faculty Member?",
      description: `Remove faculty member "${name}" from active institutional employee records?`,
      confirmLabel: "Remove Staff",
      variant: "destructive",
      itemDetails: {
        label: "Faculty Staff",
        title: name,
        badge: "Staff Profile",
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await erpApi.deleteStaff(id);
          showToast("Staff record removed.");
          setConfirmModal((prev) => ({ ...prev, open: false }));
          await loadData();
        } catch (err: any) {
          showToast(err.message || "Failed to delete staff");
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const openEditFacultyModal = (staff: any) => {
    setEditingStaff(staff);
    setEditFacultyForm({
      name: staff.name || "",
      gender: staff.gender || "MALE",
      dob: staff.dob ? new Date(staff.dob).toISOString().split("T")[0] : "",
      bloodGroup: staff.bloodGroup || "O+",
      phone: staff.phone || "",
      email: staff.email || "",
      aadharNumber: staff.aadharNumber || "",
      photoUrl: staff.photoUrl || "",
      address: staff.address || "",
      emergencyPhone: staff.emergencyPhone || "",
      employeeCode: staff.employeeCode || "",
      role: staff.role || "TEACHER",
      designation: staff.designation || "Teacher",
      departmentId: staff.departmentId || "",
      qualification: staff.qualification || "",
      specialization: staff.specialization || "",
      experienceYears: String(staff.experienceYears !== undefined ? staff.experienceYears : 5),
      employmentType: staff.employmentType || "FULL_TIME",
      salary: String(staff.salary || 45000),
      status: staff.status || "ACTIVE",
    });
    // Set currently taught subjects IDs
    const currentSubjectIds = (staff.taughtSubjects || []).map((s: any) => s.id);
    setSelectedSubjectIds(currentSubjectIds);
    // Default grade selector to first taught subject's grade, or first class
    const initialGradeId =
      staff.taughtSubjects?.[0]?.gradeClass?.id ||
      staff.taughtSubjects?.[0]?.classId ||
      classes[0]?.id ||
      "";
    setEditFacultyGradeId(initialGradeId);
    setIsEditFacultyOpen(true);
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleUpdateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const errs: Record<string, string> = {};
    if (!editFacultyForm.name.trim()) errs.edit_name = "Full name is required";
    if (!editFacultyForm.phone.trim()) errs.edit_phone = "Contact phone number is required";
    if (!editFacultyForm.email.trim()) {
      errs.edit_email = "Official email address is required";
    } else if (!editFacultyForm.email.includes("@")) {
      errs.edit_email = "Please provide a valid email address";
    }
    if (!editFacultyForm.designation.trim()) errs.edit_designation = "Official designation is required";
    if (!editFacultyForm.salary || Number(editFacultyForm.salary) < 0) {
      errs.edit_salary = "Valid monthly basic salary is required";
    }

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setEditSubmitting(true);
    try {
      await erpApi.updateStaff(editingStaff.id, {
        ...editFacultyForm,
        subjectIds: selectedSubjectIds,
      });

      showToast(`Faculty profile and teaching subject mappings for "${editFacultyForm.name}" updated. Timetable synchronized.`);
      setIsEditFacultyOpen(false);
      setEditingStaff(null);
      await loadData();
    } catch (err: any) {
      showErrors({ edit_form: err.message || "Failed to update faculty member" });
    } finally {
      setEditSubmitting(false);
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
      showToast(err.message || "Failed to run payroll");
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
      {/* Modern In-App Confirmation Modal */}
      <ConfirmDialog
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal((prev) => ({ ...prev, open }))}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        icon={confirmModal.icon}
        itemDetails={confirmModal.itemDetails}
        isLoading={confirmLoading}
        onConfirm={confirmModal.onConfirm}
      />
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
          {/* <Button
            size="sm"
            variant="outline"
            onClick={handleRunPayroll}
            className="border-zinc-300 hover:bg-zinc-100 text-xs font-mono"
          >
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            Run Monthly Payroll
          </Button> */}
          <Button
            size="sm"
            onClick={() => setIsAddFacultyOpen(true)}
            className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Enroll Staff / User
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
          {/* <TabsTrigger
            value="payroll"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            Payroll & Digital Payslips
          </TabsTrigger> */}
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
                      <TableHead className="text-xs font-mono text-zinc-500">ROLE &amp; DESIGNATION</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">QUALIFICATION</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">SUBJECTS CAN HANDLE</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">CONTACT</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">LOGIN ACCESS</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500">STATUS</TableHead>
                      <TableHead className="text-xs font-mono text-zinc-500 text-right">ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-xs text-zinc-400">
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
                            <div className="text-zinc-800 font-mono text-[11px] font-medium">
                              {staff.qualification || "Graduate"}
                            </div>
                            {staff.specialization && (
                              <div className="text-[10px] text-zinc-500">
                                Spec: {staff.specialization}
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            {staff.taughtSubjects && staff.taughtSubjects.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-[220px]">
                                {staff.taughtSubjects.map((sub: any) => (
                                  <Badge
                                    key={sub.id}
                                    variant="outline"
                                    className="text-[10px] font-mono border-zinc-300 bg-zinc-50 text-zinc-900 px-1.5 py-0"
                                  >
                                    {sub.gradeClass?.name || "Grade"}: {sub.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-400 text-[10px] font-mono italic">No subjects assigned</span>
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
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditFacultyModal(staff)}
                                className="h-7 px-2 text-xs border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-medium"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1 text-zinc-600" /> Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteStaff(staff.id, staff.name)}
                                className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
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
          <form noValidate onSubmit={handleAddFaculty}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Faculty & Staff Enrollment Form</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Complete institutional profile registration and ERP access configuration.
              </DialogDescription>
            </DialogHeader>

            {formErrors.faculty_form && (
              <p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2 animate-in fade-in">
                {formErrors.faculty_form}
              </p>
            )}

            <div className="space-y-4 py-4 text-xs">
              {/* SECTION 1: PERSONAL DETAILS */}
              <div>
                <div className="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono border-b border-zinc-200 pb-1 mb-2">
                  1. Personal & Identity
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Full Name <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Dr. Priya Sundaram"
                      value={facultyForm.name}
                      onChange={(e) => {
                        clearFieldError("faculty_name");
                        setFacultyForm({ ...facultyForm, name: e.target.value });
                      }}
                      className={formErrors.faculty_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.faculty_name && (
                      <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                        {formErrors.faculty_name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Gender</Label>
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
                    <Label className="text-xs font-medium">Date of Birth</Label>
                    <Input
                      type="date"
                      value={facultyForm.dob}
                      onChange={(e) => setFacultyForm({ ...facultyForm, dob: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Blood Group</Label>
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
                    <Label className="text-xs font-medium">Aadhar Card Number</Label>
                    <Input
                      placeholder="12-digit UIDAI"
                      value={facultyForm.aadharNumber}
                      onChange={(e) => setFacultyForm({ ...facultyForm, aadharNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <Label className="text-xs font-medium">Faculty Photo URL</Label>
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
                    <Label className="text-xs font-medium">
                      Phone Number <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="+91 9876543210"
                      value={facultyForm.phone}
                      onChange={(e) => {
                        clearFieldError("faculty_phone");
                        setFacultyForm({ ...facultyForm, phone: e.target.value });
                      }}
                      className={formErrors.faculty_phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.faculty_phone && (
                      <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                        {formErrors.faculty_phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Official Email <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="priya.s@greenwoodhigh.edu"
                      value={facultyForm.email}
                      onChange={(e) => {
                        clearFieldError("faculty_email");
                        setFacultyForm({ ...facultyForm, email: e.target.value });
                      }}
                      className={formErrors.faculty_email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.faculty_email && (
                      <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                        {formErrors.faculty_email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Emergency Contact</Label>
                    <Input
                      placeholder="+91 9444012345 (Spouse/Parent)"
                      value={facultyForm.emergencyPhone}
                      onChange={(e) => setFacultyForm({ ...facultyForm, emergencyPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <Label className="text-xs font-medium">Residential Address</Label>
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
                    <Label className="text-xs font-medium">Employee Code</Label>
                    <Input
                      placeholder="e.g. FAC-1021"
                      value={facultyForm.employeeCode}
                      onChange={(e) => setFacultyForm({ ...facultyForm, employeeCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">System Role</Label>
                    <Select
                      value={facultyForm.role}
                      onValueChange={(val) => setFacultyForm({ ...facultyForm, role: val })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="DRIVER">Driver</SelectItem>
                        <SelectItem value="TRANSPORT_MANAGER">Transport Manager</SelectItem>
                        <SelectItem value="STAFF">Administrative Staff / Manager</SelectItem>
                        <SelectItem value="PRINCIPAL">Principal / Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Designation <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="PGT Mathematics Teacher"
                      value={facultyForm.designation}
                      onChange={(e) => {
                        clearFieldError("faculty_designation");
                        setFacultyForm({ ...facultyForm, designation: e.target.value });
                      }}
                      className={formErrors.faculty_designation ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.faculty_designation && (
                      <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                        {formErrors.faculty_designation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Highest Qualification</Label>
                    <Input
                      placeholder="M.Sc, B.Ed, M.Phil"
                      value={facultyForm.qualification}
                      onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Subject / Specialization</Label>
                    <Input
                      placeholder="e.g. Mathematics & Statistics"
                      value={facultyForm.specialization}
                      onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Experience (Years)</Label>
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
                    <Label className="text-xs font-medium">Employment Type</Label>
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
                    <Label className="text-xs font-medium">Joining Date</Label>
                    <Input
                      type="date"
                      value={facultyForm.joiningDate}
                      onChange={(e) => setFacultyForm({ ...facultyForm, joiningDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Monthly Basic Salary (₹) <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={facultyForm.salary}
                      onChange={(e) => {
                        clearFieldError("faculty_salary");
                        setFacultyForm({ ...facultyForm, salary: e.target.value });
                      }}
                      className={formErrors.faculty_salary ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.faculty_salary && (
                      <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                        {formErrors.faculty_salary}
                      </p>
                    )}
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
                        <Label className="text-xs font-medium">
                          Initial Password <span className="text-red-500 font-bold">*</span>
                        </Label>
                        <Input
                          type="text"
                          value={facultyForm.password}
                          onChange={(e) => {
                            clearFieldError("faculty_password");
                            setFacultyForm({ ...facultyForm, password: e.target.value });
                          }}
                          className={formErrors.faculty_password ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {formErrors.faculty_password && (
                          <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                            {formErrors.faculty_password}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Account Tier</Label>
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

      {/* =========================================================================
          DIALOG: EDIT FACULTY MEMBER & TEACHING ALLOTMENTS
         ========================================================================= */}
      <Dialog open={isEditFacultyOpen} onOpenChange={setIsEditFacultyOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Pencil className="h-4 w-4 text-zinc-900" />
              Edit Faculty Member &amp; Subject Assignments
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Update faculty profile details and assign the curriculum subjects and grades this teacher can handle for teaching.
              The Timetable Matrix in Academics will use these assignments to allocate teachers to classes.
            </DialogDescription>
          </DialogHeader>

          {editingStaff && (
            <form onSubmit={handleUpdateFaculty} noValidate className="space-y-4 py-2">
              {formErrors.edit_form && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formErrors.edit_form}</span>
                </div>
              )}

              {/* Section 1: Core Profile & Contact */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                    1. Profile &amp; Employment Details
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                    ID: {editingStaff.employeeCode}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Full Name <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      value={editFacultyForm.name}
                      onChange={(e) => {
                        clearFieldError("edit_name");
                        setEditFacultyForm({ ...editFacultyForm, name: e.target.value });
                      }}
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                    {formErrors.edit_name && (
                      <p className="text-[10px] text-red-600 animate-in fade-in flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.edit_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Designation <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      value={editFacultyForm.designation}
                      onChange={(e) => {
                        clearFieldError("edit_designation");
                        setEditFacultyForm({ ...editFacultyForm, designation: e.target.value });
                      }}
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                    {formErrors.edit_designation && (
                      <p className="text-[10px] text-red-600 animate-in fade-in flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.edit_designation}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Department</Label>
                    <Select
                      value={editFacultyForm.departmentId}
                      onValueChange={(val) => setEditFacultyForm({ ...editFacultyForm, departmentId: val })}
                    >
                      <SelectTrigger className="h-8 text-xs border-zinc-300 bg-white">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Phone Number <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      value={editFacultyForm.phone}
                      onChange={(e) => {
                        clearFieldError("edit_phone");
                        setEditFacultyForm({ ...editFacultyForm, phone: e.target.value });
                      }}
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                    {formErrors.edit_phone && (
                      <p className="text-[10px] text-red-600 animate-in fade-in flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.edit_phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Email Address <span className="text-red-500 font-bold">*</span>
                    </Label>
                    <Input
                      value={editFacultyForm.email}
                      onChange={(e) => {
                        clearFieldError("edit_email");
                        setEditFacultyForm({ ...editFacultyForm, email: e.target.value });
                      }}
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                    {formErrors.edit_email && (
                      <p className="text-[10px] text-red-600 animate-in fade-in flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.edit_email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Employment Status</Label>
                    <Select
                      value={editFacultyForm.status}
                      onValueChange={(val) => setEditFacultyForm({ ...editFacultyForm, status: val })}
                    >
                      <SelectTrigger className="h-8 text-xs border-zinc-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="ON_LEAVE">ON LEAVE</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Qualification</Label>
                    <Input
                      value={editFacultyForm.qualification}
                      onChange={(e) =>
                        setEditFacultyForm({ ...editFacultyForm, qualification: e.target.value })
                      }
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Primary Specialization</Label>
                    <Input
                      value={editFacultyForm.specialization}
                      onChange={(e) => setEditFacultyForm({ ...editFacultyForm, specialization: e.target.value })}
                      placeholder="e.g. Mathematics, Physics"
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Monthly Salary (₹)</Label>
                    <Input
                      type="number"
                      value={editFacultyForm.salary}
                      onChange={(e) => setEditFacultyForm({ ...editFacultyForm, salary: e.target.value })}
                      className="h-8 text-xs border-zinc-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">System Role</Label>
                    <Select
                      value={editFacultyForm.role}
                      onValueChange={(val) => setEditFacultyForm({ ...editFacultyForm, role: val })}
                    >
                      <SelectTrigger className="h-8 text-xs border-zinc-300 bg-white">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="FACULTY">Faculty</SelectItem>
                        <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                        <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                        <SelectItem value="ADMIN">Admin Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Aadhar Number</Label>
                    <Input
                      value={editFacultyForm.aadharNumber}
                      onChange={(e) =>
                        setEditFacultyForm({ ...editFacultyForm, aadharNumber: e.target.value })
                      }
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">Emergency Phone</Label>
                    <Input
                      value={editFacultyForm.emergencyPhone}
                      onChange={(e) =>
                        setEditFacultyForm({ ...editFacultyForm, emergencyPhone: e.target.value })
                      }
                      className="h-8 text-xs border-zinc-300 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-zinc-700">Residential Address</Label>
                  <Input
                    value={editFacultyForm.address}
                    onChange={(e) => setEditFacultyForm({ ...editFacultyForm, address: e.target.value })}
                    className="h-8 text-xs border-zinc-300 bg-white"
                  />
                </div>
              </div>

              {/* Section 2: Subjects & Grades Handled (Teaching Competency) */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-zinc-700" />
                      2. Subjects &amp; Grades Handled (Teaching Competency)
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Select all curriculum subjects and grades this faculty member can handle/teach.
                      The Timetable Matrix Generator will use these assigned subjects to schedule periods and allocate teachers for each class.
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-mono shrink-0 ml-2">
                    {selectedSubjectIds.length} Subject{selectedSubjectIds.length === 1 ? "" : "s"} Handled
                  </Badge>
                </div>

                {classes.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-400 bg-zinc-50 rounded-lg border border-zinc-200">
                    No academic classes found. Configure grades and subjects in Academic Setup first.
                  </div>
                ) : (
                  (() => {
                    const activeGrade =
                      classes.find((c) => c.id === editFacultyGradeId) || classes[0];
                    const activeSubjects = activeGrade?.subjects || [];

                    return (
                      <div className="space-y-3">
                        {/* Grade Selector Bar */}
                        <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs font-semibold text-zinc-800 shrink-0">
                              Choose Grade:
                            </Label>
                            <Select
                              value={editFacultyGradeId || activeGrade?.id}
                              onValueChange={setEditFacultyGradeId}
                            >
                              <SelectTrigger className="h-8 w-56 text-xs font-medium border-zinc-300 bg-white shadow-2xs">
                                <SelectValue placeholder="Select Grade..." />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map((cls) => {
                                  const subCount = (cls.subjects || []).length;
                                  const selectedInGrade = (cls.subjects || []).filter((s: any) =>
                                    selectedSubjectIds.includes(s.id)
                                  ).length;
                                  return (
                                    <SelectItem key={cls.id} value={cls.id}>
                                      {cls.name} ({cls.code}) — {subCount} subjects
                                      {selectedInGrade > 0 ? ` [${selectedInGrade} assigned]` : ""}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Quick Grade Pill Switcher */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {classes.map((cls) => {
                              const isCurrent = (editFacultyGradeId || activeGrade?.id) === cls.id;
                              const selectedCount = (cls.subjects || []).filter((s: any) =>
                                selectedSubjectIds.includes(s.id)
                              ).length;
                              return (
                                <button
                                  key={cls.id}
                                  type="button"
                                  onClick={() => setEditFacultyGradeId(cls.id)}
                                  className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1 border",
                                    isCurrent
                                      ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs"
                                      : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                                  )}
                                >
                                  <span>{cls.code || cls.name}</span>
                                  {selectedCount > 0 && (
                                    <span
                                      className={cn(
                                        "text-[10px] px-1 py-0 rounded-full font-bold",
                                        isCurrent
                                          ? "bg-emerald-500 text-white"
                                          : "bg-emerald-100 text-emerald-800"
                                      )}
                                    >
                                      {selectedCount}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Filtered Subjects for Selected Grade Only */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
                            <span>
                              Subjects for <strong className="text-zinc-900">{activeGrade?.name}</strong> ({activeGrade?.code}):
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {activeSubjects.length} subject{activeSubjects.length === 1 ? "" : "s"} available
                            </span>
                          </div>

                          {activeSubjects.length === 0 ? (
                            <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-50 rounded-lg border border-dashed border-zinc-200 font-mono">
                              No subjects configured for {activeGrade?.name || "this grade"}. Configure subjects in Academic Setup.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                              {activeSubjects.map((sub: any) => {
                                const isSelected = selectedSubjectIds.includes(sub.id);
                                const isAssignedToOther =
                                  sub.teacherId &&
                                  sub.teacherId !== editingStaff.id &&
                                  staffList.find((s) => s.id === sub.teacherId);
                                const otherTeacher = isAssignedToOther
                                  ? staffList.find((s) => s.id === sub.teacherId)
                                  : null;

                                return (
                                  <div
                                    key={sub.id}
                                    onClick={() => toggleSubject(sub.id)}
                                    className={cn(
                                      "p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 shadow-2xs select-none",
                                      isSelected
                                        ? "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500"
                                        : "border-zinc-200 bg-white hover:border-zinc-300"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                                        isSelected
                                          ? "bg-emerald-600 border-emerald-600 text-white"
                                          : "border-zinc-300 bg-white"
                                      )}
                                    >
                                      {isSelected && <Check className="h-3 w-3" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="font-bold text-zinc-950 truncate">{sub.name}</span>
                                        <Badge variant="outline" className="text-[9px] font-mono border-zinc-200 shrink-0">
                                          {sub.code}
                                        </Badge>
                                      </div>

                                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                        {sub.periodsPerWeek ? `${sub.periodsPerWeek} periods / wk curriculum load` : "Standard curriculum load"}
                                      </div>

                                      {isSelected ? (
                                        <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                                          <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                                          <span>Can handle this subject</span>
                                        </div>
                                      ) : otherTeacher ? (
                                        <div className="text-[10px] text-amber-700 italic mt-1 truncate">
                                          Currently assigned to: {otherTeacher.name}
                                        </div>
                                      ) : (
                                        <div className="text-[10px] text-zinc-400 italic mt-1">
                                          Available to assign
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* All Currently Selected Subjects Across Grades */}
                        {selectedSubjectIds.length > 0 && (
                          <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                            <div className="text-[11px] font-mono font-medium text-zinc-500">
                              Assigned Subjects Portfolio ({selectedSubjectIds.length}):
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {selectedSubjectIds.map((subId) => {
                                let foundSub: any = null;
                                let foundClass: any = null;
                                for (const cls of classes) {
                                  const s = (cls.subjects || []).find((sub: any) => sub.id === subId);
                                  if (s) {
                                    foundSub = s;
                                    foundClass = cls;
                                    break;
                                  }
                                }
                                if (!foundSub) return null;
                                return (
                                  <Badge
                                    key={subId}
                                    variant="outline"
                                    className="text-[10px] font-mono border-emerald-300 bg-emerald-50 text-emerald-900 gap-1 pl-1.5 pr-1 py-0.5"
                                  >
                                    <span className="font-semibold">{foundClass?.code || foundClass?.name}:</span> {foundSub.name}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSubject(subId);
                                      }}
                                      className="hover:text-red-600 ml-0.5 text-zinc-400 hover:text-red-600 font-bold"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditFacultyOpen(false)}
                  className="h-8 text-xs border-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editSubmitting}
                  size="sm"
                  className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800 font-medium"
                >
                  {editSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                  Save Faculty &amp; Subject Assignments
                </Button>
              </DialogFooter>
            </form>
          )}
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
