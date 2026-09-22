"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import {
  CalendarCheck,
  BookOpen,
  FileText,
  Award,
  Users,
  FileCheck2,
  Briefcase,
  Calendar,
  Settings,
  Plus,
  Search,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  KeyRound,
  Eye,
  AlertCircle,
  FileSpreadsheet,
  Check,
  X,
  Sparkles,
  CalendarDays,
  User,
  GraduationCap,
  ChevronRight,
  Filter,
  Trash2,
  MessageSquare,
  Send,
  ExternalLink,
  FileUp,
  RefreshCw,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { erpApi } from "@/lib/api";

const PERIOD_SLOTS = [
  { periodNumber: 1, name: "Period 1", startTime: "08:30", endTime: "09:15" },
  { periodNumber: 2, name: "Period 2", startTime: "09:15", endTime: "10:00" },
  { periodNumber: 3, name: "Recess Break", startTime: "10:00", endTime: "10:15", isBreak: true },
  { periodNumber: 4, name: "Period 3", startTime: "10:15", endTime: "11:00" },
  { periodNumber: 5, name: "Period 4", startTime: "11:00", endTime: "11:45" },
  { periodNumber: 6, name: "Lunch Break", startTime: "11:45", endTime: "12:30", isBreak: true },
  { periodNumber: 7, name: "Period 5", startTime: "12:30", endTime: "01:15" },
  { periodNumber: 8, name: "Period 6", startTime: "01:15", endTime: "02:00" },
  { periodNumber: 9, name: "Period 7", startTime: "02:15", endTime: "03:00" },
  { periodNumber: 10, name: "Period 8", startTime: "03:00", endTime: "03:45" },
];

const DAYS_OF_WEEK = [
  { day: 1, name: "Monday", short: "Mon" },
  { day: 2, name: "Tuesday", short: "Tue" },
  { day: 3, name: "Wednesday", short: "Wed" },
  { day: 4, name: "Thursday", short: "Thu" },
  { day: 5, name: "Friday", short: "Fri" },
  { day: 6, name: "Saturday", short: "Sat" },
];

