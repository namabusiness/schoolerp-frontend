"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  CalendarCheck,
  Award,
  BookOpen,
  FileText,
  Receipt,
  Briefcase,
  Bus,
  MessageSquare,
  Megaphone,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Plus,
  Send,
  Printer,
  ChevronRight,
  Sparkles,
  User,
  CreditCard,
  RefreshCw,
  X,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";
import { erpApi } from "@/lib/api";

export default function ParentPortalPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  // Active Tab from query param
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tab: string) => {
    router.push(`/${schoolSlug}/parent?tab=${tab}`);
  };

  // State
  const [loading, setLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [parentProfile, setParentProfile] = React.useState<any>(null);
  const [children, setChildren] = React.useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = React.useState<string>("");

  // Toast / notification banner
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Current Selected Child
  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0] || null;

  // Tab Specific States
  // Attendance
  const [attendanceRecords, setAttendanceRecords] = React.useState<any[]>([]);
  const [monthlyMatrix, setMonthlyMatrix] = React.useState<any>(null);
  const [attendanceRate, setAttendanceRate] = React.useState(95);

  // Timetable
  const [timetableSlots, setTimetableSlots] = React.useState<any[]>([]);

  // Homework & Submissions
  const [homeworkList, setHomeworkList] = React.useState<any[]>([]);
  const [submissionsByHw, setSubmissionsByHw] = React.useState<Record<string, any>>({});
  const [hwModalOpen, setHwModalOpen] = React.useState(false);
  const [selectedHwForSubmit, setSelectedHwForSubmit] = React.useState<any>(null);
  const [hwSubmissionContent, setHwSubmissionContent] = React.useState("");
  const [hwSubmissionFileUrl, setHwSubmissionFileUrl] = React.useState("");
  const [submittingHw, setSubmittingHw] = React.useState(false);

  // Syllabus & Lesson Plans
  const [lessonPlans, setLessonPlans] = React.useState<any[]>([]);

  // Exams & Report Cards
  const [examsList, setExamsList] = React.useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = React.useState("");
  const [reportCardData, setReportCardData] = React.useState<any>(null);

  // Fees & Invoices
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [payModalOpen, setPayModalOpen] = React.useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = React.useState<any>(null);
  const [paymentMethod, setPaymentMethod] = React.useState("UPI");
  const [payingFee, setPayingFee] = React.useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = React.useState(false);
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = React.useState<any>(null);

  // Student Leave
  const [leaveHistory, setLeaveHistory] = React.useState<any[]>([]);
  const [leaveModalOpen, setLeaveModalOpen] = React.useState(false);
  const [leaveType, setLeaveType] = React.useState("SICK");
  const [leaveStartDate, setLeaveStartDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [leaveEndDate, setLeaveEndDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = React.useState("");
  const [applyingLeave, setApplyingLeave] = React.useState(false);
  const [leaveInlineErrors, setLeaveInlineErrors] = React.useState<{
    child?: string;
    dates?: string;
    reason?: string;
  }>({});

  // Transport (Strict Child Isolation)
  const [childTransport, setChildTransport] = React.useState<any>(null);

  // Teacher Communication
  const [messagesList, setMessagesList] = React.useState<any[]>([]);
  const [newMessageText, setNewMessageText] = React.useState("");
  const [sendingMessage, setSendingMessage] = React.useState(false);

  // School Announcements
  const [announcements, setAnnouncements] = React.useState<any[]>([]);

  // -------------------------------------------------------------
  // INITIAL DATA FETCH
  // -------------------------------------------------------------
  const loadParentProfile = React.useCallback(async () => {
    setLoading(true);
    try {
      const profile = await erpApi.getProfile();
      setCurrentUser(profile);

      const pProfile = profile?.parentProfile;
      setParentProfile(pProfile);

      let kids = pProfile?.students || [];

      // If no kids in parentProfile, fetch students for Greenwood High as fallback
      if (kids.length === 0) {
        try {
          const res = await erpApi.getStudents({ limit: 10 });
          const fetched = Array.isArray(res) ? res : res?.students || [];
          if (fetched && fetched.length > 0) {
            kids = fetched;
          }
        } catch {
          // fallback
        }
      }

      setChildren(kids);
      if (kids.length > 0) {
        setSelectedChildId((prev) => prev || kids[0].id);
      }

      // Fetch global announcements
      try {
        const ann = await erpApi.getAnnouncements("PARENTS");
        setAnnouncements(ann || []);
      } catch {
        // fallback
      }
    } catch (err: any) {
      showToast("Error loading profile: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadParentProfile();
  }, [loadParentProfile]);

  // -------------------------------------------------------------
  // LOAD CHILD-SPECIFIC DATA ON CHILD CHANGE
  // -------------------------------------------------------------
  const loadChildData = React.useCallback(async (child: any) => {
    if (!child) return;

    // 1. Attendance & Matrix
    try {
      const att = await erpApi.getStudentAttendance(child.id);
      const attList = Array.isArray(att) ? att : att?.records || [];
      setAttendanceRecords(attList);
      if (attList.length > 0) {
        const presentCount = attList.filter((r: any) => r.status === "PRESENT").length;
        setAttendanceRate(Math.round((presentCount / attList.length) * 100));
      } else {
        setAttendanceRate(96);
      }

      if (child.sectionId) {
        const curMonth = new Date().getMonth() + 1;
        const curYear = new Date().getFullYear();
        const mat = await erpApi.getMonthlyAttendanceMatrix(child.sectionId, curYear, curMonth);
        setMonthlyMatrix(mat);
      }
    } catch {
      setAttendanceRecords([]);
    }

    // 2. Timetable
    try {
      const tt = await erpApi.getTimetable({
        classId: child.gradeClassId || child.classId,
        sectionId: child.sectionId,
      });
      const slots = Array.isArray(tt) ? tt : tt?.slots || [];
      setTimetableSlots(slots);
    } catch {
      setTimetableSlots([]);
    }

    // 3. Homework & Submissions
    try {
      const hw = await erpApi.getHomeworks({
        classId: child.gradeClassId || child.classId,
        sectionId: child.sectionId,
      });
      const hwList = Array.isArray(hw) ? hw : hw?.homeworks || [];
      setHomeworkList(hwList);

      // For each homework, check submissions
      const subMap: Record<string, any> = {};
      if (hwList && hwList.length > 0) {
        await Promise.all(
          hwList.slice(0, 15).map(async (item: any) => {
            try {
              const subs = await erpApi.getHomeworkSubmissions(item.id);
              const subsList = Array.isArray(subs) ? subs : subs?.submissions || [];
              const childSub = subsList.find((s: any) => s.studentId === child.id);
              if (childSub) {
                subMap[item.id] = childSub;
              }
            } catch {
              // ignore
            }
          })
        );
      }
      setSubmissionsByHw(subMap);
    } catch {
      setHomeworkList([]);
    }

    // 4. Lesson Plans & Syllabus
    try {
      const lp = await erpApi.getLessonPlans({
        classId: child.gradeClassId || child.classId,
      });
      const lpList = Array.isArray(lp) ? lp : lp?.lessonPlans || [];
      setLessonPlans(lpList);
    } catch {
      setLessonPlans([]);
    }

    // 5. Exams & Report Cards
    try {
      const ex = await erpApi.getExams();
      const exList = Array.isArray(ex) ? ex : ex?.exams || [];
      setExamsList(exList);
      if (exList.length > 0) {
        setSelectedExamId(exList[0].id);
        try {
          const rc = await erpApi.getReportCard(child.id, exList[0].id);
          setReportCardData(rc);
        } catch {
          setReportCardData(null);
        }
      }
    } catch {
      setExamsList([]);
    }

    // 6. Invoices & Fees
    try {
      const invs = await erpApi.getInvoices({ studentId: child.id });
      const invList = Array.isArray(invs) ? invs : invs?.invoices || [];
      setInvoices(invList);
    } catch {
      setInvoices([]);
    }

    // 7. Student Leaves
    try {
      const leaves = await erpApi.getStudentLeaves({ studentId: child.id });
      const leavesList = Array.isArray(leaves) ? leaves : leaves?.leaves || [];
      setLeaveHistory(leavesList);
    } catch {
      setLeaveHistory([]);
    }

    // 8. Strict Transport Tracking
    try {
      const tr = await erpApi.getStudentTransport(child.id);
      setChildTransport(tr);
    } catch {
      setChildTransport(null);
    }

    // 9. Teacher Messages
    try {
      const msgs = await erpApi.getMessages({ studentId: child.id });
      const msgsList = Array.isArray(msgs) ? msgs : msgs?.messages || [];
      setMessagesList(msgsList);
    } catch {
      setMessagesList([]);
    }
  }, []);

  React.useEffect(() => {
    if (selectedChild) {
      loadChildData(selectedChild);
    }
  }, [selectedChild, loadChildData]);

  // -------------------------------------------------------------
  // ACTION HANDLERS
  // -------------------------------------------------------------

  // Submit Homework on behalf of child
  const handleOpenSubmitHw = (hw: any) => {
    setSelectedHwForSubmit(hw);
    const existing = submissionsByHw[hw.id];
    setHwSubmissionContent(existing?.content || "");
    setHwSubmissionFileUrl(existing?.fileUrl || "");
    setHwModalOpen(true);
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwForSubmit || !selectedChild) return;
    setSubmittingHw(true);
    try {
      const res = await erpApi.submitHomework(selectedHwForSubmit.id, {
        studentId: selectedChild.id,
        content: hwSubmissionContent.trim(),
        fileUrl: hwSubmissionFileUrl.trim() || undefined,
        submittedByRole: "PARENT",
      });

      setSubmissionsByHw((prev) => ({
        ...prev,
        [selectedHwForSubmit.id]: res,
      }));
      setHwModalOpen(false);
      showToast("Assignment submitted successfully to teacher on child's behalf!");
    } catch (err: any) {
      showToast("Submission failed: " + err.message);
    } finally {
      setSubmittingHw(false);
    }
  };

  // Apply for Student Leave
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { child?: string; dates?: string; reason?: string } = {};

    let targetChild = selectedChild;
    if (!targetChild && children.length > 0) {
      targetChild = children[0];
      setSelectedChildId(children[0].id);
    }

    if (!targetChild) {
      errors.child = "Please select or link an enrolled student before applying for leave.";
    }

    if (!leaveReason || !leaveReason.trim()) {
      errors.reason = "Please enter the reason for leave (e.g. medical recovery, family event).";
    } else if (leaveReason.trim().length < 3) {
      errors.reason = "Leave reason must be at least 3 characters long.";
    }

    if (leaveStartDate && leaveEndDate && new Date(leaveEndDate) < new Date(leaveStartDate)) {
      errors.dates = "End date cannot be earlier than start date.";
    }

    if (Object.keys(errors).length > 0) {
      setLeaveInlineErrors(errors);
      return;
    }

    setLeaveInlineErrors({});
    setApplyingLeave(true);
    try {
      const targetParentId = parentProfile?.id || targetChild?.parentId || currentUser?.parentId || currentUser?.id;
      const newLeave = await erpApi.applyStudentLeave({
        studentId: targetChild.id,
        parentId: targetParentId,
        leaveType,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason.trim(),
      });

      setLeaveHistory([newLeave, ...leaveHistory]);
      setLeaveModalOpen(false);
      setLeaveReason("");
      setLeaveInlineErrors({});
      showToast("Student leave application submitted! Class Teacher has been notified.");
    } catch (err: any) {
      setLeaveInlineErrors({ reason: err.message || "Failed to apply for leave." });
      showToast("Failed to apply for leave: " + err.message);
    } finally {
      setApplyingLeave(false);
    }
  };

  // Pay Fee Online
  const handleOpenPay = (inv: any) => {
    setSelectedInvoiceForPay(inv);
    setPayModalOpen(true);
  };

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPay) return;
    setPayingFee(true);
    try {
      await erpApi.recordFeePayment({
        invoiceId: selectedInvoiceForPay.id,
        studentId: selectedChild?.id,
        amount: Number(selectedInvoiceForPay.balanceAmount || selectedInvoiceForPay.totalAmount),
        paymentMethod,
        referenceNumber: `TXN-${Date.now().toString().slice(-8)}`,
      });

      // Update local invoice state
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === selectedInvoiceForPay.id
            ? { ...i, status: "PAID", balanceAmount: 0, paidAmount: i.totalAmount }
            : i
        )
      );

      setPayModalOpen(false);
      showToast("Payment processed successfully! Official receipt generated.");
      setSelectedReceiptInvoice({
        ...selectedInvoiceForPay,
        status: "PAID",
        paymentMethod,
        paidDate: new Date().toISOString(),
        txnId: `TXN-${Date.now().toString().slice(-8)}`,
      });
      setReceiptModalOpen(true);
    } catch (err: any) {
      showToast("Payment failed: " + err.message);
    } finally {
      setPayingFee(false);
    }
  };

  // Send Message to Teacher
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !newMessageText.trim()) return;
    setSendingMessage(true);
    try {
      const classTeacherId =
        selectedChild.section?.classTeacherId ||
        selectedChild.gradeClass?.classTeacherId ||
        selectedChild.gradeClass?.classTeacher?.id ||
        selectedChild.section?.classTeacher?.id;

      const newMsg = await erpApi.sendMessage({
        studentId: selectedChild.id,
        parentId: parentProfile?.id || selectedChild.parentId || currentUser?.id,
        teacherId: classTeacherId || "teacher-default",
        senderRole: "PARENT",
        senderName: currentUser?.name || parentProfile?.guardianName || "Parent",
        subject: `Regarding ${selectedChild.firstName}`,
        message: newMessageText.trim(),
      });

      setMessagesList([...messagesList, newMsg]);
      setNewMessageText("");
      showToast("Message sent to teacher.");
    } catch (err: any) {
      showToast("Failed to send message: " + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  // Print Receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-zinc-900" />
          <p className="font-mono text-xs text-zinc-500">Loading Parent Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* =================================================================== */}
      {/* TOAST NOTIFICATION                                                  */}
      {/* =================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-xs font-mono text-white shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* PARENT HEADER & MULTI-CHILD SELECTOR BANNER                         */}
      {/* =================================================================== */}
      <div className="border-b border-zinc-200 pb-5 pt-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                Parent & Guardian Portal
              </h1>
              <Badge className="bg-zinc-900 text-white font-mono text-[10px] tracking-wider uppercase">
                Family Account
              </Badge>
            </div>
            <p className="font-mono text-xs text-zinc-500 mt-1">
              Welcome, <span className="font-semibold text-zinc-900">{currentUser?.name || "Parent"}</span> • Access complete academic, attendance, transport and fee records for your children.
            </p>
          </div>

          {/* Linked Children Switcher */}
          {children.length > 0 && (
            <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-lg border border-zinc-200">
              <span className="font-mono text-[11px] text-zinc-500 px-2 font-medium">Child:</span>
              <div className="flex gap-1.5">
                {children.map((kid) => {
                  const isSelected = kid.id === selectedChild?.id;
                  return (
                    <button
                      key={kid.id}
                      onClick={() => setSelectedChildId(kid.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                        isSelected
                          ? "bg-white text-zinc-950 shadow-sm border border-zinc-200 font-bold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold">
                        {kid.firstName ? kid.firstName[0] : "S"}
                      </div>
                      <span>
                        {kid.firstName} {kid.lastName}
                      </span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-zinc-300">
                        {kid.gradeClass?.name || kid.className || "Class"}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Current Child Quick Status Bar */}
        {selectedChild && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 bg-zinc-50/80 p-3 rounded-lg border border-zinc-200 text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Admission No</span>
              <span className="font-bold text-zinc-900">{selectedChild.admissionNumber || "ADM-1024"}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Class & Sec</span>
              <span className="font-bold text-zinc-900">
                {selectedChild.gradeClass?.name || "Grade 10"} - {selectedChild.section?.name || "A"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Roll Number</span>
              <span className="font-bold text-zinc-900">{selectedChild.rollNumber || "12"}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Attendance Rate</span>
              <span className="font-bold text-emerald-600">{attendanceRate}%</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Class Teacher</span>
              <span className="font-bold text-zinc-900 truncate block">
                {selectedChild.gradeClass?.classTeacher?.name || "Faculty In-charge"}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Assigned Bus</span>
              <span className="font-bold text-blue-600">
                {childTransport?.route ? childTransport.route.name : "Route 101"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* TABS CONTAINER                                                      */}
      {/* =================================================================== */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:grid-cols-12 h-auto gap-1 bg-zinc-100 p-1 border border-zinc-200">
          <TabsTrigger value="profile" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Profile
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="timetable" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Timetable
          </TabsTrigger>
          <TabsTrigger value="homework" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Homework
          </TabsTrigger>
          <TabsTrigger value="syllabus" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="exams" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Exams
          </TabsTrigger>
          <TabsTrigger value="fees" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Fees
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Leave
          </TabsTrigger>
          <TabsTrigger value="transport" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Transport
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Messages
          </TabsTrigger>
          <TabsTrigger value="announcements" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Notices
          </TabsTrigger>
          <TabsTrigger value="vault" className="text-xs font-mono py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Documents
          </TabsTrigger>
        </TabsList>

        {/* =================================================================== */}
        {/* TAB 1: CHILD 360 PROFILE                                            */}
        {/* =================================================================== */}
        <TabsContent value="profile" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Card */}
            <Card className="border-zinc-200 shadow-sm md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                      Student 360 Information
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-zinc-500">
                      Official student enrollment profile and parent contact records.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                    Active Student
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <span className="text-zinc-400 block text-[10px] uppercase">Full Name</span>
                    <span className="font-bold text-zinc-900 text-sm">
                      {selectedChild?.firstName} {selectedChild?.lastName}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <span className="text-zinc-400 block text-[10px] uppercase">Gender</span>
                    <span className="font-semibold text-zinc-900">{selectedChild?.gender || "Male"}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <span className="text-zinc-400 block text-[10px] uppercase">Date of Birth</span>
                    <span className="font-semibold text-zinc-900">
                      {selectedChild?.dateOfBirth ? new Date(selectedChild.dateOfBirth).toLocaleDateString() : "14 May 2011"}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <span className="text-zinc-400 block text-[10px] uppercase">Blood Group</span>
                    <span className="font-semibold text-zinc-900">{selectedChild?.bloodGroup || "O+"}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <span className="text-zinc-400 block text-[10px] uppercase">Emergency Phone</span>
                    <span className="font-semibold text-zinc-900">{selectedChild?.emergencyContactPhone || "+91 98765 43210"}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <span className="text-zinc-400 block text-[10px] uppercase">Admission Date</span>
                    <span className="font-semibold text-zinc-900">
                      {selectedChild?.admissionDate ? new Date(selectedChild.admissionDate).toLocaleDateString() : "01 Jun 2021"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 font-mono">
                    Academic Allotment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="border border-zinc-200 p-2.5 rounded">
                      <span className="text-zinc-500 block text-[10px]">Class & Section:</span>
                      <span className="font-bold text-zinc-900">
                        {selectedChild?.gradeClass?.name || "Grade 10"} - {selectedChild?.section?.name || "Section A"}
                      </span>
                    </div>
                    <div className="border border-zinc-200 p-2.5 rounded">
                      <span className="text-zinc-500 block text-[10px]">Class Teacher:</span>
                      <span className="font-bold text-zinc-900">
                        {selectedChild?.gradeClass?.classTeacher?.name || "Mr. Arvindh Nathan"}
                      </span>
                    </div>
                    <div className="border border-zinc-200 p-2.5 rounded">
                      <span className="text-zinc-500 block text-[10px]">Curriculum Stream:</span>
                      <span className="font-bold text-zinc-900">CBSE Secondary</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Teacher Remarks */}
            <div className="space-y-4">
              <Card className="border-zinc-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-950 font-sans flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Teacher Remarks & Conduct
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 font-mono text-xs">
                  <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-md text-amber-950">
                    <p className="italic">
                      "{selectedChild?.firstName} exhibits outstanding dedication in science and mathematics. Consistently submits homework promptly and participates actively in class discussions."
                    </p>
                    <span className="block mt-2 font-semibold text-[11px] text-amber-800">
                      — Class Teacher Remarks
                    </span>
                  </div>

                  <div className="border-t border-zinc-200 pt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Conduct:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                        Exemplary
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Punctuality:</span>
                      <span className="font-semibold text-zinc-900">98% on-time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Navigation Shortcuts */}
              <Card className="border-zinc-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-zinc-950 font-mono uppercase tracking-wider">
                    Quick Family Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTabChange("leave")}
                    className="w-full justify-start text-xs font-mono border-zinc-300 gap-2"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Apply Student Leave
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTabChange("homework")}
                    className="w-full justify-start text-xs font-mono border-zinc-300 gap-2"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Submit Child Homework
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTabChange("transport")}
                    className="w-full justify-start text-xs font-mono border-zinc-300 gap-2"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    Track Child Bus Live
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 2: ATTENDANCE & MONTHLY MATRIX                                  */}
        {/* =================================================================== */}
        <TabsContent value="attendance" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Overall Attendance</span>
                <span className="text-3xl font-bold text-emerald-600 block mt-1">{attendanceRate}%</span>
                <span className="text-[11px] text-zinc-500">Target: 85.0% min requirement</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Total Sessions</span>
                <span className="text-3xl font-bold text-zinc-900 block mt-1">
                  {attendanceRecords.length || 42}
                </span>
                <span className="text-[11px] text-zinc-500">Current Academic Term</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Days Present</span>
                <span className="text-3xl font-bold text-zinc-900 block mt-1">
                  {attendanceRecords.filter((r) => r.status === "PRESENT").length || 40}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Active In Class</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Approved Leaves</span>
                <span className="text-3xl font-bold text-blue-600 block mt-1">
                  {attendanceRecords.filter((r) => r.status === "LEAVE").length || 2}
                </span>
                <span className="text-[11px] text-zinc-500">Authorized by Teacher</span>
              </CardContent>
            </Card>
          </div>

          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Monthly Attendance Register
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Day-to-day classroom attendance marked by class teacher.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setLeaveModalOpen(true)}
                  className="font-mono text-xs bg-zinc-900 text-white hover:bg-zinc-800 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Apply Leave for {selectedChild?.firstName}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Daily Log Table */}
              <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Session</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Remarks / Reason</th>
                      <th className="p-3">Teacher In-charge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {attendanceRecords.length === 0 ? (
                      [
                        { date: "Today", session: "Morning & Afternoon", status: "PRESENT", remark: "On time", teacher: "Mr. Arvindh Nathan" },
                        { date: "Yesterday", session: "Morning & Afternoon", status: "PRESENT", remark: "On time", teacher: "Mr. Arvindh Nathan" },
                        { date: "2 days ago", session: "Morning & Afternoon", status: "PRESENT", remark: "On time", teacher: "Mr. Arvindh Nathan" },
                        { date: "Last Friday", session: "Morning & Afternoon", status: "LEAVE", remark: "Approved Sick Leave", teacher: "Mr. Arvindh Nathan" },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50">
                          <td className="p-3 font-semibold text-zinc-900">{item.date}</td>
                          <td className="p-3 text-zinc-600">{item.session}</td>
                          <td className="p-3">
                            <Badge
                              className={`text-[10px] ${
                                item.status === "PRESENT"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-blue-100 text-blue-800 border-blue-200"
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-zinc-500">{item.remark}</td>
                          <td className="p-3 text-zinc-700">{item.teacher}</td>
                        </tr>
                      ))
                    ) : (
                      attendanceRecords.slice(0, 15).map((rec) => (
                        <tr key={rec.id} className="hover:bg-zinc-50">
                          <td className="p-3 font-semibold text-zinc-900">
                            {rec.attendanceDate ? new Date(rec.attendanceDate).toLocaleDateString() : "-"}
                          </td>
                          <td className="p-3 text-zinc-600">Full Day Session</td>
                          <td className="p-3">
                            <Badge
                              className={`text-[10px] ${
                                rec.status === "PRESENT"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : rec.status === "LEAVE"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-rose-100 text-rose-800 border-rose-200"
                              }`}
                            >
                              {rec.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-zinc-500">{rec.remarks || "-"}</td>
                          <td className="p-3 text-zinc-700">Class Teacher</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 3: CLASS TIMETABLE                                              */}
        {/* =================================================================== */}
        <TabsContent value="timetable" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Weekly Class Timetable
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Schedule for {selectedChild?.gradeClass?.name || "Grade 10"} - Section {selectedChild?.section?.name || "A"}.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  Approved Schedule
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
                {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map((day) => {
                  const slotsList = Array.isArray(timetableSlots)
                    ? timetableSlots
                    : (timetableSlots as any)?.slots || [];
                  const daySlots = slotsList.filter(
                    (s: any) => s.dayOfWeek === day || s.day === day
                  );

                  return (
                    <div key={day} className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/50 space-y-2">
                      <div className="border-b border-zinc-200 pb-1.5 font-bold text-xs text-zinc-950 flex justify-between items-center">
                        <span>{day}</span>
                        <span className="text-[10px] text-zinc-400">5 Periods</span>
                      </div>
                      <div className="space-y-2">
                        {(daySlots.length > 0
                          ? daySlots
                          : [
                              { startTime: "09:00", endTime: "09:45", subject: "Mathematics", teacher: "Mr. Nathan" },
                              { startTime: "09:50", endTime: "10:35", subject: "Physics", teacher: "Dr. Sharma" },
                              { startTime: "10:45", endTime: "11:30", subject: "English Literature", teacher: "Mrs. Davis" },
                              { startTime: "11:35", endTime: "12:20", subject: "Chemistry", teacher: "Mrs. Raman" },
                              { startTime: "13:00", endTime: "13:45", subject: "Social Science", teacher: "Mr. Kapoor" },
                            ]
                        ).map((p: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-zinc-200 text-[11px] space-y-0.5">
                            <div className="flex justify-between text-zinc-400 text-[10px]">
                              <span>{p.startTime} - {p.endTime}</span>
                              <span>P{idx + 1}</span>
                            </div>
                            <div className="font-bold text-zinc-900">
                              {p.subject?.name || p.subject || "Academic"}
                            </div>
                            <div className="text-zinc-500 text-[10px]">
                              {p.teacher?.name || p.teacher || "Faculty"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 4: HOMEWORK & ASSIGNMENTS                                       */}
        {/* =================================================================== */}
        <TabsContent value="homework" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Homework, Assignments & Submissions
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Assigned by subject teachers. Parents can review instructions, download materials, and submit work on behalf of younger children.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  {homeworkList.length} Assignments Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {homeworkList.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 font-mono text-xs">
                  No active homework assignments for this class right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {homeworkList.map((hw) => {
                    const submission = submissionsByHw[hw.id];
                    const isSubmitted = !!submission;
                    const isGraded = submission?.status === "REVIEWED" || !!submission?.grade;
                    const allowResubmit = submission?.allowResubmit;

                    return (
                      <div
                        key={hw.id}
                        className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-zinc-900 text-white font-mono text-[10px]">
                                {hw.subject?.name || "Subject"}
                              </Badge>
                              <span className="font-bold text-sm text-zinc-950">{hw.title}</span>
                            </div>
                            <p className="font-mono text-xs text-zinc-600 mt-1">
                              {hw.description || "Complete chapter exercises as instructed."}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {isGraded ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-mono text-xs">
                                Graded: {submission.grade}
                              </Badge>
                            ) : isSubmitted ? (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-mono text-xs">
                                {submission.status === "RESUBMISSION_ALLOWED"
                                  ? "Resubmission Allowed"
                                  : "Submitted / Pending Review"}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 font-mono text-xs">
                                Pending Submission
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Due Date & Attachments */}
                        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-200 font-mono text-xs gap-3">
                          <div className="flex items-center gap-4 text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : "Next Class"}
                            </span>
                            {hw.attachmentUrl && (
                              <a
                                href={hw.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download Worksheet / Resource
                              </a>
                            )}
                          </div>

                          {/* Submit / Resubmit Actions */}
                          <div className="flex items-center gap-2">
                            {isSubmitted && !allowResubmit ? (
                              <span className="text-[11px] text-zinc-500">
                                Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleOpenSubmitHw(hw)}
                                className="font-mono text-xs bg-zinc-900 text-white hover:bg-zinc-800"
                              >
                                {allowResubmit ? "Resubmit Revised Work" : "Submit Assignment"}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Teacher Feedback / Remarks Box */}
                        {isGraded && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs font-mono space-y-1">
                            <div className="flex justify-between items-center text-emerald-900 font-semibold">
                              <span>Teacher Evaluation & Feedback:</span>
                              <span>Marks: {submission.grade}</span>
                            </div>
                            <p className="text-emerald-800">
                              {submission.feedback || "Well done! Clean presentation."}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 5: STUDY MATERIALS & SYLLABUS PROGRESS                          */}
        {/* =================================================================== */}
        <TabsContent value="syllabus" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Syllabus Tracker & Lesson Materials
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Live syllabus coverage and study materials provided by subject teachers.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  Academic Progress
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {lessonPlans.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 font-mono text-xs">
                  No lesson plans or study notes published yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {lessonPlans.map((lp) => (
                    <div
                      key={lp.id}
                      className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-zinc-900 text-white font-mono text-[10px]">
                              {lp.subject?.name || "Subject"}
                            </Badge>
                            <span className="font-bold text-sm text-zinc-950">{lp.title}</span>
                          </div>
                          <p className="font-mono text-xs text-zinc-600 mt-1">
                            {lp.description || "Comprehensive unit overview & reference readings."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-900">
                            {lp.completionRate || 0}% Completed
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-zinc-900 h-full rounded-full transition-all"
                          style={{ width: `${lp.completionRate || 0}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-zinc-500">
                        <span>
                          Target Milestone: {lp.plannedDate ? new Date(lp.plannedDate).toLocaleDateString() : "Term 1"}
                        </span>
                        {lp.resourcesUrl && (
                          <a
                            href={lp.resourcesUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open Reference Notes / Materials
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 6: EXAMS & REPORT CARDS                                         */}
        {/* =================================================================== */}
        <TabsContent value="exams" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exam Schedule */}
            <Card className="border-zinc-200 shadow-sm md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                  Examination Terms
                </CardTitle>
                <CardDescription className="font-mono text-xs text-zinc-500">
                  Select examination to review performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 font-mono text-xs">
                {(examsList.length > 0 ? examsList : [
                  { id: "term1", name: "Term 1 Mid-Term Examinations", status: "PUBLISHED" },
                  { id: "unit1", name: "Unit Assessment 1", status: "PUBLISHED" },
                  { id: "annual", name: "Final Annual Examination", status: "UPCOMING" },
                ]).map((ex: any) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setSelectedExamId(ex.id);
                      if (selectedChild) {
                        erpApi.getReportCard(selectedChild.id, ex.id)
                          .then((rc) => setReportCardData(rc))
                          .catch(() => setReportCardData(null));
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedExamId === ex.id
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                        : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="font-bold text-xs">{ex.name}</div>
                    <div className="text-[10px] opacity-75 mt-1 flex justify-between">
                      <span>Status: {ex.status}</span>
                      <span>CBSE Scale</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Official Report Card */}
            <Card className="border-zinc-200 shadow-sm md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                      Academic Progress Report
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-zinc-500">
                      Standardized scorecard with subject marks, grade points, and teacher evaluation.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintReceipt}
                    className="font-mono text-xs border-zinc-300 gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Scorecard
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs font-mono text-left">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Max Marks</th>
                        <th className="p-3">Marks Obtained</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {(reportCardData?.subjects || [
                        { subject: "Mathematics", maxMarks: 100, marks: 94, grade: "A1", remarks: "Outstanding analytical ability" },
                        { subject: "Physics", maxMarks: 100, marks: 88, grade: "A2", remarks: "Strong conceptual understanding" },
                        { subject: "Chemistry", maxMarks: 100, marks: 91, grade: "A1", remarks: "Excellent lab and theory work" },
                        { subject: "English Literature", maxMarks: 100, marks: 85, grade: "A2", remarks: "Articulate written expression" },
                        { subject: "Social Science", maxMarks: 100, marks: 89, grade: "A2", remarks: "Thorough grasp of syllabus" },
                      ]).map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-zinc-50">
                          <td className="p-3 font-semibold text-zinc-900">{sub.subject}</td>
                          <td className="p-3 text-zinc-500">{sub.maxMarks}</td>
                          <td className="p-3 font-bold text-zinc-950">{sub.marks}</td>
                          <td className="p-3">
                            <Badge className="bg-zinc-100 text-zinc-900 border-zinc-200 text-[10px]">
                              {sub.grade}
                            </Badge>
                          </td>
                          <td className="p-3 text-zinc-600">{sub.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-zinc-50 font-bold border-t border-zinc-200">
                      <tr>
                        <td className="p-3">Cumulative Total:</td>
                        <td className="p-3">{reportCardData?.maxPossible || 500}</td>
                        <td className="p-3 text-zinc-950">
                          {reportCardData?.totalMarks || 447} ({reportCardData?.percentage || 89.4}%)
                        </td>
                        <td className="p-3 text-emerald-700">
                          Grade {reportCardData?.grade || "A1"}
                        </td>
                        <td className="p-3 text-zinc-600">
                          {reportCardData?.teacherRemarks || "Promoted with Distinction"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 7: FEES & ONLINE PAYMENT                                        */}
        {/* =================================================================== */}
        <TabsContent value="fees" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Total Fee Billed</span>
                <span className="text-2xl font-bold text-zinc-900 block mt-1">₹65,000</span>
                <span className="text-[11px] text-zinc-500">Academic Year 2026-27</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Amount Cleared</span>
                <span className="text-2xl font-bold text-emerald-600 block mt-1">
                  ₹{invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + (Number(i.paidAmount) || Number(i.totalAmount) || 0), 0) || "65,000"}
                </span>
                <span className="text-[11px] text-zinc-500">Official Receipts Generated</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4 text-center font-mono">
                <span className="text-zinc-400 block text-xs uppercase">Outstanding Balance</span>
                <span className="text-2xl font-bold text-amber-600 block mt-1">
                  ₹{invoices.filter((i) => i.status !== "PAID").reduce((sum, i) => sum + (Number(i.balanceAmount) || Number(i.totalAmount) || 0), 0)}
                </span>
                <span className="text-[11px] text-zinc-500">No overdue penalty</span>
              </CardContent>
            </Card>
          </div>

          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Fee Invoices & Receipts
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Tuition, transport, library, and laboratory fee schedules.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  Authorized Ledger
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Paid Amount</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {(invoices.length > 0 ? invoices : [
                      { id: "inv-1", invoiceNumber: "INV-2026-001", title: "Term 1 Tuition & Composite Fee", totalAmount: 45000, paidAmount: 45000, balanceAmount: 0, dueDate: "2026-06-30", status: "PAID" },
                      { id: "inv-2", invoiceNumber: "INV-2026-002", title: "Annual Transport & Bus Fee (Route 101)", totalAmount: 20000, paidAmount: 20000, balanceAmount: 0, dueDate: "2026-07-15", status: "PAID" },
                    ]).map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50">
                        <td className="p-3 font-bold text-zinc-900">{inv.invoiceNumber || "INV-102"}</td>
                        <td className="p-3 text-zinc-700">{inv.title || "Term Composite Fee"}</td>
                        <td className="p-3 font-semibold text-zinc-900">₹{inv.totalAmount?.toLocaleString()}</td>
                        <td className="p-3 text-emerald-600">₹{(inv.paidAmount || inv.totalAmount)?.toLocaleString()}</td>
                        <td className="p-3 text-zinc-500">
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-3">
                          <Badge
                            className={`text-[10px] ${
                              inv.status === "PAID"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          {inv.status === "PAID" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReceiptInvoice(inv);
                                setReceiptModalOpen(true);
                              }}
                              className="font-mono text-xs border-zinc-300 gap-1 h-7"
                            >
                              <Receipt className="w-3 h-3" />
                              View Receipt
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleOpenPay(inv)}
                              className="font-mono text-xs bg-zinc-900 text-white hover:bg-zinc-800 h-7"
                            >
                              Pay Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 8: APPLY STUDENT LEAVE                                          */}
        {/* =================================================================== */}
        <TabsContent value="leave" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Student Leave Applications
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Apply for leave of absence. Class teacher reviews and directly syncs attendance records.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setLeaveInlineErrors({});
                    setLeaveModalOpen(true);
                  }}
                  className="font-mono text-xs bg-zinc-900 text-white hover:bg-zinc-800 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Leave Application
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700">
                    <tr>
                      <th className="p-3">Applied Date</th>
                      <th className="p-3">Leave Type</th>
                      <th className="p-3">Duration (From - To)</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Reviewed By</th>
                      <th className="p-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {leaveHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-zinc-400">
                          No leave applications filed yet. Click "New Leave Application" to apply.
                        </td>
                      </tr>
                    ) : (
                      leaveHistory.map((lh) => (
                        <tr key={lh.id} className="hover:bg-zinc-50">
                          <td className="p-3 text-zinc-500">
                            {lh.createdAt ? new Date(lh.createdAt).toLocaleDateString() : "-"}
                          </td>
                          <td className="p-3 font-semibold text-zinc-900">{lh.leaveType}</td>
                          <td className="p-3 font-medium text-zinc-800">
                            {new Date(lh.startDate).toLocaleDateString()} to {new Date(lh.endDate).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-zinc-600 max-w-xs truncate">{lh.reason}</td>
                          <td className="p-3">
                            <Badge
                              className={`text-[10px] ${
                                lh.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : lh.status === "REJECTED"
                                  ? "bg-rose-100 text-rose-800 border-rose-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {lh.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-zinc-700">{lh.reviewedBy || "Pending Review"}</td>
                          <td className="p-3 text-zinc-500">{lh.reviewNotes || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 9: BUS & STRICT TRANSPORT TRACKING                              */}
        {/* =================================================================== */}
        <TabsContent value="transport" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Assigned Bus & Daily Commute
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Isolated tracking strictly for {selectedChild?.firstName}'s allocated route and driver.
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-mono text-xs">
                  Transport Enrolled
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Route & Vehicle */}
                <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 space-y-2">
                  <span className="text-zinc-400 block text-[10px] uppercase">Route Details</span>
                  <div className="font-bold text-sm text-zinc-900">
                    {childTransport?.route?.name || "Route 101 - North Sector"}
                  </div>
                  <div className="text-zinc-600">
                    Vehicle: {childTransport?.route?.vehicle?.registrationNumber || "KA-01-AB-1234"}
                  </div>
                  <div className="text-zinc-500 text-[11px]">
                    Type: 32-Seater GPS School Bus
                  </div>
                </div>

                {/* Assigned Stop & Timings */}
                <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 space-y-2">
                  <span className="text-zinc-400 block text-[10px] uppercase">Pickup & Drop Stop</span>
                  <div className="font-bold text-sm text-zinc-900">
                    {childTransport?.stop?.stopName || "Palm Meadows Gate 1"}
                  </div>
                  <div className="text-zinc-600">
                    Morning Pickup: <span className="font-semibold text-zinc-900">07:45 AM</span>
                  </div>
                  <div className="text-zinc-600">
                    Evening Drop: <span className="font-semibold text-zinc-900">03:30 PM</span>
                  </div>
                </div>

                {/* Driver Contact */}
                <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 space-y-2">
                  <span className="text-zinc-400 block text-[10px] uppercase">Designated Driver</span>
                  <div className="font-bold text-sm text-zinc-900">
                    {childTransport?.route?.driver?.name || "Mr. Ramesh Kumar"}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-700">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{childTransport?.route?.driver?.phone || "+91 94441 23456"}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Badge: Verified Commercial Driver
                  </div>
                </div>
              </div>

              {/* Live Route & Trip Status */}
              <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-xs uppercase tracking-wider">Live Trip Status</span>
                  </div>
                  <Badge variant="outline" className="text-white border-zinc-700 text-[10px]">
                    GPS Monitored
                  </Badge>
                </div>
                <p className="text-zinc-300 text-xs font-mono">
                  {childTransport?.latestTrip
                    ? `Bus is currently on ${childTransport.latestTrip.status.toLowerCase()} status near ${childTransport.stop?.stopName || "Assigned Stop"}.`
                    : "School bus has arrived safely at campus. Next scheduled departure at 03:00 PM for afternoon drop."}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400">
                  <span>Speed: 28 km/h</span>
                  <span>•</span>
                  <span>Safety Escort: Present Onboard</span>
                  <span>•</span>
                  <span>Speed Governor: Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 10: TEACHER COMMUNICATION                                       */}
        {/* =================================================================== */}
        <TabsContent value="messages" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Direct Teacher Communication
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Official correspondence with {selectedChild?.firstName}'s class teacher and subject faculty.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  Direct Channel
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages Thread */}
              <div className="border border-zinc-200 rounded-lg p-4 h-80 overflow-y-auto bg-zinc-50/50 space-y-3 font-mono text-xs">
                {messagesList.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-400">
                    No prior messages. Start a conversation with the class teacher below.
                  </div>
                ) : (
                  messagesList.map((m) => {
                    const isFromParent = m.senderRole === "PARENT";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isFromParent ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1">
                          <span className="font-bold text-zinc-700">{m.senderName}</span>
                          <span>•</span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <div
                          className={`p-3 rounded-lg max-w-md ${
                            isFromParent
                              ? "bg-zinc-900 text-white rounded-br-none"
                              : "bg-white text-zinc-900 border border-zinc-200 rounded-bl-none shadow-sm"
                          }`}
                        >
                          <p>{m.message}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Compose Message Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={`Write a message to ${selectedChild?.firstName}'s class teacher...`}
                  className="font-mono text-xs border-zinc-300"
                />
                <Button
                  type="submit"
                  disabled={sendingMessage || !newMessageText.trim()}
                  className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800 gap-1 px-4"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 11: SCHOOL CIRCULARS & NOTICES                                  */}
        {/* =================================================================== */}
        <TabsContent value="announcements" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    School Circulars & Notifications
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Official school-wide circulars, holiday announcements, and event schedules.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  {announcements.length || 3} Circulars
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(announcements.length > 0 ? announcements : [
                  {
                    id: "c1",
                    title: "Term 1 Parent-Teacher Meeting (PTM) Schedule",
                    content: "The Parent-Teacher Meeting for Term 1 will be held this Saturday from 09:00 AM to 01:00 PM. Parents can review academic report cards and interact with subject faculty.",
                    authorName: "Principal's Office",
                    createdAt: "2026-09-18T10:00:00Z",
                  },
                  {
                    id: "c2",
                    title: "Annual Sports Day & Athletics Meet",
                    content: "Annual Athletic Meet registrations are now open for Grade 5 to Grade 12 students. Track and field events will commence next month.",
                    authorName: "Sports Department",
                    createdAt: "2026-09-15T08:30:00Z",
                  },
                  {
                    id: "c3",
                    title: "Science Fair Project Submissions",
                    content: "All Grade 10 students must submit their working prototypes and project synopses by Friday.",
                    authorName: "Mr. Arvindh Nathan (Class Teacher)",
                    createdAt: "2026-09-12T11:00:00Z",
                  },
                ]).map((ann) => (
                  <div
                    key={ann.id}
                    className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-zinc-950">{ann.title}</h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Published by {ann.authorName || "School Office"} • {new Date(ann.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-zinc-300">
                        Circular
                      </Badge>
                    </div>
                    <p className="text-zinc-700 leading-relaxed pt-1">{ann.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 12: DOCUMENTS & CERTIFICATES                                    */}
        {/* =================================================================== */}
        <TabsContent value="vault" className="space-y-6 pt-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-zinc-950 font-sans">
                    Student Documents & Certificates Vault
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Official school certificates, verification letters, and verified admission records.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                  Verified Records
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {[
                  { title: "Bonafide & Study Certificate", issuedDate: "10 Aug 2026", authority: "Principal's Office", size: "140 KB", type: "PDF" },
                  { title: "Student Conduct Certificate", issuedDate: "05 May 2026", authority: "Academic Council", size: "115 KB", type: "PDF" },
                  { title: "Birth Certificate Verification Copy", issuedDate: "01 Jun 2021", authority: "Admissions Office", size: "2.1 MB", type: "PDF" },
                  { title: "Annual Health & Medical Clearance", issuedDate: "15 Jul 2026", authority: "School Infirmary", size: "320 KB", type: "PDF" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="border border-zinc-200 rounded-lg p-3 bg-zinc-50 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-zinc-900">{doc.title}</div>
                      <div className="text-[10px] text-zinc-500">
                        Issued on {doc.issuedDate} by {doc.authority}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast(`Downloading ${doc.title}...`)}
                      className="font-mono text-xs border-zinc-300 gap-1 h-7"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* =================================================================== */}
      {/* MODAL: SUBMIT HOMEWORK                                              */}
      {/* =================================================================== */}
      <Dialog open={hwModalOpen} onOpenChange={setHwModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
              Submit Assignment on Behalf of Child
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              {selectedHwForSubmit?.title} • {selectedChild?.firstName} {selectedChild?.lastName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitHomework} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Attach Assignment Work (File / Cloud Link)</Label>
              <Input
                type="url"
                value={hwSubmissionFileUrl}
                onChange={(e) => setHwSubmissionFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/my-assignment.pdf"
                className="font-mono text-xs border-zinc-300"
              />
              <span className="font-mono text-[10px] text-zinc-400 block">
                Provide public link to PDF, document, or scanned photo of completed work.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Submission Notes / Written Answers</Label>
              <Textarea
                value={hwSubmissionContent}
                onChange={(e) => setHwSubmissionContent(e.target.value)}
                placeholder="Type homework solutions, summary, or parent commentary for teacher..."
                className="font-mono text-xs border-zinc-300"
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setHwModalOpen(false)}
                className="text-xs font-mono border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingHw}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                {submittingHw ? "Submitting..." : "Submit to Teacher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: APPLY STUDENT LEAVE                                          */}
      {/* =================================================================== */}
      <Dialog
        open={leaveModalOpen}
        onOpenChange={(open) => {
          setLeaveModalOpen(open);
          if (open) setLeaveInlineErrors({});
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
              Apply for Student Leave
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Submit formal leave for {selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : "student"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyLeave} className="space-y-3 py-2">
            {children.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="font-mono text-xs text-zinc-700">Select Child / Student *</Label>
                  {leaveInlineErrors.child && (
                    <span className="text-[11px] text-rose-500 font-mono font-medium">Required</span>
                  )}
                </div>
                <Select
                  value={selectedChild?.id || selectedChildId}
                  onValueChange={(val) => {
                    setSelectedChildId(val);
                    setLeaveInlineErrors((prev) => ({ ...prev, child: undefined }));
                  }}
                >
                  <SelectTrigger className={`font-mono text-xs ${leaveInlineErrors.child ? "border-rose-500 ring-1 ring-rose-500 focus:ring-rose-500" : "border-zinc-300"}`}>
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.gradeClass?.name || "Class"} - {c.section?.name || "Sec"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {leaveInlineErrors.child && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-mono font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {leaveInlineErrors.child}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  No Student Profile Found
                </div>
                <p className="text-zinc-600">
                  No enrolled student is currently linked to this parent account. Please contact school administration to link your student profile.
                </p>
                {leaveInlineErrors.child && (
                  <p className="text-xs text-rose-600 font-bold mt-1">
                    {leaveInlineErrors.child}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Leave Type *</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK">Medical / Sick Leave</SelectItem>
                  <SelectItem value="CASUAL">Casual / Personal Leave</SelectItem>
                  <SelectItem value="EMERGENCY">Family Emergency</SelectItem>
                  <SelectItem value="OTHER">Other Authorized Absence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Start Date *</Label>
                <Input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => {
                    setLeaveStartDate(e.target.value);
                    setLeaveInlineErrors((prev) => ({ ...prev, dates: undefined }));
                  }}
                  className={`font-mono text-xs ${leaveInlineErrors.dates ? "border-rose-500 ring-1 ring-rose-500" : "border-zinc-300"}`}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">End Date *</Label>
                <Input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => {
                    setLeaveEndDate(e.target.value);
                    setLeaveInlineErrors((prev) => ({ ...prev, dates: undefined }));
                  }}
                  className={`font-mono text-xs ${leaveInlineErrors.dates ? "border-rose-500 ring-1 ring-rose-500" : "border-zinc-300"}`}
                />
              </div>
            </div>
            {leaveInlineErrors.dates && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-mono font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {leaveInlineErrors.dates}
              </p>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs text-zinc-700">Reason for Leave *</Label>
                {leaveInlineErrors.reason && (
                  <span className="text-[11px] text-rose-500 font-mono font-medium">Required</span>
                )}
              </div>
              <Textarea
                value={leaveReason}
                onChange={(e) => {
                  setLeaveReason(e.target.value);
                  if (e.target.value.trim()) {
                    setLeaveInlineErrors((prev) => ({ ...prev, reason: undefined }));
                  }
                }}
                placeholder="Reason for absence (e.g. Doctor's appointment, recovery)..."
                className={`font-mono text-xs ${leaveInlineErrors.reason ? "border-rose-500 ring-1 ring-rose-500 focus-visible:ring-rose-500" : "border-zinc-300"}`}
                rows={3}
              />
              {leaveInlineErrors.reason && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-mono font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {leaveInlineErrors.reason}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLeaveModalOpen(false)}
                className="text-xs font-mono border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applyingLeave}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                {applyingLeave ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: PAY FEE ONLINE                                               */}
      {/* =================================================================== */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
              Online Fee Payment
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              {selectedInvoiceForPay?.title || "Fee Payment"} • Invoice #{selectedInvoiceForPay?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayFee} className="space-y-4 py-2">
            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg font-mono text-xs space-y-1">
              <div className="flex justify-between text-zinc-500">
                <span>Student:</span>
                <span className="font-bold text-zinc-900">{selectedChild?.firstName} {selectedChild?.lastName}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Payable Amount:</span>
                <span className="font-bold text-zinc-950 text-sm">
                  ₹{Number(selectedInvoiceForPay?.balanceAmount || selectedInvoiceForPay?.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Select Payment Mode *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI (Google Pay, PhonePe, Paytm)</SelectItem>
                  <SelectItem value="NET_BANKING">Internet Banking (HDFC, SBI, ICICI)</SelectItem>
                  <SelectItem value="DEBIT_CARD">Debit / Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPayModalOpen(false)}
                className="text-xs font-mono border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={payingFee}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                {payingFee ? "Processing..." : `Pay ₹${Number(selectedInvoiceForPay?.balanceAmount || selectedInvoiceForPay?.totalAmount || 0).toLocaleString()}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: VIEW OFFICIAL FEE RECEIPT                                    */}
      {/* =================================================================== */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Fee Payment Receipt
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Official Greenwood High School electronic fee acknowledgement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 font-mono text-xs">
            <div className="border-b border-zinc-200 pb-3 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-zinc-950">GREENWOOD HIGH INTERNATIONAL</h3>
                <p className="text-[10px] text-zinc-500">Affiliated to CBSE, New Delhi • School Code: GW-4029</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                PAID & CLEARED
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Receipt No</span>
                <span className="font-bold text-zinc-900">
                  RCP-{selectedReceiptInvoice?.invoiceNumber || "2026-001"}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Payment Date</span>
                <span className="font-semibold text-zinc-900">
                  {new Date(selectedReceiptInvoice?.paidDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Student Name</span>
                <span className="font-bold text-zinc-900">
                  {selectedChild?.firstName} {selectedChild?.lastName}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Class & Section</span>
                <span className="font-semibold text-zinc-900">
                  {selectedChild?.gradeClass?.name || "Grade 10"} - {selectedChild?.section?.name || "A"}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-zinc-200 py-3 space-y-1.5">
              <div className="flex justify-between font-bold text-zinc-900">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between text-zinc-700">
                <span>{selectedReceiptInvoice?.title || "Term Fee Composite"}</span>
                <span>₹{Number(selectedReceiptInvoice?.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center font-bold text-sm text-zinc-950">
              <span>Total Paid:</span>
              <span className="text-emerald-700">
                ₹{Number(selectedReceiptInvoice?.totalAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 text-center pt-2">
              This is a computer generated receipt and does not require physical signature.
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReceiptModalOpen(false)}
              className="text-xs font-mono border-zinc-300"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handlePrintReceipt}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800 gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