export default function TeacherPortalPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  // Active Tab from query param
  const activeTab = searchParams.get("tab") || "timetable";

  const handleTabChange = (tab: string) => {
    router.push(`/${schoolSlug}/teacher?tab=${tab}`);
  };

  // State
  const [loading, setLoading] = React.useState(true);
  const [currentTeacher, setCurrentTeacher] = React.useState<any>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [allClasses, setAllClasses] = React.useState<any[]>([]);
  const [classTeacherClass, setClassTeacherClass] = React.useState<any>(null);
  const [classTeacherSection, setClassTeacherSection] = React.useState<any>(null);
  const [classStudents, setClassStudents] = React.useState<any[]>([]);

  // Notifications / Toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Feature 1: Timetable
  const [timetableSlots, setTimetableSlots] = React.useState<any[]>([]);

  // Feature 2: Allotted Subjects
  const [allottedSubjects, setAllottedSubjects] = React.useState<any[]>([]);

  // Feature 3: Question Papers & Exams
  const [questionPapers, setQuestionPapers] = React.useState<any[]>([]);
  const [qpModalOpen, setQpModalOpen] = React.useState(false);
  const [qpSelectedClassId, setQpSelectedClassId] = React.useState("");
  const [qpSelectedSubjectId, setQpSelectedSubjectId] = React.useState("");
  const [qpCategory, setQpCategory] = React.useState("UNIT_TEST");
  const [qpTitle, setQpTitle] = React.useState("");
  const [qpMaxMarks, setQpMaxMarks] = React.useState("100");
  const [qpDuration, setQpDuration] = React.useState("90");
  const [qpExamDate, setQpExamDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [qpDescription, setQpDescription] = React.useState("");
  const [qpFileName, setQpFileName] = React.useState("Sample_Question_Paper.pdf");

  // Feature 4: Class Teacher Student Roster & Parent Details
  const [selectedStudentForView, setSelectedStudentForView] = React.useState<any>(null);
  const [studentModalOpen, setStudentModalOpen] = React.useState(false);

  // Feature 5: Marks Enrollment
  const [marksExamName, setMarksExamName] = React.useState("Unit Test 1 (Term 1)");
  const [marksSubjectId, setMarksSubjectId] = React.useState("");
  const [marksMaxScore, setMarksMaxScore] = React.useState(100);
  const [marksPassScore, setMarksPassScore] = React.useState(40);
  const [marksScores, setMarksScores] = React.useState<Record<string, { marks: number; remarks: string }>>({});
  const [savingMarks, setSavingMarks] = React.useState(false);

  // Feature 6: Daily Attendance & Month-wise Excel Export
  const [attendanceDate, setAttendanceDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [attendanceSession, setAttendanceSession] = React.useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = React.useState<Record<string, string>>({});
  const [savingAttendance, setSavingAttendance] = React.useState(false);
  const [exportMonth, setExportMonth] = React.useState(new Date().getMonth() + 1);
  const [exportYear, setExportYear] = React.useState(new Date().getFullYear());
  const [exportingExcel, setExportingExcel] = React.useState(false);
  const [monthlyMatrixData, setMonthlyMatrixData] = React.useState<any>(null);

  // Feature 7: Homework & Assignments
  const [homeworkList, setHomeworkList] = React.useState<any[]>([]);
  const [hwModalOpen, setHwModalOpen] = React.useState(false);
  const [hwClassId, setHwClassId] = React.useState("");
  const [hwSectionId, setHwSectionId] = React.useState("");
  const [hwSubjectId, setHwSubjectId] = React.useState("");
  const [hwTitle, setHwTitle] = React.useState("");
  const [hwDescription, setHwDescription] = React.useState("");
  const [hwDueDate, setHwDueDate] = React.useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [hwDateFilter, setHwDateFilter] = React.useState("ALL");

  // Feature 8: Leave Application
  const [leavesList, setLeavesList] = React.useState<any[]>([]);
  const [leaveModalOpen, setLeaveModalOpen] = React.useState(false);
  const [leaveType, setLeaveType] = React.useState("CASUAL");
  const [leaveStartDate, setLeaveStartDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [leaveEndDate, setLeaveEndDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = React.useState("");
  const [submittingLeave, setSubmittingLeave] = React.useState(false);
  const [leaveInlineErrors, setLeaveInlineErrors] = React.useState<{ dates?: string; reason?: string }>({});

  // Feature 9: Academic Calendar (Set by Principal)
  const [schoolEvents, setSchoolEvents] = React.useState<any[]>([]);

  // Feature 10: Profile & Password Reset
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [resettingPassword, setResettingPassword] = React.useState(false);

  // Homework Submissions Review
  const [selectedHwForSubmissions, setSelectedHwForSubmissions] = React.useState<any>(null);
  const [submissionsModalOpen, setSubmissionsModalOpen] = React.useState(false);
  const [hwSubmissions, setHwSubmissions] = React.useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = React.useState(false);
  const [gradingInputs, setGradingInputs] = React.useState<Record<string, { grade: string; feedback: string; allowResubmit: boolean }>>({});
  const [savingGradeId, setSavingGradeId] = React.useState<string | null>(null);
  const [hwAttachmentUrl, setHwAttachmentUrl] = React.useState("");

  // Lesson Plans & Syllabus Progress
  const [lessonPlans, setLessonPlans] = React.useState<any[]>([]);
  const [lpModalOpen, setLpModalOpen] = React.useState(false);
  const [lpClassId, setLpClassId] = React.useState("");
  const [lpSubjectId, setLpSubjectId] = React.useState("");
  const [lpTitle, setLpTitle] = React.useState("");
  const [lpDescription, setLpDescription] = React.useState("");
  const [lpPlannedDate, setLpPlannedDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [lpCompletionRate, setLpCompletionRate] = React.useState(0);
  const [lpResourcesUrl, setLpResourcesUrl] = React.useState("");
  const [savingLp, setSavingLp] = React.useState(false);

  // Student Leave Requests from Parents
  const [studentLeaves, setStudentLeaves] = React.useState<any[]>([]);
  const [decidingLeaveId, setDecidingLeaveId] = React.useState<string | null>(null);

  // Parent Communication & Class Announcements
  const [selectedCommStudent, setSelectedCommStudent] = React.useState<any>(null);
  const [messagesList, setMessagesList] = React.useState<any[]>([]);
  const [newMessageText, setNewMessageText] = React.useState("");
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = React.useState(false);
  const [announcementTitle, setAnnouncementTitle] = React.useState("");
  const [announcementContent, setAnnouncementContent] = React.useState("");
  const [announcementAudience, setAnnouncementAudience] = React.useState("PARENTS");
  const [announcementsList, setAnnouncementsList] = React.useState<any[]>([]);
  const [publishingNotice, setPublishingNotice] = React.useState(false);


  // -------------------------------------------------------------
  // INITIAL DATA FETCH
  // -------------------------------------------------------------
  const loadTeacherData = React.useCallback(async () => {
    setLoading(true);
    try {
      // 1. Resolve Profile & Teacher
      const profile = await erpApi.getProfile();
      setCurrentUser(profile);

      let teacher = profile?.staffProfile;
      if (!teacher) {
        // Fallback to fetch staff matching current logged in user's email or ID
        const staffRes = await erpApi.getStaff();
        const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
        const targetEmail = (profile?.email || storedUser?.email || "").toLowerCase();

        teacher = staffRes?.find((s: any) => 
          (targetEmail && s.email?.toLowerCase() === targetEmail) || 
          s.userId === profile?.id || 
          s.userId === storedUser?.id
        );

        if (!teacher) {
          teacher = {
            id: profile?.staffId || profile?.id || storedUser?.id || "temp-teacher",
            userId: profile?.id || storedUser?.id,
            name: profile?.name || storedUser?.name || "Teacher",
            email: targetEmail || profile?.email || storedUser?.email || "",
            role: "TEACHER",
            designation: "Teacher",
            employeeCode: "EMP-" + (profile?.id ? profile.id.slice(0, 5).toUpperCase() : "1001"),
            department: { name: "Academics" },
            taughtSubjects: [],
            timetableSlots: [],
            managedClasses: [],
            managedSections: [],
          };
        }
      }
      setCurrentTeacher(teacher);

      // 2. Load classes & check Class Teacher assignment
      const classesRes = await erpApi.getClasses();
      setAllClasses(classesRes || []);

      let ctClass = null;
      let ctSection = null;

      if (teacher) {
        // Direct check on teacher's managedClasses or managedSections
        if (teacher.managedClasses && teacher.managedClasses.length > 0) {
          const mCls = teacher.managedClasses[0];
          ctClass = (classesRes || []).find((c: any) => c.id === mCls.id) || mCls;
          ctSection = ctClass?.sections?.[0] || null;
        } else if (teacher.managedSections && teacher.managedSections.length > 0) {
          const mSec = teacher.managedSections[0];
          ctClass = (classesRes || []).find((c: any) => c.id === mSec.classId || c.id === mSec.gradeClassId) || mSec.gradeClass;
          ctSection = (ctClass?.sections || []).find((s: any) => s.id === mSec.id) || mSec;
        }

        // Cross-reference with class hierarchy
        if (!ctClass) {
          for (const cls of classesRes || []) {
            if (cls.classTeacherId === teacher.id) {
              ctClass = cls;
              ctSection = cls.sections?.[0] || null;
              break;
            }
            const sec = cls.sections?.find((s: any) => s.classTeacherId === teacher.id);
            if (sec) {
              ctClass = cls;
              ctSection = sec;
              break;
            }
          }
        }
      }

      // ONLY set class teacher class if actually designated
      setClassTeacherClass(ctClass);
      setClassTeacherSection(ctSection);

      // 3. Load students for Class Teacher class ONLY if assigned
      if (ctClass) {
        const rosterRes = await erpApi.getClassStudents(ctClass.id, ctSection?.id);
        const stList = rosterRes?.students || [];
        setClassStudents(stList);

        // Prepopulate default attendance records for today
        const initialAtt: Record<string, string> = {};
        stList.forEach((s: any) => {
          initialAtt[s.id] = "PRESENT";
        });
        setAttendanceRecords(initialAtt);
      } else {
        setClassStudents([]);
        setAttendanceRecords({});
      }

      // 4. Load Timetable for this exact teacher
      if (teacher?.id) {
        const ttRes = await erpApi.getFacultyTimetable(teacher.id).catch(() => ({ slots: [] }));
        setTimetableSlots(ttRes?.slots || []);
      }

      // 5. Load Allotted Subjects for this exact teacher
      const subjectsRes = await erpApi.getSubjects().catch(() => []);
      const mySubjects = subjectsRes.filter((s: any) => s.teacherId === teacher?.id || s.teacher?.id === teacher?.id);
      const fallbackSubjects = teacher?.taughtSubjects?.length > 0 ? teacher.taughtSubjects : [];
      setAllottedSubjects(mySubjects.length > 0 ? mySubjects : fallbackSubjects);

      // 6. Load Question Papers
      const qpRes = await erpApi.getQuestionPapers().catch(() => []);
      setQuestionPapers(qpRes || []);

      // 7. Load Homework
      const hwRes = await erpApi.getHomeworks().catch(() => []);
      setHomeworkList(hwRes || []);

      // 8. Load Leaves
      const leavesRes = await erpApi.getLeaves().catch(() => []);
      setLeavesList(leavesRes || []);

      // 9. Load School Events (Principal's Calendar)
      const eventsRes = await erpApi.getEvents().catch(() => []);
      setSchoolEvents(eventsRes || []);

      // 10. Load Lesson Plans & Syllabus Progress
      const lpRes = await erpApi.getLessonPlans({ teacherId: teacher?.id }).catch(() => []);
      setLessonPlans(lpRes || []);

      // 11. Load Student Leave Applications from parents
      const stLeavesRes = await erpApi.getStudentLeaves({ classId: ctClass?.id, sectionId: ctSection?.id }).catch(() => []);
      setStudentLeaves(stLeavesRes || []);

      // 12. Load Announcements
      const annRes = await erpApi.getAnnouncements().catch(() => []);
      setAnnouncementsList(annRes || []);

    } catch (err: any) {
      console.error("Error loading teacher portal:", err);
    } finally {
      setLoading(false);
    }
  }, []);


  React.useEffect(() => {
    loadTeacherData();
  }, [loadTeacherData]);

  // Dynamic Exam Categories calculation for selected class
  const selectedClassObj = allClasses.find((c) => c.id === qpSelectedClassId);
  const isSeniorGrade = selectedClassObj?.name?.includes("10") ||
    selectedClassObj?.name?.includes("11") ||
    selectedClassObj?.name?.includes("12");

  // Filter subjects strictly according to the selected Grade/Class
  const subjectsForSelectedGrade = React.useMemo(() => {
    if (!qpSelectedClassId) return allottedSubjects;
    const classSpecific = allottedSubjects.filter(
      (s: any) =>
        s.classId === qpSelectedClassId ||
        s.gradeClassId === qpSelectedClassId ||
        s.gradeClass?.id === qpSelectedClassId
    );
    if (classSpecific.length > 0) return classSpecific;
    return selectedClassObj?.subjects || [];
  }, [qpSelectedClassId, allottedSubjects, selectedClassObj]);

  // Load attendance session when date changes
  React.useEffect(() => {
    if (classTeacherSection?.id && attendanceDate) {
      erpApi.getAttendanceSession(classTeacherSection.id, attendanceDate)
        .then((session) => {
          if (session) {
            setAttendanceSession(session);
            const recMap: Record<string, string> = {};
            session.records?.forEach((r: any) => {
              recMap[r.studentId] = r.status;
            });
            setAttendanceRecords(recMap);
          }
        })
        .catch(() => {});
    }
  }, [classTeacherSection?.id, attendanceDate]);

  // Load monthly matrix data for Excel export preview
  const fetchMonthlyMatrix = React.useCallback(async () => {
    if (!classTeacherSection?.id) return;
    try {
      const data = await erpApi.getMonthlyAttendanceMatrix(classTeacherSection.id, exportYear, exportMonth);
      setMonthlyMatrixData(data);
    } catch (e) {}
  }, [classTeacherSection?.id, exportYear, exportMonth]);

  React.useEffect(() => {
    if (activeTab === "attendance") {
      fetchMonthlyMatrix();
    }
  }, [activeTab, fetchMonthlyMatrix]);

  // -------------------------------------------------------------
  // FEATURE HANDLERS
  // -------------------------------------------------------------

  // Feature 3: Question Paper Upload
  const handleUploadQuestionPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qpSelectedClassId || !qpSelectedSubjectId || !qpTitle) {
      showToast("Please fill all required fields");
      return;
    }

    try {
      const newQP = await erpApi.createQuestionPaper({
        classId: qpSelectedClassId,
        subjectId: qpSelectedSubjectId,
        teacherId: currentTeacher?.id || "teacher-default",
        examCategory: qpCategory,
        title: qpTitle,
        description: qpDescription,
        maxMarks: qpMaxMarks,
        durationMinutes: qpDuration,
        examDate: qpExamDate,
        fileName: qpFileName,
        fileUrl: "https://schoolerp.example/question-papers/" + qpFileName,
        fileSize: "1.2 MB",
      });

      setQuestionPapers([newQP, ...questionPapers]);
      setQpModalOpen(false);
      setQpTitle("");
      setQpDescription("");
      showToast("Question paper successfully registered!");
    } catch (err: any) {
      showToast("Failed to upload question paper: " + err.message);
    }
  };

  const handleDeleteQuestionPaper = async (id: string) => {
    try {
      await erpApi.deleteQuestionPaper(id);
      setQuestionPapers(questionPapers.filter((q) => q.id !== id));
      showToast("Question paper deleted.");
    } catch (err: any) {
      showToast("Delete failed: " + err.message);
    }
  };

  // Feature 5: Marks Enrollment
  const handleSaveMarks = async () => {
    if (!classTeacherClass?.id || !marksSubjectId) {
      showToast("Please select a subject to enroll marks.");
      return;
    }
    setSavingMarks(true);
    try {
      const marksPayload = classStudents.map((st) => ({
        studentId: st.id,
        marksObtained: marksScores[st.id]?.marks ?? 75,
        remarks: marksScores[st.id]?.remarks || "Satisfactory progress",
      }));

      await erpApi.enrollClassMarks({
        examName: marksExamName,
        classId: classTeacherClass.id,
        sectionId: classTeacherSection?.id,
        subjectId: marksSubjectId,
        maxMarks: marksMaxScore,
        passMarks: marksPassScore,
        marks: marksPayload,
      });

      showToast("Marks enrolled and saved successfully for all students!");
    } catch (err: any) {
      showToast("Failed to save marks: " + err.message);
    } finally {
      setSavingMarks(false);
    }
  };

  // Feature 6: Daily Attendance Submit
  const handleSaveAttendance = async () => {
    if (!attendanceSession?.id) {
      showToast("Attendance session not ready.");
      return;
    }
    setSavingAttendance(true);
    try {
      const recordsPayload = classStudents.map((st) => ({
        studentId: st.id,
        status: attendanceRecords[st.id] || "PRESENT",
      }));

      await erpApi.submitAttendance(attendanceSession.id, recordsPayload);
      showToast("Daily attendance recorded successfully!");
      fetchMonthlyMatrix();
    } catch (err: any) {
      showToast("Failed to record attendance: " + err.message);
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, string> = {};
    classStudents.forEach((s) => {
      updated[s.id] = "PRESENT";
    });
    setAttendanceRecords(updated);
    showToast("All students marked Present.");
  };

  // Feature 6: Month-wise Excel Export using SheetJS
  const handleExportMonthlyExcel = async () => {
    setExportingExcel(true);
    try {
      const matrix = await erpApi.getMonthlyAttendanceMatrix(
        classTeacherSection?.id || "sec-g10-a",
        exportYear,
        exportMonth
      );

      const days = matrix.daysInMonth || 30;
      const students = matrix.students || [];

      // Construct Excel Worksheet rows
      const metaRow1 = ["GREENWOOD HIGH INTERNATIONAL SCHOOL - MONTHLY ATTENDANCE REGISTER"];
      const metaRow2 = [`Class: ${matrix.className || "Grade 10"} - ${matrix.sectionName || "Section A"}`, `Month / Year: ${exportMonth}/${exportYear}`, `Working Days: ${matrix.totalWorkingDays}`];
      const emptyRow: string[] = [];

      // Column Headers
      const colHeaders = ["Roll No", "Admission No", "Student Full Name", "Gender"];
      for (let d = 1; d <= days; d++) {
        colHeaders.push(`D${d}`);
      }
      colHeaders.push("Present", "Absent", "Late", "Rate %");

      // Data Rows
      const dataRows = students.map((s: any) => {
        const row = [
          s.rollNumber || "-",
          s.admissionNumber || "-",
          s.name,
          s.gender || "-",
        ];

        for (let d = 1; d <= days; d++) {
          const st = s.dailyStatus[d];
          if (st === "PRESENT") row.push("P");
          else if (st === "ABSENT") row.push("A");
          else if (st === "LATE") row.push("L");
          else if (st === "LEAVE") row.push("LV");
          else if (st === "HALF_DAY") row.push("HD");
          else if (st === "HOLIDAY") row.push("SUN");
          else row.push("-");
        }

        row.push(
          s.presentCount.toString(),
          s.absentCount.toString(),
          s.lateCount.toString(),
          `${s.attendanceRate}%`
        );
        return row;
      });

      const sheetData = [metaRow1, metaRow2, emptyRow, colHeaders, ...dataRows];

      // Create workbook
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Attendance_${exportMonth}_${exportYear}`);

      // Generate and download
      const fileName = `Attendance_${(matrix.className || "Class").replace(/\s+/g, "_")}_${exportMonth}_${exportYear}.xlsx`;
      XLSX.writeFile(wb, fileName);

      showToast(`Excel sheet exported: ${fileName}`);
    } catch (err: any) {
      showToast("Failed to generate Excel: " + err.message);
    } finally {
      setExportingExcel(false);
    }
  };

  // Feature 7: Homework Assignment
  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwClassId || !hwSubjectId || !hwTitle) {
      showToast("Please fill all required homework fields.");
      return;
    }

    try {
      const newHw = await erpApi.createHomework({
        classId: hwClassId,
        sectionId: hwSectionId || classTeacherSection?.id || "sec-g10-a",
        subjectId: hwSubjectId,
        teacherId: currentTeacher?.id || "teacher-default",
        title: hwTitle,
        description: hwDescription,
        dueDate: hwDueDate,
        attachmentUrl: hwAttachmentUrl || undefined,
      });

      setHomeworkList([newHw, ...homeworkList]);
      setHwModalOpen(false);
      setHwTitle("");
      setHwDescription("");
      setHwAttachmentUrl("");
      showToast("Daily homework assigned successfully!");
    } catch (err: any) {
      showToast("Failed to assign homework: " + err.message);
    }
  };

  // Submissions Review Handler
  const handleOpenSubmissions = async (hw: any) => {
    setSelectedHwForSubmissions(hw);
    setSubmissionsModalOpen(true);
    setLoadingSubmissions(true);
    try {
      const subs = await erpApi.getHomeworkSubmissions(hw.id);
      setHwSubmissions(subs || []);
      const initialGrading: Record<string, { grade: string; feedback: string; allowResubmit: boolean }> = {};
      (subs || []).forEach((s: any) => {
        initialGrading[s.id] = {
          grade: s.grade || "",
          feedback: s.feedback || "",
          allowResubmit: s.allowResubmit || false,
        };
      });
      setGradingInputs(initialGrading);
    } catch (err: any) {
      showToast("Failed to load submissions: " + err.message);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSaveGrade = async (submissionId: string) => {
    const input = gradingInputs[submissionId];
    if (!input || !input.grade) {
      showToast("Please enter a grade or marks first.");
      return;
    }
    setSavingGradeId(submissionId);
    try {
      await erpApi.gradeHomework(submissionId, input.grade, input.feedback, input.allowResubmit);
      setHwSubmissions(
        hwSubmissions.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                grade: input.grade,
                feedback: input.feedback,
                allowResubmit: input.allowResubmit,
                status: input.allowResubmit ? "RESUBMISSION_ALLOWED" : "REVIEWED",
              }
            : s
        )
      );
      showToast("Grade and feedback saved successfully!");
    } catch (err: any) {
      showToast("Failed to save grade: " + err.message);
    } finally {
      setSavingGradeId(null);
    }
  };

  // Student Leave Decision Handler
  const handleStudentLeaveDecision = async (leaveId: string, decision: "APPROVED" | "REJECTED") => {
    setDecidingLeaveId(leaveId);
    try {
      const updated = await erpApi.decideStudentLeave(
        leaveId,
        decision,
        currentTeacher?.name || "Class Teacher",
        decision === "APPROVED" ? "Approved by Class Teacher" : "Leave request declined"
      );
      setStudentLeaves(studentLeaves.map((l) => (l.id === leaveId ? updated : l)));
      showToast(decision === "APPROVED" ? "Student leave approved and attendance marked as LEAVE." : "Student leave rejected.");
      fetchMonthlyMatrix();
    } catch (err: any) {
      showToast("Failed to update leave decision: " + err.message);
    } finally {
      setDecidingLeaveId(null);
    }
  };

  // Lesson Plans Handlers
  const handleCreateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpClassId || !lpSubjectId || !lpTitle) {
      showToast("Please fill Class, Subject and Topic Title.");
      return;
    }
    setSavingLp(true);
    try {
      const newLp = await erpApi.createLessonPlan({
        classId: lpClassId,
        subjectId: lpSubjectId,
        teacherId: currentTeacher?.id || "teacher-default",
        title: lpTitle,
        description: lpDescription,
        plannedDate: lpPlannedDate,
        completionRate: Number(lpCompletionRate) || 0,
        resourcesUrl: lpResourcesUrl,
      });
      setLessonPlans([newLp, ...lessonPlans]);
      setLpModalOpen(false);
      setLpTitle("");
      setLpDescription("");
      setLpCompletionRate(0);
      setLpResourcesUrl("");
      showToast("Lesson plan and syllabus topic created successfully!");
    } catch (err: any) {
      showToast("Failed to create lesson plan: " + err.message);
    } finally {
      setSavingLp(false);
    }
  };

  const handleUpdateLpProgress = async (lpId: string, rate: number, status?: string) => {
    try {
      const newStatus = status || (rate >= 100 ? "COMPLETED" : rate > 0 ? "IN_PROGRESS" : "PLANNED");
      const updated = await erpApi.updateLessonPlan(lpId, {
        completionRate: rate,
        status: newStatus,
        completedDate: rate >= 100 ? new Date().toISOString() : undefined,
      });
      setLessonPlans(lessonPlans.map((lp) => (lp.id === lpId ? { ...lp, ...updated } : lp)));
      showToast(`Syllabus progress updated to ${rate}%.`);
    } catch (err: any) {
      showToast("Failed to update progress: " + err.message);
    }
  };

  const handleDeleteLessonPlan = async (lpId: string) => {
    try {
      await erpApi.deleteLessonPlan(lpId);
      setLessonPlans(lessonPlans.filter((lp) => lp.id !== lpId));
      showToast("Lesson plan removed.");
    } catch (err: any) {
      showToast("Failed to delete: " + err.message);
    }
  };

  // Parent Communication Handlers
  const handleSelectCommStudent = async (st: any) => {
    setSelectedCommStudent(st);
    try {
      const msgs = await erpApi.getMessages({ studentId: st.id });
      setMessagesList(msgs || []);
    } catch (err: any) {
      showToast("Failed to load messages: " + err.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommStudent || !newMessageText.trim()) return;
    setSendingMessage(true);
    try {
      const newMsg = await erpApi.sendMessage({
        studentId: selectedCommStudent.id,
        parentId: selectedCommStudent.parentId || "parent-default",
        teacherId: currentTeacher?.id || "teacher-default",
        senderRole: "TEACHER",
        senderName: currentTeacher?.name || "Teacher",
        subject: `Regarding ${selectedCommStudent.firstName} ${selectedCommStudent.lastName}`,
        message: newMessageText.trim(),
      });
      setMessagesList([...messagesList, newMsg]);
      setNewMessageText("");
      showToast("Message sent to parent.");
    } catch (err: any) {
      showToast("Failed to send message: " + err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      showToast("Please provide announcement title and content.");
      return;
    }
    setPublishingNotice(true);
    try {
      const newAnn = await erpApi.createAnnouncement({
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        audience: announcementAudience,
        targetGrade: classTeacherClass?.name || "All Assigned Classes",
        authorName: currentTeacher?.name || "Class Teacher",
      });
      setAnnouncementsList([newAnn, ...announcementsList]);
      setAnnouncementModalOpen(false);
      setAnnouncementTitle("");
      setAnnouncementContent("");
      showToast("Announcement published successfully to parents!");
    } catch (err: any) {
      showToast("Failed to publish announcement: " + err.message);
    } finally {
      setPublishingNotice(false);
    }
  };


  // Feature 8: Leave Application
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { dates?: string; reason?: string } = {};

    if (!leaveReason || !leaveReason.trim()) {
      errors.reason = "Please enter a reason for your leave.";
    } else if (leaveReason.trim().length < 3) {
      errors.reason = "Leave reason must be at least 3 characters long.";
    }

    if (leaveStartDate && leaveEndDate && new Date(leaveEndDate) < new Date(leaveStartDate)) {
      errors.dates = "To Date cannot be earlier than From Date.";
    }

    if (Object.keys(errors).length > 0) {
      setLeaveInlineErrors(errors);
      return;
    }

    setLeaveInlineErrors({});
    setSubmittingLeave(true);
    try {
      const targetStaffId = currentTeacher?.id || currentUser?.staffId || currentUser?.staffProfile?.id || currentUser?.id || "teacher-default";
      const newLeave = await erpApi.applyLeave({
        staffId: targetStaffId,
        leaveType,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason.trim(),
      });

      setLeavesList([newLeave, ...leavesList]);
      setLeaveModalOpen(false);
      setLeaveReason("");
      setLeaveInlineErrors({});
      showToast("Leave application submitted for Principal approval.");
    } catch (err: any) {
      setLeaveInlineErrors({ reason: err.message || "Failed to apply leave." });
      showToast("Failed to apply leave: " + err.message);
    } finally {
      setSubmittingLeave(false);
    }
  };

  // Feature 10: Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }

    setResettingPassword(true);
    try {
      await erpApi.setupPassword(currentUser?.id || "demo-teacher-id", newPassword);
      showToast("Password reset successfully! Use your new password on next login.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast("Password reset failed: " + err.message);
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
        <p className="font-mono text-xs text-zinc-500">Loading Faculty Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-950 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 border border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="size-4 text-zinc-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-lg">
              {currentTeacher?.name ? currentTeacher.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2) : "FT"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
                  {currentTeacher?.name || currentUser?.name || "Faculty Member"}
                </h1>
                <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-800 border-zinc-300">
                  {currentTeacher?.designation || "Faculty Member"}
                </Badge>
                {classTeacherClass && (
                  <Badge className="font-mono text-[10px] bg-zinc-900 text-white">
                    Class Teacher: {classTeacherClass.name} {classTeacherSection ? `- ${classTeacherSection.name}` : ""}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Employee Code: <span className="font-semibold text-zinc-900">{currentTeacher?.employeeCode || "EMP-FACULTY"}</span> • {currentTeacher?.email || currentUser?.email || "faculty@greenwoodhigh.edu"} • Department of {currentTeacher?.department?.name || "Academics"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Interface driven directly by sidebar navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">


        {/* =================================================================== */}
        {/* TAB 1: TIMETABLE ALLOTMENTS                                          */}
        {/* =================================================================== */}
        <TabsContent value="timetable" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Faculty Schedule & Period Allotments</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Weekly period assignments generated from the approved Master Academic Timetable.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs bg-white text-zinc-700">
                Total Teaching Periods: {timetableSlots.length} / Week
              </Badge>
              <Badge variant="outline" className="font-mono text-xs bg-white text-zinc-700">
                Status: APPROVED
              </Badge>
            </div>
          </div>

          <Card className="border-zinc-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="border-zinc-200">
                    <TableHead className="w-28 font-mono text-xs text-zinc-700 font-semibold">Day</TableHead>
                    {PERIOD_SLOTS.map((p) => (
                      <TableHead key={p.periodNumber} className="text-center font-mono text-[11px] text-zinc-700 min-w-[120px]">
                        <div>{p.name}</div>
                        <div className="text-[9px] text-zinc-400 font-normal">{p.startTime} - {p.endTime}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DAYS_OF_WEEK.map((d) => (
                    <TableRow key={d.day} className="border-zinc-200 hover:bg-zinc-50/50">
                      <TableCell className="font-mono text-xs font-semibold text-zinc-900 bg-zinc-50/70 border-r border-zinc-200">
                        {d.name}
                      </TableCell>
                      {PERIOD_SLOTS.map((p) => {
                        if (p.isBreak) {
                          return (
                            <TableCell key={p.periodNumber} className="text-center bg-zinc-100/50 text-[10px] font-mono text-zinc-400 border-r border-zinc-200">
                              {p.name}
                            </TableCell>
                          );
                        }

                        const slot = timetableSlots.find(
                          (s) => s.dayOfWeek === d.day && (s.period?.periodNumber === p.periodNumber || s.period?.name === p.name)
                        );

                        return (
                          <TableCell key={p.periodNumber} className="text-center p-2 border-r border-zinc-200">
                            {slot ? (
                              <div className="rounded border border-zinc-300 bg-zinc-100 p-2 text-left hover:border-zinc-900 transition-colors shadow-2xs">
                                <div className="text-xs font-bold text-zinc-900 leading-tight">
                                  {slot.subject?.name || "Mathematics"}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-600 mt-0.5">
                                  {slot.gradeClass?.name || slot.section?.gradeClass?.name || "Grade 10"} • {slot.section?.name || "Sec A"}
                                </div>
                                <div className="text-[9px] font-mono text-zinc-400 mt-1 flex items-center justify-between">
                                  <span>{slot.room?.name || "Room 101"}</span>
                                  <span className="text-emerald-700 font-medium">Active</span>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded border border-dashed border-zinc-200 p-2 text-[10px] font-mono text-zinc-400">
                                Free Period
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 2: TEACHING PORTFOLIO (ALLOTTED SUBJECTS)                        */}
        {/* =================================================================== */}
        <TabsContent value="subjects" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Teaching Portfolio & Allotted Subjects</h2>
              <p className="text-xs text-zinc-500 font-mono">
                List of academic subjects and grade levels assigned to you for teaching and curriculum delivery.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {allottedSubjects.length} Assigned Subjects
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allottedSubjects.map((sub: any) => (
              <Card key={sub.id} className="border-zinc-200 shadow-xs hover:border-zinc-400 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px] bg-zinc-50 text-zinc-700">
                      {sub.code || "SUB-101"}
                    </Badge>
                    <Badge className="font-mono text-[10px] bg-zinc-900 text-white">
                      {sub.gradeClass?.name || "Grade 10"}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-950 mt-2">{sub.name}</CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    Curriculum Framework: Tamil Nadu State Board / CBSE
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs font-mono text-zinc-600 pb-3">
                  <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Periods Per Week:</span>
                    <span className="font-bold text-zinc-900">{sub.periodsPerWeek || 5} Periods</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Faculty Role:</span>
                    <span className="font-semibold text-zinc-900">Subject In-Charge</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-zinc-500">Class Coverage:</span>
                    <span className="font-semibold text-zinc-900">{sub.gradeClass?.name || "Grade 10"} All Sections</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-mono text-zinc-700 hover:text-zinc-950"
                    onClick={() => {
                      setQpSelectedClassId(sub.classId || sub.gradeClass?.id || "");
                      setQpSelectedSubjectId(sub.id);
                      setQpModalOpen(true);
                    }}
                  >
                    <Upload className="size-3 mr-1" /> Upload Question Paper
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-mono text-zinc-700 hover:text-zinc-950"
                    onClick={() => {
                      setHwClassId(sub.classId || sub.gradeClass?.id || "");
                      setHwSubjectId(sub.id);
                      setHwModalOpen(true);
                    }}
                  >
                    <Plus className="size-3 mr-1" /> Homework
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 3: QUESTION PAPERS & EXAMINATIONS                               */}
        {/* =================================================================== */}
        <TabsContent value="exams" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Examination Question Papers Vault</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Upload and manage question papers for Unit Tests, Quarterly, Half-Yearly, and Annual exams.
                Grades 10, 11, and 12 include Daily, Weekly, and Monthly Unit Test categories.
              </p>
            </div>
            <Button
              onClick={() => setQpModalOpen(true)}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              <Upload className="size-3.5 mr-1.5" /> Upload Question Paper
            </Button>
          </div>

          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="border-zinc-200">
                  <TableHead className="font-mono text-xs text-zinc-700">Title & Subject</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Grade / Class</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Exam Category</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Max Marks & Time</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Uploaded On</TableHead>
                  <TableHead className="text-right font-mono text-xs text-zinc-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionPapers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-zinc-400 font-mono text-xs">
                      No question papers uploaded yet. Click "Upload Question Paper" to register your first paper.
                    </TableCell>
                  </TableRow>
                ) : (
                  questionPapers.map((qp) => (
                    <TableRow key={qp.id} className="border-zinc-200 hover:bg-zinc-50/50">
                      <TableCell>
                        <div className="font-bold text-zinc-900 text-xs">{qp.title}</div>
                        <div className="text-[11px] font-mono text-zinc-500">{qp.subject?.name || "Subject"} ({qp.subject?.code || "SUB"})</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-800">
                        {qp.gradeClass?.name || "Grade 10"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-900 border-zinc-300">
                          {qp.examCategory?.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-600">
                        {qp.maxMarks} Marks • {qp.durationMinutes} Mins
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-500">
                        {new Date(qp.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs font-mono border-zinc-300"
                            onClick={() => showToast("Downloading question paper: " + (qp.fileName || qp.title))}
                          >
                            <Download className="size-3 mr-1" /> Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-zinc-500 hover:text-red-700"
                            onClick={() => handleDeleteQuestionPaper(qp.id)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 4: CLASS TEACHER ROSTER & PARENT DETAILS                         */}
        {/* =================================================================== */}
        <TabsContent value="roster" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Class Roster & Student 360 ({classTeacherClass?.name || "Grade 10"} - {classTeacherSection?.name || "Section A"})
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                Full list of students enrolled under your class supervision, with parent and emergency contacts.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs bg-zinc-100 text-zinc-900 border-zinc-300">
              {classStudents.length} Students Enrolled
            </Badge>
          </div>

          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="border-zinc-200">
                  <TableHead className="w-20 font-mono text-xs text-zinc-700">Roll No</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Admission No</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Student Name</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Gender / Blood</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Parent / Guardian Contact</TableHead>
                  <TableHead className="text-right font-mono text-xs text-zinc-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-zinc-400 font-mono text-xs">
                      No students enrolled in this section.
                    </TableCell>
                  </TableRow>
                ) : (
                  classStudents.map((st) => (
                    <TableRow key={st.id} className="border-zinc-200 hover:bg-zinc-50/50">
                      <TableCell className="font-mono text-xs font-bold text-zinc-900">
                        {st.rollNumber || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-600">
                        {st.admissionNumber}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-zinc-900 text-xs">
                          {st.firstName} {st.lastName}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          DOB: {new Date(st.dob).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-700">
                        {st.gender} • <span className="font-semibold">{st.bloodGroup || "O+"}</span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-700">
                        <div>{st.parent?.fatherName || st.parent?.motherName || st.parent?.guardianName || "Parent Contact"}</div>
                        <div className="text-[10px] text-zinc-500">{st.parent?.phone || st.parent?.fatherPhone || "+1 (555) 019-2834"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs font-mono border-zinc-300"
                          onClick={() => {
                            setSelectedStudentForView(st);
                            setStudentModalOpen(true);
                          }}
                        >
                          <Eye className="size-3 mr-1" /> View 360 & Parents
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 5: MARKS ENROLLMENT                                             */}
        {/* =================================================================== */}
        <TabsContent value="marks" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Class Teacher Marks Enrollment Hub</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Enroll examination marks for your class students across all subjects taught in {classTeacherClass?.name || "Grade 10"}.
              </p>
            </div>
            <Button
              onClick={handleSaveMarks}
              disabled={savingMarks}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              {savingMarks ? (
                <>Saving Marks...</>
              ) : (
                <>
                  <Check className="size-3.5 mr-1.5" /> Save & Commit Marks
                </>
              )}
            </Button>
          </div>

          {/* Exam & Subject Selection Controls */}
          <Card className="border-zinc-200 p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Examination Name</Label>
                <Select value={marksExamName} onValueChange={setMarksExamName}>
                  <SelectTrigger className="font-mono text-xs border-zinc-300">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unit Test 1 (Term 1)">Unit Test 1 (Term 1)</SelectItem>
                    <SelectItem value="Monthly Unit Test (Sept 2026)">Monthly Unit Test (Sept 2026)</SelectItem>
                    <SelectItem value="Quarterly Examination">Quarterly Examination</SelectItem>
                    <SelectItem value="Half-Yearly Examination">Half-Yearly Examination</SelectItem>
                    <SelectItem value="Annual Board Prep Exam">Annual Board Prep Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Subject (All Grade Subjects)</Label>
                <Select value={marksSubjectId} onValueChange={setMarksSubjectId}>
                  <SelectTrigger className="font-mono text-xs border-zinc-300">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {allottedSubjects.map((sub: any) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code || "SUB"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Maximum Marks</Label>
                <Input
                  type="number"
                  value={marksMaxScore}
                  onChange={(e) => setMarksMaxScore(Number(e.target.value) || 100)}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Passing Threshold</Label>
                <Input
                  type="number"
                  value={marksPassScore}
                  onChange={(e) => setMarksPassScore(Number(e.target.value) || 40)}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>
            </div>
          </Card>

          {/* Student Marks Entry Table */}
          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="border-zinc-200">
                  <TableHead className="w-20 font-mono text-xs text-zinc-700">Roll No</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Student Name</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700 w-32">Marks Obtained</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700 w-24">Grade</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Teacher Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((st) => {
                  const scoreVal = marksScores[st.id]?.marks ?? 82;
                  const remarksVal = marksScores[st.id]?.remarks || "Good analytical comprehension";
                  const pct = marksMaxScore > 0 ? (scoreVal / marksMaxScore) * 100 : 0;
                  let grade = "F";
                  if (pct >= 90) grade = "A+";
                  else if (pct >= 80) grade = "A";
                  else if (pct >= 70) grade = "B";
                  else if (pct >= 60) grade = "C";
                  else if (pct >= 50) grade = "D";
                  else if (pct >= marksPassScore) grade = "E";

                  return (
                    <TableRow key={st.id} className="border-zinc-200 hover:bg-zinc-50/50">
                      <TableCell className="font-mono text-xs font-bold text-zinc-900">
                        {st.rollNumber || "01"}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-zinc-900 text-xs">{st.firstName} {st.lastName}</div>
                        <div className="font-mono text-[10px] text-zinc-400">{st.admissionNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            min={0}
                            max={marksMaxScore}
                            value={scoreVal}
                            onChange={(e) => {
                              const v = Math.min(marksMaxScore, Math.max(0, Number(e.target.value)));
                              setMarksScores({
                                ...marksScores,
                                [st.id]: { marks: v, remarks: remarksVal },
                              });
                            }}
                            className="h-8 w-20 font-mono text-xs border-zinc-300 font-bold"
                          />
                          <span className="font-mono text-xs text-zinc-400">/ {marksMaxScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs font-bold ${
                            grade === "A+" || grade === "A"
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : grade === "F"
                              ? "bg-zinc-100 text-red-700 border-red-300"
                              : "bg-zinc-100 text-zinc-900 border-zinc-300"
                          }`}
                        >
                          {grade} ({Math.round(pct)}%)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={remarksVal}
                          onChange={(e) => {
                            setMarksScores({
                              ...marksScores,
                              [st.id]: { marks: scoreVal, remarks: e.target.value },
                            });
                          }}
                          placeholder="Add remark..."
                          className="h-8 font-mono text-xs border-zinc-300"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 6: ATTENDANCE & MONTH-WISE EXCEL EXPORT                         */}
        {/* =================================================================== */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Daily Attendance & Month-wise Excel Export ({classTeacherClass?.name || "Grade 10"} - {classTeacherSection?.name || "Section A"})
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                Record day-wise attendance for your class section and export full monthly attendance matrices as spreadsheet (.xlsx).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllPresent}
                className="text-xs font-mono border-zinc-300"
              >
                <Check className="size-3 mr-1" /> Mark All Present
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAttendance}
                disabled={savingAttendance}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                <CheckCircle2 className="size-3.5 mr-1.5" />
                {savingAttendance ? "Saving..." : "Save Today's Attendance"}
              </Button>
            </div>
          </div>

          {/* Daily Attendance Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-zinc-200 p-4 shadow-xs md:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                <div className="flex items-center gap-3">
                  <Label className="font-mono text-xs text-zinc-700">Attendance Date:</Label>
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="h-8 w-40 font-mono text-xs border-zinc-300"
                  />
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-zinc-100 text-zinc-800">
                  {Object.values(attendanceRecords).filter((v) => v === "PRESENT").length} / {classStudents.length} Present
                </Badge>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-zinc-50">
                    <TableRow className="border-zinc-200">
                      <TableHead className="w-16 font-mono text-xs">Roll</TableHead>
                      <TableHead className="font-mono text-xs">Student</TableHead>
                      <TableHead className="font-mono text-xs text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.map((st) => {
                      const curStatus = attendanceRecords[st.id] || "PRESENT";
                      return (
                        <TableRow key={st.id} className="border-zinc-100">
                          <TableCell className="font-mono text-xs font-bold text-zinc-900">
                            {st.rollNumber || "-"}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-xs text-zinc-900">{st.firstName} {st.lastName}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {["PRESENT", "ABSENT", "LATE", "HALF_DAY", "LEAVE"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setAttendanceRecords({
                                      ...attendanceRecords,
                                      [st.id]: opt,
                                    });
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
                                    curStatus === opt
                                      ? opt === "PRESENT"
                                        ? "bg-zinc-900 text-white"
                                        : opt === "ABSENT"
                                        ? "bg-red-700 text-white"
                                        : "bg-zinc-200 text-zinc-900"
                                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                  }`}
                                >
                                  {opt === "PRESENT"
                                    ? "P"
                                    : opt === "ABSENT"
                                    ? "A"
                                    : opt === "LATE"
                                    ? "L"
                                    : opt === "HALF_DAY"
                                    ? "HD"
                                    : "LV"}
                                </button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Month-Wise Excel Export Card */}
            <Card className="border-zinc-200 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="size-5 text-zinc-900" />
                  <h3 className="font-bold text-sm text-zinc-900">Month-Wise Excel Export</h3>
                </div>
                <p className="text-xs text-zinc-500 font-mono mb-4">
                  Generates an official formatted Microsoft Excel (.xlsx) register sheet with all 31 days and attendance percentages.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-xs text-zinc-700">Month</Label>
                    <Select
                      value={exportMonth.toString()}
                      onValueChange={(v) => setExportMonth(parseInt(v))}
                    >
                      <SelectTrigger className="font-mono text-xs border-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                          <SelectItem key={m} value={(idx + 1).toString()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-mono text-xs text-zinc-700">Academic Year</Label>
                    <Select
                      value={exportYear.toString()}
                      onValueChange={(v) => setExportYear(parseInt(v))}
                    >
                      <SelectTrigger className="font-mono text-xs border-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4">
                <Button
                  onClick={handleExportMonthlyExcel}
                  disabled={exportingExcel}
                  className="w-full bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
                >
                  <Download className="size-3.5 mr-1.5" />
                  {exportingExcel ? "Generating Excel..." : "Export Month Register (.xlsx)"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Student Leave Requests (Submitted by Parents) */}
          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-950 font-sans flex items-center gap-2">
                    <Briefcase className="size-4 text-zinc-900" />
                    Student Leave Applications (Parent Submissions)
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500 mt-0.5">
                    Leave requests submitted by parents for your class. Approving automatically marks attendance records as LEAVE.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-white text-zinc-800">
                  {studentLeaves.filter((l) => l.status === "PENDING").length} Pending Review
                </Badge>
              </div>
            </CardHeader>
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="border-zinc-200">
                  <TableHead className="font-mono text-xs text-zinc-700">Student</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Leave Type</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Duration</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Reason / Notes</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Parent Info</TableHead>
                  <TableHead className="text-right font-mono text-xs text-zinc-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentLeaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-zinc-400 font-mono text-xs">
                      No student leave requests submitted for this class.
                    </TableCell>
                  </TableRow>
                ) : (
                  studentLeaves.map((lv) => (
                    <TableRow key={lv.id} className="border-zinc-100 hover:bg-zinc-50/50">
                      <TableCell>
                        <div className="font-bold text-xs text-zinc-900">
                          {lv.student?.firstName} {lv.student?.lastName}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-500">
                          Roll: {lv.student?.rollNumber || "-"} • Adm: {lv.student?.admissionNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-800 border-zinc-300">
                          {lv.leaveType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-700">
                        {new Date(lv.startDate).toLocaleDateString()} - {new Date(lv.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-700 max-w-xs">
                        {lv.reason}
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-zinc-600">
                        {lv.parent?.guardianName || lv.parent?.fatherName || "Parent"} ({lv.parent?.phone || "N/A"})
                      </TableCell>
                      <TableCell className="text-right">
                        {lv.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              disabled={decidingLeaveId === lv.id}
                              onClick={() => handleStudentLeaveDecision(lv.id, "APPROVED")}
                              className="h-7 px-2.5 bg-zinc-900 text-white font-mono text-[11px] hover:bg-zinc-800"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={decidingLeaveId === lv.id}
                              onClick={() => handleStudentLeaveDecision(lv.id, "REJECTED")}
                              className="h-7 px-2.5 font-mono text-[11px] border-zinc-300 hover:bg-zinc-100"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] ${
                              lv.status === "APPROVED"
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {lv.status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>


        {/* =================================================================== */}
        {/* TAB 7: DAILY HOMEWORK & ASSIGNMENTS                                 */}
        {/* =================================================================== */}
        <TabsContent value="homework" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Daily Homework & Learning Assignments</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Assign homework daily for your classes and view date-wise records of all learning assignments.
              </p>
            </div>
            <Button
              onClick={() => setHwModalOpen(true)}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              <Plus className="size-3.5 mr-1.5" /> Assign Daily Homework
            </Button>
          </div>

          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="border-zinc-200">
                  <TableHead className="font-mono text-xs text-zinc-700">Assigned Date</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Subject & Title</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Due Date</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Submissions</TableHead>
                  <TableHead className="text-right font-mono text-xs text-zinc-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeworkList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-400 font-mono text-xs">
                      No homework assigned yet. Click "Assign Daily Homework" to publish assignments for your class.
                    </TableCell>
                  </TableRow>
                ) : (
                  homeworkList.map((hw) => (
                    <TableRow key={hw.id} className="border-zinc-200 hover:bg-zinc-50/50">
                      <TableCell className="font-mono text-xs text-zinc-500">
                        {new Date(hw.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-zinc-900 text-xs">{hw.title}</div>
                        <div className="font-mono text-[10px] text-zinc-500">{hw.subject?.name || "Subject"} • {hw.description}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-zinc-900">
                        {new Date(hw.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-zinc-700">
                            {hw._count?.submissions || 0} Submitted
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenSubmissions(hw)}
                            className="h-6 px-2 text-[10px] font-mono border-zinc-300 hover:bg-zinc-100"
                          >
                            <Eye className="size-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-900 border-zinc-300">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB: LESSON PLANS & SYLLABUS PROGRESS                               */}
        {/* =================================================================== */}
        <TabsContent value="syllabus" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Lesson Plans & Syllabus Coverage Tracker</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Create chapter lesson plans, track syllabus completion percentage, and share study materials reflecting directly in parent portals.
              </p>
            </div>
            <Button
              onClick={() => setLpModalOpen(true)}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              <Plus className="size-3.5 mr-1.5" /> Create Lesson Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessonPlans.length === 0 ? (
              <div className="col-span-3 text-center py-12 border border-dashed border-zinc-200 rounded-lg text-zinc-400 font-mono text-xs">
                No lesson plans recorded yet. Click "Create Lesson Plan" to begin tracking syllabus progress.
              </div>
            ) : (
              lessonPlans.map((lp) => (
                <Card key={lp.id} className="border-zinc-200 shadow-xs flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-800 border-zinc-300">
                        {lp.gradeClass?.name || "Class"} • {lp.subject?.name || "Subject"}
                      </Badge>
                      <Badge
                        className={`font-mono text-[9px] ${
                          lp.status === "COMPLETED"
                            ? "bg-zinc-900 text-white"
                            : lp.status === "IN_PROGRESS"
                            ? "bg-zinc-200 text-zinc-900"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {lp.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold text-zinc-950 mt-2">{lp.title}</CardTitle>
                    {lp.description && (
                      <CardDescription className="text-xs text-zinc-600 font-sans line-clamp-2 mt-1">
                        {lp.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 pt-1 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-zinc-500">Syllabus Completion</span>
                        <span className="font-bold text-zinc-900">{lp.completionRate}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200">
                        <div
                          className="bg-zinc-900 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, lp.completionRate))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>Planned: {lp.plannedDate ? new Date(lp.plannedDate).toLocaleDateString() : "Flexible"}</span>
                      {lp.resourcesUrl && (
                        <a
                          href={lp.resourcesUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-900 font-medium underline flex items-center gap-1"
                        >
                          <ExternalLink className="size-2.5" /> Notes
                        </a>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50 rounded-b-lg">
                    <div className="flex items-center gap-1">
                      {[25, 50, 75, 100].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => handleUpdateLpProgress(lp.id, rate)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold transition-all ${
                            lp.completionRate >= rate ? "bg-zinc-900 text-white" : "bg-zinc-200/60 text-zinc-700 hover:bg-zinc-200"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLessonPlan(lp.id)}
                      className="h-6 w-6 p-0 text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB: PARENT COMMUNICATION & ANNOUNCEMENTS                           */}
        {/* =================================================================== */}
        <TabsContent value="communication" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Parent Communication & Class Circulars</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Direct two-way messaging with assigned parents and broadcast classroom announcements.
              </p>
            </div>
            <Button
              onClick={() => setAnnouncementModalOpen(true)}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              <Megaphone className="size-3.5 mr-1.5" /> Broadcast Announcement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student / Parent Directory */}
            <Card className="border-zinc-200 shadow-xs md:col-span-1">
              <CardHeader className="py-3 bg-zinc-50 border-b border-zinc-200">
                <CardTitle className="text-xs font-bold font-mono text-zinc-900 uppercase">
                  Class Students & Parents
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-zinc-100 max-h-[480px] overflow-y-auto">
                {classStudents.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-zinc-400">
                    No students assigned to class.
                  </div>
                ) : (
                  classStudents.map((st) => {
                    const isSelected = selectedCommStudent?.id === st.id;
                    return (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => handleSelectCommStudent(st)}
                        className={`w-full text-left p-3 transition-colors flex items-center justify-between ${
                          isSelected ? "bg-zinc-100 font-semibold" : "hover:bg-zinc-50"
                        }`}
                      >
                        <div>
                          <div className="text-xs text-zinc-950 font-bold">{st.firstName} {st.lastName}</div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            Parent: {st.parent?.guardianName || st.parent?.fatherName || "Parent Guardian"}
                          </div>
                        </div>
                        <ChevronRight className="size-3.5 text-zinc-400" />
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Chat Thread */}
            <Card className="border-zinc-200 shadow-xs md:col-span-2 flex flex-col justify-between h-[520px]">
              <CardHeader className="py-3 bg-zinc-50 border-b border-zinc-200 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-bold text-zinc-900">
                    {selectedCommStudent
                      ? `Conversation: ${selectedCommStudent.firstName} ${selectedCommStudent.lastName}`
                      : "Select a student to view conversation"}
                  </CardTitle>
                  {selectedCommStudent && (
                    <CardDescription className="text-[10px] font-mono text-zinc-500">
                      Parent: {selectedCommStudent.parent?.guardianName || selectedCommStudent.parent?.fatherName || "Parent"} ({selectedCommStudent.parent?.phone || "N/A"})
                    </CardDescription>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {!selectedCommStudent ? (
                  <div className="h-full flex items-center justify-center text-zinc-400 font-mono text-xs">
                    Choose a student on the left to start direct parent communication.
                  </div>
                ) : messagesList.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-400 font-mono text-xs">
                    No messages in this thread yet. Send a note below.
                  </div>
                ) : (
                  messagesList.map((m) => {
                    const isTeacher = m.senderRole === "TEACHER";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isTeacher ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md rounded-lg p-3 text-xs ${
                            isTeacher
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-950 border border-zinc-200"
                          }`}
                        >
                          <div className="text-[10px] font-mono opacity-70 mb-1">
                            {m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div>{m.message}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>

              <CardFooter className="p-3 border-t border-zinc-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                  <Input
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={selectedCommStudent ? "Type message to parent..." : "Select a student first..."}
                    disabled={!selectedCommStudent || sendingMessage}
                    className="font-mono text-xs border-zinc-300"
                  />
                  <Button
                    type="submit"
                    disabled={!selectedCommStudent || !newMessageText.trim() || sendingMessage}
                    className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800 shrink-0"
                  >
                    <Send className="size-3.5 mr-1" /> Send
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB: CLASS ACADEMIC & ATTENDANCE REPORTS                            */}
        {/* =================================================================== */}
        <TabsContent value="reports" className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Class Academic & Attendance Analytics</h2>
            <p className="text-xs text-zinc-500 font-mono">
              Consolidated performance and attendance metrics for {classTeacherClass?.name || "Assigned Class"}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Enrolled Students</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">{classStudents.length}</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Active class strength</div>
            </Card>
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Monthly Attendance Rate</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">94.2%</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Campus benchmark &gt;90%</div>
            </Card>
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Syllabus Completion</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                {lessonPlans.length > 0
                  ? `${Math.round(lessonPlans.reduce((acc, lp) => acc + (lp.completionRate || 0), 0) / lessonPlans.length)}%`
                  : "0%"}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Average across topics</div>
            </Card>
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Academic Pass Rate</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">96.8%</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Term 1 Assessment</div>
            </Card>
          </div>

          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b border-zinc-200 py-3">
              <CardTitle className="text-xs font-bold font-mono text-zinc-900 uppercase">
                Student Progress Summary
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="border-zinc-200">
                  <TableHead className="font-mono text-xs">Roll</TableHead>
                  <TableHead className="font-mono text-xs">Student Full Name</TableHead>
                  <TableHead className="font-mono text-xs">Admission No</TableHead>
                  <TableHead className="font-mono text-xs">Parent Contact</TableHead>
                  <TableHead className="font-mono text-xs">Attendance Status</TableHead>
                  <TableHead className="text-right font-mono text-xs">Academic Standing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((st) => (
                  <TableRow key={st.id} className="border-zinc-100 hover:bg-zinc-50/50">
                    <TableCell className="font-mono text-xs font-bold text-zinc-900">
                      {st.rollNumber || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-xs text-zinc-900">
                      {st.firstName} {st.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-500">
                      {st.admissionNumber}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-600">
                      {st.parent?.guardianName || st.parent?.fatherName || "Parent"} ({st.parent?.phone || "N/A"})
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-800">
                        {attendanceRecords[st.id] || "PRESENT"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs font-semibold text-zinc-900">Good Standing</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>


        {/* =================================================================== */}
        {/* TAB 8: LEAVE APPLICATIONS                                           */}
        {/* =================================================================== */}
        <TabsContent value="leaves" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Faculty Leave Applications & History</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Submit leave requests directly to the Principal's approval queue and track application status.
              </p>
            </div>
            <Button
              onClick={() => setLeaveModalOpen(true)}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              <Plus className="size-3.5 mr-1.5" /> Apply for Leave
            </Button>
          </div>

          {/* Leave Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Casual Leave (CL)</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">12 Days</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Annual allotment for personal errands</div>
            </Card>
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Sick / Medical Leave (ML)</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">8 Days</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Medical certificate required for &gt;2 days</div>
            </Card>
            <Card className="border-zinc-200 p-4 shadow-xs">
              <div className="text-xs font-mono text-zinc-500">Earned / Annual Leave</div>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">15 Days</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">Cumulative vacation leave</div>
            </Card>
          </div>

          {/* Leave Applications Table */}
          <Card className="border-zinc-200 shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="border-zinc-200">
                  <TableHead className="font-mono text-xs text-zinc-700">Leave Type</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Start Date</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">End Date</TableHead>
                  <TableHead className="font-mono text-xs text-zinc-700">Reason</TableHead>
                  <TableHead className="text-right font-mono text-xs text-zinc-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leavesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-400 font-mono text-xs">
                      No leave applications on file.
                    </TableCell>
                  </TableRow>
                ) : (
                  leavesList.map((lv) => (
                    <TableRow key={lv.id} className="border-zinc-200 hover:bg-zinc-50/50">
                      <TableCell className="font-mono text-xs font-bold text-zinc-900">
                        {lv.leaveType}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-700">
                        {new Date(lv.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-700">
                        {new Date(lv.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-600 max-w-xs truncate">
                        {lv.reason}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] ${
                            lv.status === "APPROVED"
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : lv.status === "REJECTED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-zinc-100 text-zinc-800 border-zinc-300"
                          }`}
                        >
                          {lv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 9: ACADEMIC CALENDAR (PRINCIPAL'S SCHEDULE)                     */}
        {/* =================================================================== */}
        <TabsContent value="calendar" className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Academic Calendar & Campus Events</h2>
            <p className="text-xs text-zinc-500 font-mono">
              Official school calendar and schedule published by the Principal and Academic Council.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schoolEvents.length === 0 ? (
              <div className="col-span-3 text-center py-12 border border-dashed border-zinc-200 rounded-lg text-zinc-400 font-mono text-xs">
                No events currently scheduled by Principal.
              </div>
            ) : (
              schoolEvents.map((ev) => (
                <Card key={ev.id} className="border-zinc-200 shadow-xs hover:border-zinc-400 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-[10px] bg-zinc-100 text-zinc-800 border-zinc-300">
                        {new Date(ev.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Badge>
                      <Badge className="font-mono text-[9px] bg-zinc-900 text-white">
                        {ev.targetClasses || "All Campus"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-zinc-950 mt-2">{ev.title}</CardTitle>
                    <CardDescription className="font-mono text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="size-3" /> {ev.venue || "Campus Auditorium"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-600 font-sans pt-1 pb-3">
                    {ev.description || "Official academic event scheduled by Principal's office."}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* =================================================================== */}
        {/* TAB 10: PROFILE & PASSWORD RESET                                    */}
        {/* =================================================================== */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Faculty Details Card */}
            <Card className="border-zinc-200 shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold text-zinc-950">Faculty Profile Details</CardTitle>
                <CardDescription className="font-mono text-xs text-zinc-500">
                  Your registered personnel credentials on the school payroll and faculty registry.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs text-zinc-700">
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Full Name:</span>
                  <span className="font-bold text-zinc-900">{currentTeacher?.name || currentUser?.name || "Faculty Member"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Employee Code:</span>
                  <span className="font-bold text-zinc-900">{currentTeacher?.employeeCode || "EMP-FACULTY"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Official Email:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.email || currentUser?.email || "faculty@greenwoodhigh.edu"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Phone Number:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.phone || currentUser?.phone || "Not specified"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Designation:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.designation || "Faculty Member"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Qualification:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.qualification || "Graduate Faculty (B.Ed)"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Specialization:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.specialization || "General Academics"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="text-zinc-500">Experience:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.experienceYears !== undefined ? `${currentTeacher.experienceYears} Years` : "5 Years"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-500">Employment Type:</span>
                  <span className="font-semibold text-zinc-900">{currentTeacher?.employmentType || "FULL_TIME"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Password Reset Card */}
            <Card className="border-zinc-200 shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold text-zinc-950">Reset Initial Faculty Password</CardTitle>
                <CardDescription className="font-mono text-xs text-zinc-500">
                  Replace your initial generated password (e.g. <span className="text-zinc-900 font-semibold">Faculty@123</span>) with a personal secure password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-xs text-zinc-700">Current / Initial Generated Password</Label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="e.g. Faculty@123"
                      className="font-mono text-xs border-zinc-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-mono text-xs text-zinc-700">New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="font-mono text-xs border-zinc-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-mono text-xs text-zinc-700">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="font-mono text-xs border-zinc-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={resettingPassword}
                    className="w-full bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800 mt-2"
                  >
                    <KeyRound className="size-3.5 mr-1.5" />
                    {resettingPassword ? "Updating Password..." : "Reset & Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* =================================================================== */}
      {/* MODAL: UPLOAD QUESTION PAPER                                        */}
      {/* =================================================================== */}
      <Dialog open={qpModalOpen} onOpenChange={setQpModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">Upload Exam Question Paper</DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Select grade, subject, and exam category. Grades 10, 11, and 12 include Daily, Weekly, and Monthly Unit Tests.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadQuestionPaper} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Grade / Class *</Label>
              <Select
                value={qpSelectedClassId}
                onValueChange={(val) => {
                  setQpSelectedClassId(val);
                  setQpSelectedSubjectId("");
                }}
              >
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Subject (Available for Selected Grade) *</Label>
              <Select value={qpSelectedSubjectId} onValueChange={setQpSelectedSubjectId}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue
                    placeholder={
                      !qpSelectedClassId
                        ? "Select Grade First"
                        : subjectsForSelectedGrade.length > 0
                        ? "Select Subject"
                        : "No subjects found for this grade"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subjectsForSelectedGrade.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code || "SUB"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs text-zinc-700">Exam Category *</Label>
                {isSeniorGrade && (
                  <span className="text-[10px] font-mono text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-300">
                    Senior Grade (Daily/Weekly/Monthly Unlocked)
                  </span>
                )}
              </div>
              <Select value={qpCategory} onValueChange={setQpCategory}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Additional categories ONLY for Grade 10, 11, 12 */}
                  {isSeniorGrade && (
                    <>
                      <SelectItem value="DAILY_UNIT_TEST">Daily Unit Test</SelectItem>
                      <SelectItem value="WEEKLY_UNIT_TEST">Weekly Unit Test</SelectItem>
                      <SelectItem value="MONTHLY_UNIT_TEST">Monthly Unit Test</SelectItem>
                    </>
                  )}
                  {/* Standard categories for all grades */}
                  <SelectItem value="UNIT_TEST">Unit Test</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly Exam</SelectItem>
                  <SelectItem value="HALF_YEARLY">Half-Yearly Exam</SelectItem>
                  <SelectItem value="ANNUAL">Annual Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Question Paper Title *</Label>
              <Input
                type="text"
                value={qpTitle}
                onChange={(e) => setQpTitle(e.target.value)}
                placeholder="e.g. Grade 10 Mathematics - Monthly Unit Test (Sept 2026)"
                className="font-mono text-xs border-zinc-300"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Max Marks</Label>
                <Input
                  type="number"
                  value={qpMaxMarks}
                  onChange={(e) => setQpMaxMarks(e.target.value)}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Time (Mins)</Label>
                <Input
                  type="number"
                  value={qpDuration}
                  onChange={(e) => setQpDuration(e.target.value)}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Exam Date</Label>
                <Input
                  type="date"
                  value={qpExamDate}
                  onChange={(e) => setQpExamDate(e.target.value)}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Attach Question Paper File (PDF/Word)</Label>
              <div className="border border-dashed border-zinc-300 rounded p-3 text-center bg-zinc-50">
                <FileText className="size-5 text-zinc-400 mx-auto mb-1" />
                <span className="text-xs font-mono text-zinc-700">{qpFileName}</span>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Ready for upload (1.2 MB)</p>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQpModalOpen(false)}
                className="text-xs font-mono border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                Upload Question Paper
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: VIEW STUDENT 360 & PARENTS DETAILS                           */}
      {/* =================================================================== */}
      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
              Student Profile & Parent Information
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Class Teacher supervision details for {selectedStudentForView?.firstName} {selectedStudentForView?.lastName}.
            </DialogDescription>
          </DialogHeader>

          {selectedStudentForView && (
            <div className="space-y-4 py-2 text-xs font-mono text-zinc-700">
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Student Name:</span>
                  <span className="font-bold text-zinc-900">{selectedStudentForView.firstName} {selectedStudentForView.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Roll Number:</span>
                  <span className="font-bold text-zinc-900">{selectedStudentForView.rollNumber || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Admission No:</span>
                  <span className="font-bold text-zinc-900">{selectedStudentForView.admissionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Gender & Blood Group:</span>
                  <span className="font-semibold text-zinc-900">{selectedStudentForView.gender} • {selectedStudentForView.bloodGroup || "O+"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date of Birth:</span>
                  <span className="font-semibold text-zinc-900">{new Date(selectedStudentForView.dob).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Parents Section */}
              <div className="border border-zinc-200 p-3 rounded-lg space-y-2">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-2">
                  Parent / Guardian Details
                </h4>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Father's Name:</span>
                  <span className="font-semibold text-zinc-900">{selectedStudentForView.parent?.fatherName || "David Chen"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Father's Phone:</span>
                  <span className="font-semibold text-zinc-900">{selectedStudentForView.parent?.fatherPhone || "+1 (555) 482-9901"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Mother's Name:</span>
                  <span className="font-semibold text-zinc-900">{selectedStudentForView.parent?.motherName || "Sarah Chen"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Mother's Phone:</span>
                  <span className="font-semibold text-zinc-900">{selectedStudentForView.parent?.motherPhone || "+1 (555) 482-9902"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Primary Contact Email:</span>
                  <span className="font-semibold text-zinc-900">{selectedStudentForView.parent?.email || "chen.family@example.com"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Residential Address:</span>
                  <span className="font-semibold text-zinc-900 text-right max-w-[240px] truncate">
                    {selectedStudentForView.address || "742 Evergreen Terrace, West Hills"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setStudentModalOpen(false)}
              className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
            >
              Close Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: ASSIGN DAILY HOMEWORK                                        */}
      {/* =================================================================== */}
      <Dialog open={hwModalOpen} onOpenChange={setHwModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">Assign Daily Homework</DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Publish classroom homework assignments with instructions and due dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateHomework} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Class & Section *</Label>
              <Select value={hwClassId} onValueChange={setHwClassId}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Subject *</Label>
              <Select value={hwSubjectId} onValueChange={setHwSubjectId}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {allottedSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code || "SUB"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Assignment Title *</Label>
              <Input
                type="text"
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                placeholder="e.g. Exercise 4.2 - Quadratic Equations & Formulas"
                className="font-mono text-xs border-zinc-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Instructions / Description</Label>
              <Textarea
                value={hwDescription}
                onChange={(e) => setHwDescription(e.target.value)}
                placeholder="Detailed instructions for students..."
                className="font-mono text-xs border-zinc-300"
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Submission Due Date *</Label>
              <Input
                type="date"
                value={hwDueDate}
                onChange={(e) => setHwDueDate(e.target.value)}
                className="font-mono text-xs border-zinc-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Attach Assignment File / Resource URL (Optional)</Label>
              <Input
                type="url"
                value={hwAttachmentUrl}
                onChange={(e) => setHwAttachmentUrl(e.target.value)}
                placeholder="https://example.com/materials/worksheet-chapter-4.pdf"
                className="font-mono text-xs border-zinc-300"
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
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                Publish Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: APPLY FOR LEAVE                                              */}
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
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">Apply for Faculty Leave</DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Submit an official leave request for Principal review and approval.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplyLeave} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Leave Type *</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASUAL">Casual Leave (CL)</SelectItem>
                  <SelectItem value="SICK">Sick / Medical Leave (ML)</SelectItem>
                  <SelectItem value="ANNUAL">Annual / Earned Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">From Date *</Label>
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
                <Label className="font-mono text-xs text-zinc-700">To Date *</Label>
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
                placeholder="Reason for absence..."
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
                disabled={submittingLeave}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                {submittingLeave ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: REVIEW HOMEWORK SUBMISSIONS                                  */}
      {/* =================================================================== */}
      <Dialog open={submissionsModalOpen} onOpenChange={setSubmissionsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
                  Homework Submissions Review
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-zinc-500">
                  {selectedHwForSubmissions?.title} • Due: {selectedHwForSubmissions?.dueDate ? new Date(selectedHwForSubmissions.dueDate).toLocaleDateString() : "-"}
                </DialogDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                {hwSubmissions.length} Submissions
              </Badge>
            </div>
          </DialogHeader>

          {loadingSubmissions ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              Loading assignment submissions...
            </div>
          ) : hwSubmissions.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 font-mono text-xs">
              No students or parents have submitted work for this assignment yet.
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {hwSubmissions.map((sub: any) => {
                const studentName = sub.student
                  ? `${sub.student.firstName} ${sub.student.lastName}`
                  : sub.studentName || "Student";
                const isParent = sub.submittedByRole === "PARENT";
                const curGrading = gradingInputs[sub.id] || { grade: "", feedback: "", allowResubmit: false };

                return (
                  <div
                    key={sub.id}
                    className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-950">{studentName}</span>
                          <span className="font-mono text-xs text-zinc-500">
                            (Roll: {sub.student?.rollNumber || "-"})
                          </span>
                          <Badge
                            className={`text-[10px] font-mono px-2 py-0.5 ${
                              isParent
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-zinc-100 text-zinc-800 border-zinc-200"
                            }`}
                          >
                            {isParent ? "Submitted by Parent" : "Submitted by Student"}
                          </Badge>
                          {sub.status === "RESUBMISSION_ALLOWED" && (
                            <Badge className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 border-amber-200">
                              Resubmission Allowed
                            </Badge>
                          )}
                          {sub.status === "REVIEWED" && (
                            <Badge className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border-emerald-200">
                              Graded
                            </Badge>
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-zinc-500 mt-1">
                          Submitted on {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {sub.content && (
                      <div className="text-xs text-zinc-800 bg-white border border-zinc-200 p-2.5 rounded font-mono">
                        <span className="text-zinc-400 block text-[10px] uppercase tracking-wider mb-1">
                          Student/Parent Notes:
                        </span>
                        {sub.content}
                      </div>
                    )}

                    {sub.fileUrl && (
                      <div className="flex items-center gap-2">
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2.5 py-1 rounded border border-blue-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View / Download Submitted Assignment
                        </a>
                      </div>
                    )}

                    {/* Grading Form */}
                    <div className="pt-2 border-t border-zinc-200 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div>
                          <Label className="font-mono text-[11px] text-zinc-700">Marks / Grade *</Label>
                          <Input
                            type="text"
                            placeholder="e.g. 95/100 or A+"
                            value={curGrading.grade}
                            onChange={(e) =>
                              setGradingInputs({
                                ...gradingInputs,
                                [sub.id]: { ...curGrading, grade: e.target.value },
                              })
                            }
                            className="font-mono text-xs border-zinc-300 h-8 mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="font-mono text-[11px] text-zinc-700">Teacher Feedback & Remarks</Label>
                          <Input
                            type="text"
                            placeholder="e.g. Well researched, excellent presentation!"
                            value={curGrading.feedback}
                            onChange={(e) =>
                              setGradingInputs({
                                ...gradingInputs,
                                [sub.id]: { ...curGrading, feedback: e.target.value },
                              })
                            }
                            className="font-mono text-xs border-zinc-300 h-8 mt-1"
                          />
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                          <Checkbox
                            id={`resubmit-${sub.id}`}
                            checked={curGrading.allowResubmit}
                            onCheckedChange={(checked) =>
                              setGradingInputs({
                                ...gradingInputs,
                                [sub.id]: { ...curGrading, allowResubmit: !!checked },
                              })
                            }
                          />
                          <label
                            htmlFor={`resubmit-${sub.id}`}
                            className="font-mono text-[11px] text-zinc-700 cursor-pointer select-none"
                          >
                            Allow Resubmission
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSaveGrade(sub.id)}
                          disabled={savingGradeId === sub.id}
                          className="font-mono text-xs bg-zinc-900 text-white hover:bg-zinc-800 h-8 px-3"
                        >
                          {savingGradeId === sub.id ? "Saving..." : "Save Evaluation"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmissionsModalOpen(false)}
              className="text-xs font-mono border-zinc-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: CREATE LESSON PLAN                                           */}
      {/* =================================================================== */}
      <Dialog open={lpModalOpen} onOpenChange={setLpModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
              Create Lesson Plan & Syllabus Topic
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Schedule syllabus chapters, set milestones, and provide study materials for students and parents.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLessonPlan} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Class *</Label>
              <Select value={lpClassId} onValueChange={setLpClassId}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Subject *</Label>
              <Select value={lpSubjectId} onValueChange={setLpSubjectId}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {allottedSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code || "SUB"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Topic / Chapter Title *</Label>
              <Input
                type="text"
                value={lpTitle}
                onChange={(e) => setLpTitle(e.target.value)}
                placeholder="e.g. Chapter 4: Quadratic Equations & Roots"
                className="font-mono text-xs border-zinc-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Learning Objectives & Summary</Label>
              <Textarea
                value={lpDescription}
                onChange={(e) => setLpDescription(e.target.value)}
                placeholder="Key concepts, practice exercises, and expected outcomes..."
                className="font-mono text-xs border-zinc-300"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Target Date *</Label>
                <Input
                  type="date"
                  value={lpPlannedDate}
                  onChange={(e) => setLpPlannedDate(e.target.value)}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-xs text-zinc-700">Completion % ({lpCompletionRate}%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={lpCompletionRate}
                  onChange={(e) => setLpCompletionRate(Number(e.target.value))}
                  className="font-mono text-xs border-zinc-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Study Material / Resource URL</Label>
              <Input
                type="url"
                value={lpResourcesUrl}
                onChange={(e) => setLpResourcesUrl(e.target.value)}
                placeholder="https://drive.google.com/folder/maths-chapter4-notes"
                className="font-mono text-xs border-zinc-300"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLpModalOpen(false)}
                className="text-xs font-mono border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingLp}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                {savingLp ? "Saving..." : "Save Lesson Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: BROADCAST CLASS ANNOUNCEMENT                                 */}
      {/* =================================================================== */}
      <Dialog open={announcementModalOpen} onOpenChange={setAnnouncementModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
              Send Class Announcement
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-zinc-500">
              Broadcast circulars, notices, and test schedules directly to parent and student portals.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePublishAnnouncement} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Audience *</Label>
              <Select value={announcementAudience} onValueChange={setAnnouncementAudience}>
                <SelectTrigger className="font-mono text-xs border-zinc-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARENTS">Parents Only</SelectItem>
                  <SelectItem value="STUDENTS">Students Only</SelectItem>
                  <SelectItem value="ALL">All (Parents & Students)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Notice Title *</Label>
              <Input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Term 1 Science Project Deadline Extended"
                className="font-mono text-xs border-zinc-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-xs text-zinc-700">Notice Content *</Label>
              <Textarea
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Write full circular details or instructions..."
                className="font-mono text-xs border-zinc-300"
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAnnouncementModalOpen(false)}
                className="text-xs font-mono border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={publishingNotice}
                className="bg-zinc-900 text-white font-mono text-xs hover:bg-zinc-800"
              >
                {publishingNotice ? "Publishing..." : "Broadcast Notice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
