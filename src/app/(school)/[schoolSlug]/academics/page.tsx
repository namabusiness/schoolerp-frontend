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
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Plus,
  Building,
  UserCheck,
  Users,
  GraduationCap,
  Trash2,
  Phone,
  Mail,
  IdCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Search,
  ArrowRight,
  UserPlus,
  UserMinus,
  ShieldCheck,
  AlertTriangle,
  Dumbbell,
  Library,
  CalendarDays,
  Check,
  Eye,
  RefreshCw,
  FileCheck,
  SlidersHorizontal,
  FileSpreadsheet,
  BookMarked,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { erpApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AcademicSetupPage() {
  const [activeTab, setActiveTab] = React.useState("classes");
  const [loading, setLoading] = React.useState(true);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Core Data
  const [classes, setClasses] = React.useState<any[]>([]);
  const [staffList, setStaffList] = React.useState<any[]>([]);
  const [unassignedStudents, setUnassignedStudents] = React.useState<any[]>([]);

  // Selected Class & Section State
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [selectedSectionFilter, setSelectedSectionFilter] = React.useState<string>("ALL");
  const [classDetailLoading, setClassDetailLoading] = React.useState(false);
  const [classDetailData, setClassDetailData] = React.useState<{
    class: any;
    section: any;
    classTeacher: any;
    subjects: any[];
    students: any[];
    totalCount: number;
  } | null>(null);

  const [studentSearchQuery, setStudentSearchQuery] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Subjects Tab Grade Filter
  const [subjectGradeFilter, setSubjectGradeFilter] = React.useState<string>("ALL");

  // Reusable Modern Confirm Modal State
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
    onConfirm: async () => {},
  });
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  // 3-Second Field Error Thrower State
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const errorTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showErrors = (errors: Record<string, string>) => {
    setFormErrors(errors);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      setFormErrors({});
    }, 3000);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Dialog States
  const [isAddClassOpen, setIsAddClassOpen] = React.useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);
  const [isAssignTeacherOpen, setIsAssignTeacherOpen] = React.useState(false);
  const [isAssignStudentOpen, setIsAssignStudentOpen] = React.useState(false);
  const [targetClassForSection, setTargetClassForSection] = React.useState<any | null>(null);

  // Subject Modals State
  const [isAddSubjectOpen, setIsAddSubjectOpen] = React.useState(false);
  const [isAssignSubjectTeacherOpen, setIsAssignSubjectTeacherOpen] = React.useState(false);
  const [selectedSubjectForTeacher, setSelectedSubjectForTeacher] = React.useState<any | null>(null);

  // Form States
  const [classForm, setClassForm] = React.useState({
    name: "",
    code: "",
    initialSection: "Section A",
    classTeacherId: "NONE",
  });

  const [sectionForm, setSectionForm] = React.useState({
    name: "",
    capacity: "40",
    classTeacherId: "NONE",
  });

  const [teacherAssignForm, setTeacherAssignForm] = React.useState({
    teacherId: "NONE",
    targetType: "GRADE", // "GRADE" or "SECTION"
    sectionId: "",
  });

  const [studentAssignForm, setStudentAssignForm] = React.useState({
    studentId: "",
    classId: "",
    sectionId: "",
    rollNumber: "",
  });

  const [subjectForm, setSubjectForm] = React.useState({
    classId: "",
    name: "",
    code: "",
    periodsPerWeek: "4",
    teacherId: "NONE",
  });

  const [subjectTeacherAssignForm, setSubjectTeacherAssignForm] = React.useState({
    teacherId: "NONE",
  });

  // -------------------------------------------------------------
  // Timetable Matrix & Faculty Schedule State
  // -------------------------------------------------------------
  const [timetableClassId, setTimetableClassId] = React.useState<string>("");
  const [timetableSectionId, setTimetableSectionId] = React.useState<string>("ALL");
  const [timetableMode, setTimetableMode] = React.useState<"CLASS" | "FACULTY">("CLASS");
  const [selectedFacultyId, setSelectedFacultyId] = React.useState<string>("");
  const [facultyTimetableData, setFacultyTimetableData] = React.useState<any | null>(null);
  const [facultyTimetableLoading, setFacultyTimetableLoading] = React.useState(false);
  const [timetableData, setTimetableData] = React.useState<{
    slots: any[];
    periods: any[];
    class: any;
    section: any;
    totalSlots: number;
    draftCount: number;
    approvedCount: number;
  } | null>(null);
  const [timetableLoading, setTimetableLoading] = React.useState(false);

  // Timetable Generator Wizard Modal State
  const [isGenerateTimetableOpen, setIsGenerateTimetableOpen] = React.useState(false);
  const [generateConfig, setGenerateConfig] = React.useState<{
    classId: string;
    sectionId: string;
    startTime: string;
    periodDurationMinutes: number;
    periodsPerDay: number;
    daysCount: number;
    hasBreak: boolean;
    breakAfterPeriod: number;
    breakDurationMinutes: number;
    hasLunch: boolean;
    lunchAfterPeriod: number;
    lunchDurationMinutes: number;
    subjectAllocations: {
      subjectId: string;
      subjectName: string;
      subjectCode: string;
      teacherId: string;
      periodsPerWeek: number;
    }[];
    includePT: boolean;
    ptTeacherId: string;
    includeLibrary: boolean;
    libraryTeacherId: string;
  }>({
    classId: "",
    sectionId: "ALL",
    startTime: "08:30",
    periodDurationMinutes: 45,
    periodsPerDay: 7,
    daysCount: 5,
    hasBreak: true,
    breakAfterPeriod: 2,
    breakDurationMinutes: 15,
    hasLunch: true,
    lunchAfterPeriod: 4,
    lunchDurationMinutes: 40,
    subjectAllocations: [],
    includePT: true,
    ptTeacherId: "NONE",
    includeLibrary: true,
    libraryTeacherId: "NONE",
  });

  // Timetable Slot Inspector / Editor Modal State
  const [isEditSlotOpen, setIsEditSlotOpen] = React.useState(false);
  const [selectedSlotForEdit, setSelectedSlotForEdit] = React.useState<any | null>(null);
  const [slotEditForm, setSlotEditForm] = React.useState({
    subjectId: "",
    teacherId: "NONE",
    customNote: "",
  });
  const [slotSaving, setSlotSaving] = React.useState(false);

  // Map of teachers already assigned as class teacher across any grade or section
  const assignedClassTeachersMap = React.useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach((c) => {
      if (c.classTeacherId && c.classTeacher) {
        map.set(c.classTeacherId, `${c.name} (Grade Class Teacher)`);
      }
      (c.sections || []).forEach((sec: any) => {
        if (sec.classTeacherId && sec.classTeacher) {
          map.set(sec.classTeacherId, `${c.name} - ${sec.name}`);
        }
      });
    });
    return map;
  }, [classes]);

  // Load Classes, Staff, and Unassigned Students (Fast parallel fetch without cascading re-fetches)
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [classesRes, staffRes, unassignedRes] = await Promise.all([
        erpApi.getClasses().catch(() => []),
        erpApi.getStaff().catch(() => []),
        erpApi.getUnassignedStudents().catch(() => []),
      ]);

      const classList = Array.isArray(classesRes) ? classesRes : [];
      setClasses(classList);
      const staffArr = Array.isArray(staffRes) ? staffRes : [];
      setStaffList(staffArr);
      setUnassignedStudents(Array.isArray(unassignedRes) ? unassignedRes : []);

      // Select first class if none currently selected (functional setter prevents recreating loadData)
      setSelectedClassId((prev) => prev || (classList[0]?.id ?? null));
      setTimetableClassId((prev) => {
        if (!prev && classList.length > 0) {
          const firstSec = classList[0].sections?.[0]?.id || "ALL";
          setTimetableSectionId((secPrev) => secPrev || firstSec);
          return classList[0].id;
        }
        return prev;
      });
      setSelectedFacultyId((prev) => prev || (staffArr[0]?.id ?? null));
    } catch (err) {
      console.error("Failed to load academic setup data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Load Class Detail & Students Roster whenever selected class or section filter changes
  const loadClassRoster = React.useCallback(async (classId: string, sectionFilter: string) => {
    if (!classId) return;
    setClassDetailLoading(true);
    try {
      const roster = await erpApi.getClassStudents(classId, sectionFilter);
      setClassDetailData(roster);
    } catch (err) {
      console.error("Failed to load class roster:", err);
    } finally {
      setClassDetailLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedClassId) {
      loadClassRoster(selectedClassId, selectedSectionFilter);
    }
  }, [selectedClassId, selectedSectionFilter, loadClassRoster]);

  // -------------------------------------------------------------
  // Timetable Loading & Mutators
  // -------------------------------------------------------------
  const loadTimetable = React.useCallback(async (classId: string, sectionId?: string) => {
    if (!classId) return;
    setTimetableLoading(true);
    try {
      const data = await erpApi.getTimetable({
        classId,
        sectionId: sectionId && sectionId !== "ALL" ? sectionId : undefined,
      });
      setTimetableData(data);
    } catch (err) {
      console.error("Failed to load timetable:", err);
    } finally {
      setTimetableLoading(false);
    }
  }, []);

  const loadFacultyTimetable = React.useCallback(async (teacherId: string) => {
    if (!teacherId) return;
    setFacultyTimetableLoading(true);
    try {
      const data = await erpApi.getFacultyTimetable(teacherId);
      setFacultyTimetableData(data);
    } catch (err) {
      console.error("Failed to load faculty timetable:", err);
    } finally {
      setFacultyTimetableLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "timetable") {
      if (timetableMode === "CLASS" && timetableClassId) {
        loadTimetable(timetableClassId, timetableSectionId);
      } else if (timetableMode === "FACULTY" && selectedFacultyId) {
        loadFacultyTimetable(selectedFacultyId);
      }
    }
  }, [activeTab, timetableMode, timetableClassId, timetableSectionId, selectedFacultyId, loadTimetable, loadFacultyTimetable]);

  const openGenerateModal = () => {
    const targetClass = classes.find((c) => c.id === (timetableClassId || classes[0]?.id));
    const targetClassId = targetClass?.id || "";
    const targetSec = targetClass?.sections?.[0]?.id || "ALL";
    const classSubs = targetClass?.subjects || [];

    const isPT = (s: any) => {
      const n = (s.name || "").toLowerCase();
      const c = (s.code || "").toLowerCase();
      return n.includes("physical education") || n.includes("pt") || c.includes("pe");
    };
    const isLib = (s: any) => {
      const n = (s.name || "").toLowerCase();
      const c = (s.code || "").toLowerCase();
      return n.includes("library") || c.includes("lib");
    };

    const ptSub = classSubs.find(isPT);
    const libSub = classSubs.find(isLib);
    const academicSubs = classSubs.filter((s: any) => !isPT(s) && !isLib(s));

    const allocations = academicSubs.map((sub: any) => {
      const matchedTeacher = staffList.find(
        (st) => st.id === sub.teacherId || st.taughtSubjects?.some((ts: any) => ts.id === sub.id)
      );
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        teacherId: matchedTeacher ? matchedTeacher.id : (sub.teacherId || "NONE"),
        periodsPerWeek: sub.periodsPerWeek || 5,
      };
    });

    const ptMatched =
      ptSub?.teacherId ||
      staffList.find((st) => st.taughtSubjects?.some((ts: any) => isPT(ts)))?.id ||
      "NONE";
    const libMatched =
      libSub?.teacherId ||
      staffList.find((st) => st.taughtSubjects?.some((ts: any) => isLib(ts)))?.id ||
      "NONE";

    setGenerateConfig({
      classId: targetClassId,
      sectionId: timetableSectionId !== "ALL" ? timetableSectionId : targetSec,
      startTime: "08:30",
      periodDurationMinutes: 45,
      periodsPerDay: 7,
      daysCount: 5,
      hasBreak: true,
      breakAfterPeriod: 2,
      breakDurationMinutes: 15,
      hasLunch: true,
      lunchAfterPeriod: 4,
      lunchDurationMinutes: 40,
      subjectAllocations: allocations,
      includePT: true,
      ptTeacherId: ptMatched,
      includeLibrary: true,
      libraryTeacherId: libMatched,
    });
    setIsGenerateTimetableOpen(true);
  };

  const handleGeneratorClassChange = (newClassId: string) => {
    const targetClass = classes.find((c) => c.id === newClassId);
    const targetSec = targetClass?.sections?.[0]?.id || "ALL";
    const classSubs = targetClass?.subjects || [];

    const isPT = (s: any) => {
      const n = (s.name || "").toLowerCase();
      const c = (s.code || "").toLowerCase();
      return n.includes("physical education") || n.includes("pt") || c.includes("pe");
    };
    const isLib = (s: any) => {
      const n = (s.name || "").toLowerCase();
      const c = (s.code || "").toLowerCase();
      return n.includes("library") || c.includes("lib");
    };

    const ptSub = classSubs.find(isPT);
    const libSub = classSubs.find(isLib);
    const academicSubs = classSubs.filter((s: any) => !isPT(s) && !isLib(s));

    const allocations = academicSubs.map((sub: any) => {
      const matchedTeacher = staffList.find(
        (st) => st.id === sub.teacherId || st.taughtSubjects?.some((ts: any) => ts.id === sub.id)
      );
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        teacherId: matchedTeacher ? matchedTeacher.id : (sub.teacherId || "NONE"),
        periodsPerWeek: sub.periodsPerWeek || 5,
      };
    });

    const ptMatched =
      ptSub?.teacherId ||
      staffList.find((st) => st.taughtSubjects?.some((ts: any) => isPT(ts)))?.id ||
      "NONE";
    const libMatched =
      libSub?.teacherId ||
      staffList.find((st) => st.taughtSubjects?.some((ts: any) => isLib(ts)))?.id ||
      "NONE";

    setGenerateConfig((prev) => ({
      ...prev,
      classId: newClassId,
      sectionId: targetSec,
      subjectAllocations: allocations,
      ptTeacherId: ptMatched !== "NONE" ? ptMatched : prev.ptTeacherId,
      libraryTeacherId: libMatched !== "NONE" ? libMatched : prev.libraryTeacherId,
    }));
  };

  const handleGenerateTimetableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateConfig.classId) {
      showErrors({ gen_class: "Please select a grade class" });
      return;
    }
    setSubmitting(true);
    try {
      await erpApi.generateTimetable({
        classId: generateConfig.classId,
        sectionId: generateConfig.sectionId !== "ALL" ? generateConfig.sectionId : undefined,
        startTime: generateConfig.startTime,
        periodDurationMinutes: Number(generateConfig.periodDurationMinutes),
        periodsPerDay: Number(generateConfig.periodsPerDay),
        daysCount: Number(generateConfig.daysCount),
        hasBreak: generateConfig.hasBreak,
        breakAfterPeriod: Number(generateConfig.breakAfterPeriod),
        breakDurationMinutes: Number(generateConfig.breakDurationMinutes),
        hasLunch: generateConfig.hasLunch,
        lunchAfterPeriod: Number(generateConfig.lunchAfterPeriod),
        lunchDurationMinutes: Number(generateConfig.lunchDurationMinutes),
        subjectAllocations: generateConfig.subjectAllocations.map((s) => ({
          subjectId: s.subjectId,
          teacherId: s.teacherId !== "NONE" ? s.teacherId : undefined,
          periodsPerWeek: Number(s.periodsPerWeek) || 1,
        })),
        includePT: generateConfig.includePT,
        ptTeacherId: generateConfig.ptTeacherId !== "NONE" ? generateConfig.ptTeacherId : undefined,
        includeLibrary: generateConfig.includeLibrary,
        libraryTeacherId: generateConfig.libraryTeacherId !== "NONE" ? generateConfig.libraryTeacherId : undefined,
      });

      showToast("Timetable generated with 1 PT & 1 Library period. Previewing draft.");
      setIsGenerateTimetableOpen(false);
      setTimetableClassId(generateConfig.classId);
      setTimetableSectionId(generateConfig.sectionId);
      await loadTimetable(generateConfig.classId, generateConfig.sectionId);
      await loadData();
    } catch (err: any) {
      showErrors({ gen_form: err.message || "Failed to generate timetable" });
    } finally {
      setSubmitting(false);
    }
  };

  const requestApproveTimetable = () => {
    if (!timetableClassId) return;
    const targetClass = classes.find((c) => c.id === timetableClassId);
    const targetSection = targetClass?.sections?.find((s: any) => s.id === timetableSectionId);
    const sectionLabel = targetSection ? targetSection.name : "All Sections";

    setConfirmModal({
      open: true,
      title: "Approve & Publish Timetable?",
      description: `All draft period allotments for ${targetClass?.name} (${sectionLabel}) will be transitioned to APPROVED status. This officially publishes the schedule for faculty members, students, and parent portals.`,
      confirmLabel: "Approve & Publish",
      variant: "default",
      icon: <FileCheck className="h-5 w-5 text-emerald-600" />,
      itemDetails: {
        label: "Grade & Section",
        title: `${targetClass?.name || "Class"} - ${sectionLabel}`,
        subtitle: `${timetableData?.draftCount || 0} draft slots pending review`,
        badge: "Official Publication",
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await erpApi.approveTimetable({
            classId: timetableClassId,
            sectionId: timetableSectionId !== "ALL" ? timetableSectionId : undefined,
          });
          showToast(`Timetable for ${targetClass?.name} (${sectionLabel}) approved successfully.`);
          setConfirmModal((prev) => ({ ...prev, open: false }));
          await loadTimetable(timetableClassId, timetableSectionId);
        } catch (err: any) {
          showToast(`Approval failed: ${err.message || "Please try again."}`);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const requestResetTimetable = () => {
    if (!timetableClassId) return;
    const targetClass = classes.find((c) => c.id === timetableClassId);
    const targetSection = targetClass?.sections?.find((s: any) => s.id === timetableSectionId);
    const sectionLabel = targetSection ? targetSection.name : "All Sections";

    setConfirmModal({
      open: true,
      title: "Reset Class Timetable?",
      description: `Permanently remove all scheduled periods for ${targetClass?.name} (${sectionLabel})? This will unassign all faculty allotments for this class.`,
      confirmLabel: "Reset Schedule",
      variant: "destructive",
      icon: <Trash2 className="h-5 w-5 text-red-600" />,
      itemDetails: {
        label: "Grade Standard",
        title: `${targetClass?.name || "Class"} - ${sectionLabel}`,
        subtitle: `${timetableData?.totalSlots || 0} periods scheduled`,
        badge: "Clear Allocations",
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await erpApi.resetClassTimetable(
            timetableClassId,
            timetableSectionId !== "ALL" ? timetableSectionId : undefined
          );
          showToast(`Timetable for ${targetClass?.name} (${sectionLabel}) reset.`);
          setConfirmModal((prev) => ({ ...prev, open: false }));
          await loadTimetable(timetableClassId, timetableSectionId);
        } catch (err: any) {
          showToast(`Reset failed: ${err.message || "Please try again."}`);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const openEditSlotModal = (slot: any) => {
    setSelectedSlotForEdit(slot);
    setSlotEditForm({
      subjectId: slot.subjectId || "",
      teacherId: slot.teacherId || "NONE",
      customNote: slot.customNote || "",
    });
    setIsEditSlotOpen(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForEdit) return;
    setSlotSaving(true);
    try {
      await erpApi.updateTimetableSlot(selectedSlotForEdit.id, {
        subjectId: slotEditForm.subjectId || undefined,
        teacherId: slotEditForm.teacherId,
        customNote: slotEditForm.customNote,
      });
      showToast("Period slot updated successfully.");
      setIsEditSlotOpen(false);
      setSelectedSlotForEdit(null);
      await loadTimetable(timetableClassId, timetableSectionId);
    } catch (err: any) {
      showErrors({ slot_edit: err.message || "Conflict: Faculty already busy elsewhere" });
    } finally {
      setSlotSaving(false);
    }
  };

  // Handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!classForm.name.trim()) errs.class_name = "Grade/Class name is required (e.g. Grade 11)";
    if (!classForm.code.trim()) errs.class_code = "Grade code is required (e.g. G11)";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const created = await erpApi.createClass({
        name: classForm.name.trim(),
        code: classForm.code.trim().toUpperCase(),
        classTeacherId: classForm.classTeacherId !== "NONE" ? classForm.classTeacherId : undefined,
        initialSections: classForm.initialSection ? [classForm.initialSection.trim()] : ["Section A"],
      });
      showToast(`Class "${classForm.name}" created successfully.`);
      setIsAddClassOpen(false);
      setClassForm({
        name: "",
        code: "",
        initialSection: "Section A",
        classTeacherId: "NONE",
      });
      await loadData();
      if (created?.id) {
        setSelectedClassId(created.id);
        setSelectedSectionFilter("ALL");
      }
    } catch (err: any) {
      showErrors({ class_form: err.message || "Failed to create class" });
    } finally {
      setSubmitting(false);
    }
  };

  const requestDeleteClass = (classId: string, className: string, classCode?: string) => {
    setConfirmModal({
      open: true,
      title: `Delete Grade "${className}"?`,
      description: "Permanently delete this institutional grade along with its sections, subject mappings, and timetable entries. This action cannot be reversed.",
      confirmLabel: "Delete Grade",
      variant: "destructive",
      icon: <Trash2 className="h-5 w-5 text-red-600" />,
      itemDetails: {
        label: "Academic Standard",
        title: className,
        subtitle: classCode ? `Grade Code: ${classCode}` : undefined,
        badge: "Permanent Deletion",
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await erpApi.deleteClass(classId);
          showToast(`Class "${className}" removed.`);
          setConfirmModal((prev) => ({ ...prev, open: false }));
          if (selectedClassId === classId) {
            setSelectedClassId(null);
          }
          await loadData();
        } catch (err: any) {
          showToast(`Cannot delete: ${err.message || "Ensure no students are enrolled."}`);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClassForSection) return;
    const errs: Record<string, string> = {};
    if (!sectionForm.name.trim()) errs.section_name = "Section name is required (e.g. Section B)";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.createSection(targetClassForSection.id, {
        name: sectionForm.name.trim(),
        capacity: Number(sectionForm.capacity) || 40,
        classTeacherId: sectionForm.classTeacherId !== "NONE" ? sectionForm.classTeacherId : undefined,
      });
      showToast(`Section "${sectionForm.name}" added to ${targetClassForSection.name}.`);
      setIsAddSectionOpen(false);
      setSectionForm({
        name: "",
        capacity: "40",
        classTeacherId: "NONE",
      });
      await loadData();
      if (selectedClassId) {
        await loadClassRoster(selectedClassId, selectedSectionFilter);
      }
    } catch (err: any) {
      showErrors({ section_form: err.message || "Failed to add section" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    if (!teacherAssignForm.teacherId || teacherAssignForm.teacherId === "NONE") {
      showErrors({ assign_teacher: "Please select a faculty member from the list" });
      return;
    }

    setSubmitting(true);
    try {
      if (teacherAssignForm.targetType === "SECTION" && teacherAssignForm.sectionId) {
        await erpApi.assignSectionTeacher(teacherAssignForm.sectionId, teacherAssignForm.teacherId);
        showToast("Section Class Teacher assigned successfully.");
      } else {
        await erpApi.assignClassTeacher(selectedClassId, teacherAssignForm.teacherId);
        showToast("Grade Class Teacher designated successfully.");
      }
      setIsAssignTeacherOpen(false);
      await loadData();
      await loadClassRoster(selectedClassId, selectedSectionFilter);
    } catch (err: any) {
      showErrors({ assign_teacher: err.message || "Failed to assign teacher" });
    } finally {
      setSubmitting(false);
    }
  };

  const requestRemoveTeacher = () => {
    if (!selectedClassId || !classDetailData?.classTeacher) return;
    const teacherName = classDetailData.classTeacher.name;
    const targetLabel =
      selectedSectionFilter !== "ALL" && classDetailData.section
        ? `${currentClass?.name} - ${classDetailData.section.name}`
        : currentClass?.name;

    setConfirmModal({
      open: true,
      title: "Remove Class Teacher Incharge?",
      description: `Clear faculty incharge appointment for ${targetLabel}? This homeroom group will have no designated teacher until a new appointment is made.`,
      confirmLabel: "Clear Incharge",
      variant: "destructive",
      icon: <UserMinus className="h-5 w-5 text-red-600" />,
      itemDetails: {
        label: "Appointed Faculty",
        title: teacherName,
        subtitle: classDetailData.classTeacher.designation || "Faculty Member",
        badge: targetLabel,
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          if (selectedSectionFilter !== "ALL" && classDetailData.section?.id) {
            await erpApi.assignSectionTeacher(classDetailData.section.id, null);
          } else {
            await erpApi.assignClassTeacher(selectedClassId, null);
          }
          showToast("Class teacher assignment cleared.");
          setConfirmModal((prev) => ({ ...prev, open: false }));
          await loadData();
          await loadClassRoster(selectedClassId, selectedSectionFilter);
        } catch (err: any) {
          showToast(`Failed: ${err.message || "Could not clear teacher"}`);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!studentAssignForm.studentId) errs.assign_student = "Please select a student to enroll";
    if (!studentAssignForm.classId) errs.assign_class = "Target class is required";
    if (!studentAssignForm.sectionId) errs.assign_section = "Target section is required";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.assignStudentToClass({
        studentId: studentAssignForm.studentId,
        classId: studentAssignForm.classId,
        sectionId: studentAssignForm.sectionId,
        rollNumber: studentAssignForm.rollNumber ? studentAssignForm.rollNumber.trim() : undefined,
      });
      showToast("Student enrolled and assigned to class successfully.");
      setIsAssignStudentOpen(false);
      setStudentAssignForm({
        studentId: "",
        classId: selectedClassId || "",
        sectionId: "",
        rollNumber: "",
      });
      await loadData();
      if (selectedClassId) {
        await loadClassRoster(selectedClassId, selectedSectionFilter);
      }
    } catch (err: any) {
      showErrors({ assign_student: err.message || "Failed to assign student" });
    } finally {
      setSubmitting(false);
    }
  };

  const requestUnassignStudent = (studentId: string, studentName: string, admNo?: string) => {
    setConfirmModal({
      open: true,
      title: "Unassign Student from Class?",
      description: `Unassign ${studentName} from ${currentClass?.name}? The student will return to the unassigned student pool and become available to enroll into any other class or section.`,
      confirmLabel: "Unassign Student",
      variant: "destructive",
      icon: <UserMinus className="h-5 w-5 text-red-600" />,
      itemDetails: {
        label: "Enrolled Student",
        title: studentName,
        subtitle: admNo ? `Admission No: ${admNo}` : undefined,
        badge: currentClass?.name,
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await erpApi.unassignStudentFromClass(studentId);
          showToast(`Student "${studentName}" unassigned and returned to pool.`);
          setConfirmModal((prev) => ({ ...prev, open: false }));
          await loadData();
          if (selectedClassId) {
            await loadClassRoster(selectedClassId, selectedSectionFilter);
          }
        } catch (err: any) {
          showToast(`Failed: ${err.message || "Could not unassign student"}`);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  // Subject Handlers
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!subjectForm.name.trim()) errs.subject_name = "Subject name is required (e.g. Mathematics)";
    if (!subjectForm.code.trim()) errs.subject_code = "Subject code is required (e.g. MATH101)";
    if (!subjectForm.classId) errs.subject_class = "Target Grade / Class is required";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.createSubject({
        classId: subjectForm.classId,
        name: subjectForm.name.trim(),
        code: subjectForm.code.trim().toUpperCase(),
        periodsPerWeek: Number(subjectForm.periodsPerWeek) || 4,
        teacherId: subjectForm.teacherId !== "NONE" ? subjectForm.teacherId : undefined,
      });
      showToast(`Subject "${subjectForm.name}" added to grade.`);
      setIsAddSubjectOpen(false);
      setSubjectForm({
        classId: selectedClassId || "",
        name: "",
        code: "",
        periodsPerWeek: "4",
        teacherId: "NONE",
      });
      await loadData();
      if (selectedClassId) {
        await loadClassRoster(selectedClassId, selectedSectionFilter);
      }
    } catch (err: any) {
      showErrors({ subject_form: err.message || "Failed to create subject" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubjectTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectForTeacher) return;

    setSubmitting(true);
    try {
      const teacherId =
        subjectTeacherAssignForm.teacherId === "NONE" ? null : subjectTeacherAssignForm.teacherId;
      await erpApi.assignSubjectTeacher(selectedSubjectForTeacher.id, teacherId);
      showToast(
        teacherId
          ? `Subject Teacher appointed for ${selectedSubjectForTeacher.name}.`
          : `Subject Teacher cleared for ${selectedSubjectForTeacher.name}.`
      );
      setIsAssignSubjectTeacherOpen(false);
      setSelectedSubjectForTeacher(null);
      await loadData();
      if (selectedClassId) {
        await loadClassRoster(selectedClassId, selectedSectionFilter);
      }
    } catch (err: any) {
      showErrors({ subject_teacher: err.message || "Failed to assign subject teacher" });
    } finally {
      setSubmitting(false);
    }
  };

  const requestDeleteSubject = (subjectId: string, subjectName: string, subjectCode?: string) => {
    setConfirmModal({
      open: true,
      title: "Remove Subject from Grade?",
      description: `Are you sure you want to remove "${subjectName}" from this grade? All curriculum mappings and subject faculty assignments for this course will be cleared.`,
      confirmLabel: "Remove Subject",
      variant: "destructive",
      icon: <Trash2 className="h-5 w-5 text-red-600" />,
      itemDetails: {
        label: "Curriculum Course",
        title: subjectName,
        subtitle: subjectCode ? `Course Code: ${subjectCode}` : undefined,
        badge: currentClass?.name,
      },
      onConfirm: async () => {
        setConfirmLoading(true);
        try {
          await erpApi.deleteSubject(subjectId);
          showToast(`Subject "${subjectName}" removed.`);
          setConfirmModal((prev) => ({ ...prev, open: false }));
          await loadData();
          if (selectedClassId) {
            await loadClassRoster(selectedClassId, selectedSectionFilter);
          }
        } catch (err: any) {
          showToast(`Failed: ${err.message || "Could not delete subject"}`);
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  // Selected Class details
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const currentSections = currentClass?.sections || [];

  // Filter students by local search query
  const filteredStudents = (classDetailData?.students || []).filter((st) => {
    if (!studentSearchQuery.trim()) return true;
    const q = studentSearchQuery.toLowerCase();
    const name = `${st.firstName} ${st.lastName || ""}`.toLowerCase();
    const adm = (st.admissionNumber || "").toLowerCase();
    const roll = (st.rollNumber || "").toLowerCase();
    return name.includes(q) || adm.includes(q) || roll.includes(q);
  });

  // All subjects across all classes (for Subjects Tab)
  const allCurriculumSubjects = React.useMemo(() => {
    return classes.flatMap((c) =>
      (c.subjects || []).map((sub: any) => ({
        ...sub,
        gradeClass: { id: c.id, name: c.name, code: c.code },
      }))
    );
  }, [classes]);

  const filteredCurriculumSubjects = React.useMemo(() => {
    if (subjectGradeFilter === "ALL") return allCurriculumSubjects;
    return allCurriculumSubjects.filter((s) => s.classId === subjectGradeFilter);
  }, [allCurriculumSubjects, subjectGradeFilter]);

  // Calculate high level metrics
  const totalClassesCount = classes.length;
  const totalSectionsCount = classes.reduce((acc, c) => acc + (c.sections?.length || 0), 0);
  const totalStudentsCount = classes.reduce(
    (acc, c) => acc + (c._count?.students || c.students?.length || 0),
    0
  );
  const appointedTeachersCount = classes.filter((c) => c.classTeacher || c.classTeacherId).length;

  return (
    <div className="space-y-6">
      {/* Reusable Modern Confirmation Popup */}
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

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 text-white shadow-xl text-xs border border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Academic Setup Flow</h1>
            <Badge variant="outline" className="border-zinc-300 text-zinc-700 bg-zinc-50 font-mono text-[11px]">
              Institutional Structure
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 font-normal mt-1">
            Configure institutional grades, class sections, class teacher incharge assignments, subject-wise teachers, and student rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono py-1 px-3 bg-zinc-50 border-zinc-300 text-zinc-800">
            SESSION: 2026-2027 (ACTIVE)
          </Badge>
          <Button
            size="sm"
            onClick={() => setIsAddClassOpen(true)}
            className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Grade / Class
          </Button>
        </div>
      </div>

      {/* High-level KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-zinc-200 shadow-2xs p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Grades / Classes</div>
          <div className="text-xl font-bold text-zinc-950 mt-1">{totalClassesCount}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Configured academic standards</div>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Class Sections</div>
          <div className="text-xl font-bold text-zinc-950 mt-1">{totalSectionsCount}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Active classroom divisions</div>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Enrolled Students</div>
          <div className="text-xl font-bold text-zinc-950 mt-1">{totalStudentsCount}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            {unassignedStudents.length} unassigned in pool
          </div>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs p-3.5">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Class Teachers</div>
          <div className="text-xl font-bold text-zinc-950 mt-1">
            {appointedTeachersCount} <span className="text-xs font-normal text-zinc-400">/ {totalClassesCount}</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Designated faculty incharges</div>
        </Card>
      </div>

      {/* Primary Tabs */}
      <Tabs defaultValue="classes" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-100 border border-zinc-200 p-1">
          <TabsTrigger
            value="classes"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Layers className="h-3.5 w-3.5 mr-1.5" /> Grades, Classes &amp; Students Roster
          </TabsTrigger>
          <TabsTrigger
            value="subjects"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Subjects &amp; Curriculum
          </TabsTrigger>
          <TabsTrigger
            value="timetable"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" /> Timetable Matrix
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CLASSES & STUDENTS (CORE USER FLOW) */}
        <TabsContent value="classes" className="space-y-4 pt-2">
          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading academic setup &amp; classes...
            </div>
          ) : classes.length === 0 ? (
            <Card className="bg-white border-zinc-200 p-10 text-center space-y-3">
              <Layers className="h-10 w-10 text-zinc-300 mx-auto" />
              <div className="text-base font-bold text-zinc-900">No Grades or Classes Configured</div>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Set up your school standard grades (e.g. Grade 1 to 12), create sections, assign class teachers, and enroll students.
              </p>
              <Button
                size="sm"
                onClick={() => setIsAddClassOpen(true)}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add First Grade Class
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT COLUMN: CLASSES DIRECTORY (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                      Grades &amp; Classes ({classes.length})
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddClassOpen(true)}
                    className="h-7 px-2 text-[11px] border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  >
                    <Plus className="h-3 w-3 mr-1" /> New Grade
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {classes.map((cls) => {
                    const isSelected = selectedClassId === cls.id;
                    const studentCount = cls._count?.students || cls.students?.length || 0;
                    const sections = cls.sections || [];
                    const subjectsCount = cls.subjects?.length || 0;
                    const totalCapacity = sections.reduce(
                      (acc: number, s: any) => acc + (Number(s.capacity) || 40),
                      0
                    );

                    return (
                      <div
                        key={cls.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelectedClassId(cls.id);
                          setSelectedSectionFilter("ALL");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedClassId(cls.id);
                            setSelectedSectionFilter("ALL");
                          }
                        }}
                        className={cn(
                          "p-3.5 rounded-lg border transition-all text-left cursor-pointer select-none relative group",
                          isSelected
                            ? "bg-zinc-50/80 border-zinc-950 shadow-xs ring-1 ring-zinc-950"
                            : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/40"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-950">{cls.name}</span>
                            <Badge variant="outline" className="text-[10px] font-mono border-zinc-300 bg-white">
                              {cls.code}
                            </Badge>
                            {isSelected && (
                              <Badge className="bg-zinc-950 text-white text-[9px] px-1.5 py-0 font-mono">
                                ACTIVE
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTargetClassForSection(cls);
                                setSectionForm({
                                  name: "",
                                  capacity: "40",
                                  classTeacherId: "NONE",
                                });
                                setIsAddSectionOpen(true);
                              }}
                              className="h-6 px-1.5 text-[10px] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
                              title="Add Section to this Grade"
                            >
                              <Plus className="h-3 w-3 mr-0.5" /> Section
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                requestDeleteClass(cls.id, cls.name, cls.code);
                              }}
                              className="h-6 px-1 text-zinc-300 hover:text-red-600 hover:bg-red-50"
                              title="Delete Grade"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Class Teacher Badge on Card */}
                        <div className="mt-2 flex items-center justify-between gap-1.5 text-xs">
                          {cls.classTeacher ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-700 font-medium">
                              <UserCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                              <span className="text-zinc-500">Class Teacher:</span>
                              <strong className="text-zinc-950">{cls.classTeacher.name}</strong>
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-400 italic flex items-center gap-1">
                              <UserCheck className="h-3 w-3 text-zinc-300 shrink-0" />
                              No class teacher assigned
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-zinc-500">
                            {subjectsCount} {subjectsCount === 1 ? "Subject" : "Subjects"}
                          </span>
                        </div>

                        {/* Sections & Students Pill Bar */}
                        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-1 flex-wrap">
                            {sections.length === 0 ? (
                              <span className="text-zinc-400 text-[10px] italic">No sections</span>
                            ) : (
                              sections.map((sec: any) => (
                                <Badge
                                  key={sec.id}
                                  variant="secondary"
                                  className="text-[10px] font-mono bg-zinc-100 text-zinc-700 border-zinc-200 px-1.5 py-0"
                                >
                                  {sec.name} ({sec._count?.students || 0})
                                </Badge>
                              ))
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 shrink-0">
                            {studentCount} / {totalCapacity} Students
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: SELECTED CLASS & STUDENT ROSTER (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-4">
                {currentClass ? (
                  <div className="space-y-4">
                    {/* Class Details Card */}
                    <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
                      <CardHeader className="pb-3 bg-zinc-50/60 border-b border-zinc-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-lg font-bold text-zinc-950">
                                {currentClass.name}
                              </h2>
                              <Badge variant="outline" className="font-mono text-xs border-zinc-300 bg-white">
                                {currentClass.code}
                              </Badge>
                              <Badge className="bg-zinc-900 text-white text-[10px] font-mono">
                                {classDetailData?.totalCount || 0} Students Enrolled
                              </Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-0.5">
                              Institutional class management, designated class teacher incharge, subject-wise teachers &amp; student roster.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setTargetClassForSection(currentClass);
                                setSectionForm({
                                  name: "",
                                  capacity: "40",
                                  classTeacherId: "NONE",
                                });
                                setIsAddSectionOpen(true);
                              }}
                              className="h-7 px-2.5 text-[11px] border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-mono"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Section
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setStudentAssignForm({
                                  studentId: unassignedStudents[0]?.id || "",
                                  classId: currentClass.id,
                                  sectionId: currentSections[0]?.id || "",
                                  rollNumber: "",
                                });
                                setIsAssignStudentOpen(true);
                              }}
                              disabled={currentSections.length === 0}
                              className="h-7 px-2.5 text-[11px] bg-zinc-950 text-white hover:bg-zinc-800 font-medium"
                            >
                              <UserPlus className="h-3 w-3 mr-1" /> Enroll Student
                            </Button>
                          </div>
                        </div>

                        {/* Section Filter Chips */}
                        {currentSections.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-3 overflow-x-auto">
                            <span className="text-[10px] font-mono uppercase text-zinc-400 mr-1">Section:</span>
                            <Button
                              size="sm"
                              variant={selectedSectionFilter === "ALL" ? "default" : "outline"}
                              onClick={() => setSelectedSectionFilter("ALL")}
                              className={cn(
                                "h-6 px-2 text-[11px] font-mono",
                                selectedSectionFilter === "ALL"
                                  ? "bg-zinc-950 text-white"
                                  : "border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                              )}
                            >
                              All Sections ({currentClass._count?.students || 0})
                            </Button>
                            {currentSections.map((sec: any) => (
                              <Button
                                key={sec.id}
                                size="sm"
                                variant={selectedSectionFilter === sec.id ? "default" : "outline"}
                                onClick={() => setSelectedSectionFilter(sec.id)}
                                className={cn(
                                  "h-6 px-2 text-[11px] font-mono",
                                  selectedSectionFilter === sec.id
                                    ? "bg-zinc-950 text-white"
                                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                                )}
                              >
                                {sec.name} ({sec._count?.students || 0}/{sec.capacity || 40})
                              </Button>
                            ))}
                          </div>
                        )}
                      </CardHeader>

                      <CardContent className="p-4 space-y-4">
                        {/* 1. CLASS TEACHER INCHARGE SPOTLIGHT */}
                        <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs",
                                classDetailData?.classTeacher
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-zinc-200 text-zinc-500"
                              )}
                            >
                              {classDetailData?.classTeacher ? (
                                <GraduationCap className="h-5 w-5" />
                              ) : (
                                <UserCheck className="h-5 w-5" />
                              )}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                                  {selectedSectionFilter !== "ALL" && classDetailData?.section
                                    ? `${classDetailData.section.name} Class Teacher`
                                    : "Class Teacher Incharge"}
                                </span>
                                {classDetailData?.classTeacher ? (
                                  <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[9px] px-1.5 py-0">
                                    Appointed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-zinc-500 border-zinc-300 text-[9px] px-1.5 py-0 bg-white">
                                    Unappointed
                                  </Badge>
                                )}
                              </div>

                              {classDetailData?.classTeacher ? (
                                <div>
                                  <div className="text-xs flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-zinc-950 text-sm">
                                      {classDetailData.classTeacher.name}
                                    </span>
                                    <span className="text-zinc-500">
                                      • {classDetailData.classTeacher.designation || "Faculty Member"}
                                    </span>
                                    {classDetailData.classTeacher.employeeCode && (
                                      <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                                        {classDetailData.classTeacher.employeeCode}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5">
                                    {classDetailData.classTeacher.email && (
                                      <span className="inline-flex items-center gap-1 font-mono">
                                        <Mail className="h-2.5 w-2.5 text-zinc-400" />
                                        {classDetailData.classTeacher.email}
                                      </span>
                                    )}
                                    {classDetailData.classTeacher.phone && (
                                      <span className="inline-flex items-center gap-1 font-mono">
                                        <Phone className="h-2.5 w-2.5 text-zinc-400" />
                                        {classDetailData.classTeacher.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-zinc-500 italic">
                                  No faculty member is assigned as class teacher for this group yet.
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setTeacherAssignForm({
                                  teacherId: classDetailData?.classTeacher?.id || "NONE",
                                  targetType: selectedSectionFilter !== "ALL" ? "SECTION" : "GRADE",
                                  sectionId: selectedSectionFilter !== "ALL" ? selectedSectionFilter : "",
                                });
                                setIsAssignTeacherOpen(true);
                              }}
                              className="h-7 px-2.5 text-[11px] border-zinc-300 hover:bg-zinc-100 font-medium"
                            >
                              <UserCheck className="h-3 w-3 mr-1 text-zinc-700" />
                              {classDetailData?.classTeacher ? "Change Teacher" : "Assign Teacher"}
                            </Button>
                            {classDetailData?.classTeacher && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={requestRemoveTeacher}
                                className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 text-[11px]"
                                title="Remove Teacher"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* 2. GRADE CURRICULUM & SUBJECT-WISE TEACHERS */}
                        <div className="p-3.5 rounded-lg border border-zinc-200 bg-white space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-zinc-800 shrink-0" />
                              <span className="text-xs font-bold text-zinc-950 uppercase tracking-wide">
                                Curriculum &amp; Subject-Wise Teachers
                              </span>
                              <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                                {(classDetailData?.subjects || []).length} Subjects
                              </Badge>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSubjectForm({
                                  classId: currentClass.id,
                                  name: "",
                                  code: "",
                                  periodsPerWeek: "4",
                                  teacherId: "NONE",
                                });
                                setIsAddSubjectOpen(true);
                              }}
                              className="h-7 px-2 text-[11px] border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-medium self-start sm:self-auto"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Subject to Grade
                            </Button>
                          </div>

                          {(classDetailData?.subjects || []).length === 0 ? (
                            <div className="p-4 rounded-lg border border-dashed border-zinc-200 text-center space-y-1.5 bg-zinc-50/40">
                              <BookMarked className="h-5 w-5 text-zinc-300 mx-auto" />
                              <div className="text-xs font-semibold text-zinc-700">No subjects mapped for {currentClass.name}</div>
                              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                                Add subjects (e.g. Mathematics, Science, English) and assign specialized subject faculty for this grade.
                              </p>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSubjectForm({
                                    classId: currentClass.id,
                                    name: "",
                                    code: "",
                                    periodsPerWeek: "4",
                                    teacherId: "NONE",
                                  });
                                  setIsAddSubjectOpen(true);
                                }}
                                className="h-7 px-3 text-xs bg-zinc-950 text-white hover:bg-zinc-800 mt-1"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add First Subject
                              </Button>
                            </div>
                          ) : (
                            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-lg overflow-hidden">
                              {(classDetailData?.subjects || []).map((sub: any) => (
                                <div
                                  key={sub.id}
                                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/60 transition-colors"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-xs text-zinc-950">{sub.name}</span>
                                      <Badge variant="outline" className="text-[10px] font-mono border-zinc-300 bg-zinc-50">
                                        {sub.code}
                                      </Badge>
                                      {sub.periodsPerWeek && (
                                        <span className="text-[10px] font-mono text-zinc-400">
                                          {sub.periodsPerWeek} periods/wk
                                        </span>
                                      )}
                                    </div>

                                    {/* Subject Teacher Status */}
                                    <div className="flex items-center gap-2 text-xs">
                                      {sub.teacher ? (
                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-700">
                                          <GraduationCap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                          <span className="text-zinc-500">Subject Teacher:</span>
                                          <strong className="text-zinc-950">{sub.teacher.name}</strong>
                                          <span className="text-zinc-400 font-mono text-[10px]">
                                            ({sub.teacher.designation || "Faculty"} • {sub.teacher.employeeCode})
                                          </span>
                                        </div>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] font-mono border-amber-300 bg-amber-50 text-amber-800"
                                        >
                                          No Subject Teacher Assigned
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedSubjectForTeacher(sub);
                                        setSubjectTeacherAssignForm({
                                          teacherId: sub.teacher?.id || "NONE",
                                        });
                                        setIsAssignSubjectTeacherOpen(true);
                                      }}
                                      className="h-6 px-2 text-[10px] border-zinc-300 hover:bg-zinc-100 font-medium"
                                    >
                                      <UserCheck className="h-3 w-3 mr-1 text-zinc-600" />
                                      {sub.teacher ? "Change Teacher" : "Assign Teacher"}
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => requestDeleteSubject(sub.id, sub.name, sub.code)}
                                      className="h-6 px-1.5 text-zinc-300 hover:text-red-600 hover:bg-red-50 text-[10px]"
                                      title="Delete Subject"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 3. ENROLLED STUDENTS LIST */}
                        <div className="space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-900 uppercase">
                                Enrolled Students Roster ({filteredStudents.length})
                              </span>
                              {classDetailLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />}
                            </div>

                            <div className="relative w-full sm:w-56">
                              <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-zinc-400" />
                              <Input
                                placeholder="Search by name or adm #..."
                                value={studentSearchQuery}
                                onChange={(e) => setStudentSearchQuery(e.target.value)}
                                className="h-8 pl-7 text-xs border-zinc-300"
                              />
                            </div>
                          </div>

                          {classDetailLoading ? (
                            <div className="p-8 text-center text-xs text-zinc-400">
                              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" /> Loading class roster...
                            </div>
                          ) : filteredStudents.length === 0 ? (
                            <div className="p-8 rounded-lg border border-dashed border-zinc-200 text-center space-y-2 bg-zinc-50/50">
                              <Users className="h-6 w-6 text-zinc-300 mx-auto" />
                              <div className="text-xs font-semibold text-zinc-800">
                                No students found in this selection
                              </div>
                              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                                Click &quot;Enroll Student&quot; to assign students to this class, or change your search query.
                              </p>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setStudentAssignForm({
                                    studentId: unassignedStudents[0]?.id || "",
                                    classId: currentClass.id,
                                    sectionId: currentSections[0]?.id || "",
                                    rollNumber: "",
                                  });
                                  setIsAssignStudentOpen(true);
                                }}
                                disabled={currentSections.length === 0}
                                className="h-7 px-3 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
                              >
                                <UserPlus className="h-3 w-3 mr-1" /> Enroll Student
                              </Button>
                            </div>
                          ) : (
                            <div className="rounded-lg border border-zinc-200 overflow-hidden bg-white">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-b border-zinc-200 bg-zinc-50/70 text-[10px]">
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">ROLL NO</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">STUDENT NAME &amp; ADMISSION NO</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">SECTION</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">GENDER / BLOOD</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">PARENT CONTACT</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">STATUS</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500 text-right">ACTION</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredStudents.map((st: any, idx: number) => {
                                    const fullName = `${st.firstName} ${st.lastName || ""}`.trim();
                                    return (
                                      <TableRow key={st.id} className="border-b border-zinc-100 text-xs hover:bg-zinc-50/40">
                                        <TableCell className="py-2 font-mono font-bold text-zinc-800">
                                          {st.rollNumber || String(idx + 1).padStart(2, "0")}
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <div className="font-bold text-zinc-950">{fullName}</div>
                                          <div className="text-[10px] font-mono text-zinc-500">
                                            Adm: {st.admissionNumber}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <Badge variant="outline" className="text-[10px] font-mono border-zinc-300 bg-white">
                                            {st.section?.name || "Section A"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-2 text-[11px] text-zinc-600">
                                          <div>{st.gender || "—"}</div>
                                          {st.bloodGroup && (
                                            <div className="text-[10px] font-mono text-zinc-400">
                                              {st.bloodGroup}
                                            </div>
                                          )}
                                        </TableCell>
                                        <TableCell className="py-2 text-[11px]">
                                          {st.parent?.phone ? (
                                            <div className="font-mono text-zinc-700 flex items-center gap-1">
                                              <Phone className="h-2.5 w-2.5 text-zinc-400" />
                                              {st.parent.phone}
                                            </div>
                                          ) : (
                                            <span className="text-zinc-400 italic text-[10px]">No phone</span>
                                          )}
                                          {(st.parent?.fatherName || st.parent?.motherName) && (
                                            <div className="text-[10px] text-zinc-400">
                                              {st.parent?.fatherName || st.parent?.motherName}
                                            </div>
                                          )}
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <Badge
                                            className={cn(
                                              "text-[9px] px-1.5 py-0 font-mono",
                                              st.status === "ACTIVE"
                                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                : "bg-zinc-100 text-zinc-600"
                                            )}
                                          >
                                            {st.status || "ACTIVE"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-2 text-right">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => requestUnassignStudent(st.id, fullName, st.admissionNumber)}
                                            className="h-6 px-2 text-[10px] text-zinc-400 hover:text-red-700 hover:bg-red-50"
                                            title="Unassign student and return to pool"
                                          >
                                            <UserMinus className="h-3 w-3 mr-1" /> Unassign
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-zinc-400 border border-dashed rounded-lg">
                    Select a class from the left to view its roster and class teacher details.
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: SUBJECTS & CURRICULUM */}
        <TabsContent value="subjects" className="space-y-4 pt-2">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-950">Curriculum &amp; Course Mappings</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Institutional subjects and specialized subject faculty appointments across grades
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={subjectGradeFilter}
                    onValueChange={setSubjectGradeFilter}
                  >
                    <SelectTrigger className="h-8 text-xs border-zinc-300 w-44">
                      <SelectValue placeholder="Filter by Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Grades ({allCurriculumSubjects.length} subjects)</SelectItem>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.subjects?.length || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSubjectForm({
                        classId: selectedClassId || classes[0]?.id || "",
                        name: "",
                        code: "",
                        periodsPerWeek: "4",
                        teacherId: "NONE",
                      });
                      setIsAddSubjectOpen(true);
                    }}
                    className="h-8 px-2.5 text-xs bg-zinc-950 text-white hover:bg-zinc-800 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Subject to Grade
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-200 bg-zinc-50/70 text-xs">
                    <TableHead className="font-mono text-zinc-500">SUBJECT CODE</TableHead>
                    <TableHead className="text-zinc-500">COURSE TITLE</TableHead>
                    <TableHead className="text-zinc-500">GRADE / CLASS</TableHead>
                    <TableHead className="text-zinc-500">PERIODS / WK</TableHead>
                    <TableHead className="text-zinc-500">SUBJECT TEACHER</TableHead>
                    <TableHead className="text-zinc-500 text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCurriculumSubjects.map((sub: any) => (
                    <TableRow key={sub.id} className="border-b border-zinc-100 text-xs hover:bg-zinc-50/40">
                      <TableCell className="font-mono font-bold text-zinc-950">{sub.code}</TableCell>
                      <TableCell className="font-medium text-zinc-900">{sub.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                          {sub.gradeClass?.name || "Grade"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-zinc-600">
                        {sub.periodsPerWeek ? `${sub.periodsPerWeek} periods` : "4 periods"}
                      </TableCell>
                      <TableCell>
                        {sub.teacher ? (
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="font-semibold text-zinc-900">{sub.teacher.name}</span>
                            <span className="text-zinc-400 text-[10px] font-mono">
                              ({sub.teacher.designation || "Faculty"})
                            </span>
                          </div>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono border-amber-300 bg-amber-50 text-amber-800"
                          >
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSubjectForTeacher(sub);
                              setSubjectTeacherAssignForm({
                                teacherId: sub.teacher?.id || "NONE",
                              });
                              setIsAssignSubjectTeacherOpen(true);
                            }}
                            className="h-6 px-2 text-[10px] border-zinc-300 hover:bg-zinc-100 font-medium"
                          >
                            <UserCheck className="h-3 w-3 mr-1 text-zinc-600" />
                            {sub.teacher ? "Change" : "Assign"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => requestDeleteSubject(sub.id, sub.name, sub.code)}
                            className="h-6 px-1.5 text-zinc-300 hover:text-red-600 hover:bg-red-50 text-[10px]"
                            title="Delete Subject"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCurriculumSubjects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-zinc-400">
                        No subjects found. Click &quot;Add Subject to Grade&quot; to configure institutional curriculum.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: TIMETABLE MATRIX & FACULTY SCHEDULE */}
        <TabsContent value="timetable" className="space-y-4 pt-2">
          {/* View Mode & Actions Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setTimetableMode("CLASS")}
                  className={cn(
                    "h-7 px-3 text-xs font-medium rounded-md transition-all",
                    timetableMode === "CLASS"
                      ? "bg-white text-zinc-950 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  )}
                >
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" /> Class Timetable
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setTimetableMode("FACULTY")}
                  className={cn(
                    "h-7 px-3 text-xs font-medium rounded-md transition-all",
                    timetableMode === "FACULTY"
                      ? "bg-white text-zinc-950 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  )}
                >
                  <Users className="h-3.5 w-3.5 mr-1.5" /> Faculty Schedule
                </Button>
              </div>

              {timetableMode === "CLASS" && (
                <div className="hidden md:flex items-center gap-2 border-l border-zinc-200 pl-3">
                  {timetableData?.draftCount ? (
                    <Badge
                      variant="outline"
                      className="border-amber-300 bg-amber-50 text-amber-800 text-[11px] font-mono flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                      DRAFT ({timetableData.draftCount} slots pending approval)
                    </Badge>
                  ) : timetableData?.approvedCount ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-mono flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      APPROVED &amp; ACTIVE ({timetableData.approvedCount} slots)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-zinc-200 text-zinc-500 text-[11px] font-mono">
                      No Timetable Active
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-zinc-200 text-zinc-600 bg-zinc-50 text-[10px]">
                    Includes 🏃 1 PT &amp; 📚 1 Library / wk
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {timetableMode === "CLASS" ? (
                <>
                  {timetableData && timetableData.slots.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={requestResetTimetable}
                      className="h-8 text-xs border-zinc-300 text-red-600 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset
                    </Button>
                  )}
                  {timetableData && timetableData.draftCount > 0 && (
                    <Button
                      size="sm"
                      onClick={requestApproveTimetable}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                      <FileCheck className="h-3.5 w-3.5 mr-1" /> Approve &amp; Publish
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={openGenerateModal}
                    className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800 font-medium"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1" /> Generate Timetable
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedFacultyId && loadFacultyTimetable(selectedFacultyId)}
                  className="h-8 text-xs border-zinc-300"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh Schedule
                </Button>
              )}
            </div>
          </div>

          {/* MODE 1: CLASS TIMETABLE MATRIX */}
          {timetableMode === "CLASS" && (
            <div className="space-y-4">
              {/* Grade and Section Selectors */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-zinc-200 rounded-xl p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-xs font-semibold text-zinc-600">Grade / Standard:</Label>
                    <Select
                      value={timetableClassId}
                      onValueChange={(val) => {
                        setTimetableClassId(val);
                        const cls = classes.find((c) => c.id === val);
                        const firstSec = cls?.sections?.[0]?.id || "ALL";
                        setTimetableSectionId(firstSec);
                        loadTimetable(val, firstSec);
                      }}
                    >
                      <SelectTrigger className="h-8 w-44 text-xs border-zinc-300">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({c.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Label className="text-xs font-semibold text-zinc-600">Section:</Label>
                    <Select
                      value={timetableSectionId}
                      onValueChange={(val) => {
                        setTimetableSectionId(val);
                        loadTimetable(timetableClassId, val);
                      }}
                    >
                      <SelectTrigger className="h-8 w-36 text-xs border-zinc-300">
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Sections</SelectItem>
                        {classes
                          .find((c) => c.id === timetableClassId)
                          ?.sections?.map((sec: any) => (
                            <SelectItem key={sec.id} value={sec.id}>
                              {sec.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 font-mono">
                  Total Allocated:{" "}
                  <span className="font-bold text-zinc-950">{timetableData?.slots?.length || 0}</span> periods
                </div>
              </div>

              {/* Matrix Table */}
              <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
                {timetableLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-2" />
                    <span className="text-xs">Loading timetable matrix...</span>
                  </div>
                ) : !timetableData || timetableData.slots.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <CalendarDays className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-zinc-900">No Timetable Generated</h3>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-4">
                      No schedule allotments exist for this grade standard yet. Launch the timetable wizard to
                      generate a balanced schedule with mandatory PT and Library periods and conflict-free teacher
                      allocations.
                    </p>
                    <Button
                      size="sm"
                      onClick={openGenerateModal}
                      className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" /> Generate Timetable Now
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-zinc-200 bg-zinc-50/70 text-xs">
                          <TableHead className="w-48 font-mono text-zinc-500">PERIOD &amp; TIME</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">MONDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">TUESDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">WEDNESDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">THURSDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">FRIDAY</TableHead>
                          {timetableData.slots.some((s) => s.dayOfWeek === 6) && (
                            <TableHead className="min-w-[140px] font-mono text-zinc-700">SATURDAY</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timetableData.periods.map((period: any) => {
                          const daysToShow = timetableData.slots.some((s) => s.dayOfWeek === 6)
                            ? [1, 2, 3, 4, 5, 6]
                            : [1, 2, 3, 4, 5];

                          if (period.isBreak) {
                            return (
                              <TableRow key={period.id} className="border-b border-zinc-200 bg-zinc-100/60">
                                <TableCell className="font-mono text-xs font-semibold text-zinc-600 py-2">
                                  {period.name} ({period.startTime} - {period.endTime})
                                </TableCell>
                                <TableCell
                                  colSpan={daysToShow.length}
                                  className="text-center font-mono text-xs text-zinc-500 font-semibold uppercase tracking-wider py-2"
                                >
                                  ☕ {period.name} — Break Interval
                                </TableCell>
                              </TableRow>
                            );
                          }

                          return (
                            <TableRow key={period.id} className="border-b border-zinc-100 hover:bg-zinc-50/30">
                              <TableCell className="font-mono text-xs text-zinc-600 bg-zinc-50/50 align-top py-3">
                                <div className="font-bold text-zinc-950">{period.name}</div>
                                <div className="text-[11px] text-zinc-400 mt-0.5">
                                  {period.startTime} - {period.endTime}
                                </div>
                              </TableCell>
                              {daysToShow.map((dayNum) => {
                                const slot = timetableData.slots.find(
                                  (s) => s.periodId === period.id && s.dayOfWeek === dayNum
                                );

                                if (!slot) {
                                  return (
                                    <TableCell key={dayNum} className="align-top p-2 text-zinc-300 text-xs font-mono">
                                      <div className="h-16 rounded-lg border border-dashed border-zinc-200 flex items-center justify-center text-[11px] text-zinc-400">
                                        Free Period
                                      </div>
                                    </TableCell>
                                  );
                                }

                                const isPT =
                                  slot.customNote?.includes("PT") ||
                                  slot.subject?.name?.toLowerCase().includes("physical") ||
                                  slot.subject?.name?.toLowerCase().includes("pt");
                                const isLib =
                                  slot.customNote?.includes("Library") ||
                                  slot.subject?.name?.toLowerCase().includes("library");

                                return (
                                  <TableCell key={dayNum} className="align-top p-2">
                                    <div
                                      onClick={() => openEditSlotModal(slot)}
                                      className={cn(
                                        "group relative p-2.5 rounded-lg border transition-all cursor-pointer shadow-2xs hover:shadow-sm",
                                        isPT
                                          ? "bg-amber-50/60 border-amber-200 hover:border-amber-400"
                                          : isLib
                                          ? "bg-blue-50/60 border-blue-200 hover:border-blue-400"
                                          : slot.status === "DRAFT"
                                          ? "bg-yellow-50/30 border-yellow-200 hover:border-yellow-400"
                                          : "bg-white border-zinc-200 hover:border-zinc-400"
                                      )}
                                    >
                                      <div className="flex items-start justify-between gap-1 mb-1">
                                        <div className="font-bold text-xs text-zinc-950 leading-tight">
                                          {slot.subject?.name || "Subject"}
                                        </div>
                                        {isPT ? (
                                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[9px] font-bold px-1 py-0 shrink-0">
                                            🏃 PT
                                          </Badge>
                                        ) : isLib ? (
                                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[9px] font-bold px-1 py-0 shrink-0">
                                            📚 LIB
                                          </Badge>
                                        ) : slot.status === "DRAFT" ? (
                                          <Badge
                                            variant="outline"
                                            className="border-amber-300 text-amber-700 bg-amber-50 text-[9px] font-mono px-1 py-0 shrink-0"
                                          >
                                            DRAFT
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[9px] font-mono px-1 py-0 shrink-0"
                                          >
                                            ✓
                                          </Badge>
                                        )}
                                      </div>

                                      <div className="text-[10px] font-mono text-zinc-500 mb-1.5">
                                        {slot.subject?.code}
                                      </div>

                                      <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                                        <GraduationCap className="h-3 w-3 text-zinc-400 shrink-0" />
                                        <span className="truncate font-medium">
                                          {slot.teacher ? slot.teacher.name : "Unassigned"}
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* MODE 2: FACULTY TIMETABLE VIEW */}
          {timetableMode === "FACULTY" && (
            <div className="space-y-4">
              {/* Faculty Selector & Profile Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-zinc-200 shadow-2xs p-4 md:col-span-1">
                  <Label className="text-xs font-semibold text-zinc-700 mb-1.5 block">
                    Select Faculty Member:
                  </Label>
                  <Select
                    value={selectedFacultyId}
                    onValueChange={(val) => {
                      setSelectedFacultyId(val);
                      loadFacultyTimetable(val);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs border-zinc-300">
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {staffList.map((st) => (
                        <SelectItem key={st.id} value={st.id}>
                          {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {facultyTimetableData?.teacher && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                          {facultyTimetableData.teacher.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-zinc-950">
                            {facultyTimetableData.teacher.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            {facultyTimetableData.teacher.employeeCode} •{" "}
                            {facultyTimetableData.teacher.designation || "Faculty"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-center">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">Weekly Periods</div>
                          <div className="text-base font-bold text-zinc-950 mt-0.5">
                            {facultyTimetableData.totalPeriodsPerWeek || 0}
                          </div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-center">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase">Classes Taught</div>
                          <div className="text-base font-bold text-zinc-950 mt-0.5">
                            {
                              new Set(
                                (facultyTimetableData.slots || []).map(
                                  (s: any) => s.section?.gradeClass?.name || ""
                                )
                              ).size
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Faculty Classes Summary */}
                <Card className="bg-white border-zinc-200 shadow-2xs p-4 md:col-span-2">
                  <CardTitle className="text-xs font-bold text-zinc-950 uppercase font-mono tracking-wider mb-2">
                    Appointed Grades &amp; Classrooms
                  </CardTitle>
                  <p className="text-xs text-zinc-500 mb-3">
                    Instructional commitments allocated to this teacher across the academic curriculum. Flexible
                    multi-grade conflict resolution ensures no overlapping classroom slots.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        (facultyTimetableData?.slots || []).map(
                          (s: any) =>
                            `${s.section?.gradeClass?.name || "Class"} (${s.section?.name || "Sec"})`
                        )
                      )
                    ).map((clsSec: any, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs font-mono py-1 px-2.5 bg-zinc-50 border-zinc-300 text-zinc-900"
                      >
                        <Building className="h-3 w-3 mr-1 text-zinc-500" />
                        {clsSec}
                      </Badge>
                    ))}
                    {(!facultyTimetableData?.slots || facultyTimetableData.slots.length === 0) && (
                      <span className="text-xs text-zinc-400">No classroom allocations found.</span>
                    )}
                  </div>
                </Card>
              </div>

              {/* Faculty Timetable Grid */}
              <Card className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
                {facultyTimetableLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-900 mb-2" />
                    <span className="text-xs">Loading faculty schedule...</span>
                  </div>
                ) : !facultyTimetableData || facultyTimetableData.slots.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Users className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-zinc-900">No Periods Scheduled</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                      This faculty member currently has zero scheduled periods assigned across any grade or section.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-zinc-200 bg-zinc-50/70 text-xs">
                          <TableHead className="w-48 font-mono text-zinc-500">PERIOD &amp; TIME</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">MONDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">TUESDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">WEDNESDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">THURSDAY</TableHead>
                          <TableHead className="min-w-[140px] font-mono text-zinc-700">FRIDAY</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facultyTimetableData.periods.map((period: any) => {
                          if (period.isBreak) {
                            return (
                              <TableRow key={period.id} className="border-b border-zinc-200 bg-zinc-100/60">
                                <TableCell className="font-mono text-xs font-semibold text-zinc-600 py-2">
                                  {period.name} ({period.startTime} - {period.endTime})
                                </TableCell>
                                <TableCell
                                  colSpan={5}
                                  className="text-center font-mono text-xs text-zinc-500 font-semibold uppercase tracking-wider py-2"
                                >
                                  ☕ {period.name} — Break Interval
                                </TableCell>
                              </TableRow>
                            );
                          }

                          return (
                            <TableRow key={period.id} className="border-b border-zinc-100 hover:bg-zinc-50/30">
                              <TableCell className="font-mono text-xs text-zinc-600 bg-zinc-50/50 align-top py-3">
                                <div className="font-bold text-zinc-950">{period.name}</div>
                                <div className="text-[11px] text-zinc-400 mt-0.5">
                                  {period.startTime} - {period.endTime}
                                </div>
                              </TableCell>
                              {[1, 2, 3, 4, 5].map((dayNum) => {
                                const slot = facultyTimetableData.slots.find(
                                  (s: any) => s.periodId === period.id && s.dayOfWeek === dayNum
                                );

                                if (!slot) {
                                  return (
                                    <TableCell key={dayNum} className="align-top p-2 text-zinc-300 text-xs font-mono">
                                      <div className="h-16 rounded-lg border border-zinc-100 bg-zinc-50/40 flex items-center justify-center text-[11px] text-zinc-400 font-mono">
                                        Free / Prep
                                      </div>
                                    </TableCell>
                                  );
                                }

                                return (
                                  <TableCell key={dayNum} className="align-top p-2">
                                    <div className="p-2.5 rounded-lg border border-zinc-200 bg-white shadow-2xs">
                                      <div className="flex items-center justify-between gap-1 mb-1">
                                        <Badge className="bg-zinc-900 text-white font-mono text-[9px] px-1.5 py-0">
                                          {slot.section?.gradeClass?.name || "Class"} •{" "}
                                          {slot.section?.name || "Sec"}
                                        </Badge>
                                        {slot.status === "DRAFT" ? (
                                          <Badge
                                            variant="outline"
                                            className="border-amber-300 text-amber-700 bg-amber-50 text-[9px] font-mono px-1 py-0"
                                          >
                                            DRAFT
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[9px] font-mono px-1 py-0"
                                          >
                                            ACTIVE
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="font-bold text-xs text-zinc-950 mt-1">
                                        {slot.subject?.name || "Subject"}
                                      </div>
                                      <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                                        {slot.subject?.code}
                                      </div>
                                    </div>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* =========================================================================
          DIALOG 1: ADD GRADE / CLASS
         ========================================================================= */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-900" />
              Configure New Grade / Class
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Create an academic standard with code and optional initial section &amp; class teacher.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClass} noValidate className="space-y-4 py-2">
            {formErrors.class_form && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.class_form}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Grade Name <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                placeholder="e.g. Grade 11, Kindergarten, LKG"
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="h-8 text-xs border-zinc-300"
              />
              {formErrors.class_name && (
                <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {formErrors.class_name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Grade Code <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  placeholder="e.g. G11, KKG"
                  value={classForm.code}
                  onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                  className="h-8 text-xs border-zinc-300 font-mono uppercase"
                />
                {formErrors.class_code && (
                  <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.class_code}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Initial Section
                </Label>
                <Input
                  placeholder="e.g. Section A"
                  value={classForm.initialSection}
                  onChange={(e) => setClassForm({ ...classForm, initialSection: e.target.value })}
                  className="h-8 text-xs border-zinc-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700">
                  Designate Class Teacher (Optional)
                </Label>
                <span className="text-[10px] text-zinc-400 font-mono">Strict 1:1 Incharge</span>
              </div>
              <Select
                value={classForm.classTeacherId}
                onValueChange={(val) => setClassForm({ ...classForm, classTeacherId: val })}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="NONE">None (Assign later)</SelectItem>
                  {staffList.map((st) => {
                    const assignedWhere = assignedClassTeachersMap.get(st.id);
                    return (
                      <SelectItem key={st.id} value={st.id} disabled={!!assignedWhere}>
                        {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                        {assignedWhere ? ` [Already Class Teacher: ${assignedWhere}]` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddClassOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Create Grade Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 2: ADD SECTION TO GRADE
         ========================================================================= */}
      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Building className="h-4 w-4 text-zinc-900" />
              Add Section to {targetClassForSection?.name || "Class"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Create a new classroom division with seat capacity and class teacher.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSection} noValidate className="space-y-4 py-2">
            {formErrors.section_form && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.section_form}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Section Name <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  placeholder="e.g. Section B, Section C"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  className="h-8 text-xs border-zinc-300"
                />
                {formErrors.section_name && (
                  <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.section_name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Student Capacity
                </Label>
                <Input
                  type="number"
                  placeholder="40"
                  value={sectionForm.capacity}
                  onChange={(e) => setSectionForm({ ...sectionForm, capacity: e.target.value })}
                  className="h-8 text-xs border-zinc-300 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700">
                  Section Class Teacher (Optional)
                </Label>
                <span className="text-[10px] text-zinc-400 font-mono">Strict 1:1 Incharge</span>
              </div>
              <Select
                value={sectionForm.classTeacherId}
                onValueChange={(val) => setSectionForm({ ...sectionForm, classTeacherId: val })}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="NONE">None (Use Grade Teacher)</SelectItem>
                  {staffList.map((st) => {
                    const assignedWhere = assignedClassTeachersMap.get(st.id);
                    return (
                      <SelectItem key={st.id} value={st.id} disabled={!!assignedWhere}>
                        {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                        {assignedWhere ? ` [Already Class Teacher: ${assignedWhere}]` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddSectionOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Add Section
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 3: ASSIGN CLASS TEACHER (WITH 1:1 EXCLUSIVITY)
         ========================================================================= */}
      <Dialog open={isAssignTeacherOpen} onOpenChange={setIsAssignTeacherOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-zinc-900" />
              Assign Class Teacher Incharge
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Designate a dedicated faculty member in charge of attendance and homeroom management for {currentClass?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignTeacher} noValidate className="space-y-4 py-2">
            {formErrors.assign_teacher && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.assign_teacher}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Assignment Scope
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={teacherAssignForm.targetType === "GRADE" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTeacherAssignForm({ ...teacherAssignForm, targetType: "GRADE" })}
                  className={cn(
                    "h-8 text-xs",
                    teacherAssignForm.targetType === "GRADE"
                      ? "bg-zinc-950 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  Grade Head Incharge
                </Button>
                <Button
                  type="button"
                  variant={teacherAssignForm.targetType === "SECTION" ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setTeacherAssignForm({
                      ...teacherAssignForm,
                      targetType: "SECTION",
                      sectionId: teacherAssignForm.sectionId || currentSections[0]?.id || "",
                    })
                  }
                  className={cn(
                    "h-8 text-xs",
                    teacherAssignForm.targetType === "SECTION"
                      ? "bg-zinc-950 text-white"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  Specific Section
                </Button>
              </div>
            </div>

            {teacherAssignForm.targetType === "SECTION" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Target Section <span className="text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={teacherAssignForm.sectionId}
                  onValueChange={(val) => setTeacherAssignForm({ ...teacherAssignForm, sectionId: val })}
                >
                  <SelectTrigger className="h-8 text-xs border-zinc-300">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentSections.map((sec: any) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.name} ({sec._count?.students || 0} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700">
                  Choose Faculty Member <span className="text-red-500 font-bold">*</span>
                </Label>
                <span className="text-[10px] text-zinc-400 font-mono">Strict 1:1 Incharge</span>
              </div>
              <Select
                value={teacherAssignForm.teacherId}
                onValueChange={(val) => setTeacherAssignForm({ ...teacherAssignForm, teacherId: val })}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue placeholder="Select teacher from faculty list" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {staffList.map((st) => {
                    const assignedWhere = assignedClassTeachersMap.get(st.id);
                    // Check if this teacher is the CURRENT class teacher for this scope
                    const isCurrentGradeTeacher =
                      teacherAssignForm.targetType === "GRADE" && currentClass?.classTeacherId === st.id;
                    const currentSection = currentSections.find((s: any) => s.id === teacherAssignForm.sectionId);
                    const isCurrentSectionTeacher =
                      teacherAssignForm.targetType === "SECTION" && currentSection?.classTeacherId === st.id;
                    const isCurrent = isCurrentGradeTeacher || isCurrentSectionTeacher;
                    const isUnavailable = !!assignedWhere && !isCurrent;

                    return (
                      <SelectItem key={st.id} value={st.id} disabled={isUnavailable}>
                        {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                        {isCurrent ? " (Current Incharge)" : isUnavailable ? ` [Already Class Teacher: ${assignedWhere}]` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAssignTeacherOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Designate Class Teacher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 4: ENROLL / ASSIGN STUDENT TO CLASS (WITH EXCLUSIVITY)
         ========================================================================= */}
      <Dialog open={isAssignStudentOpen} onOpenChange={setIsAssignStudentOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-zinc-900" />
              Enroll Student into {currentClass?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Assign an admitted student from the unassigned student pool into a section of this grade.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignStudent} noValidate className="space-y-4 py-2">
            {formErrors.assign_student && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.assign_student}</span>
              </div>
            )}

            {/* Unassigned Students Info Banner */}
            {unassignedStudents.length === 0 ? (
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-zinc-500" />
                  All Students Currently Enrolled
                </div>
                <p className="text-[11px] text-zinc-500">
                  Every admitted student is currently assigned to a class section. To enroll a student here, please first click &quot;Unassign&quot; next to their name in their current class roster, or admit a new student via the Admissions Flow.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200">
                <span>{unassignedStudents.length} student{unassignedStudents.length === 1 ? "" : "s"} ready for enrollment</span>
                <Badge variant="outline" className="text-[9px] bg-white text-emerald-800 border-emerald-300">
                  Pool Active
                </Badge>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Choose Student <span className="text-red-500 font-bold">*</span>
              </Label>
              <Select
                value={studentAssignForm.studentId}
                onValueChange={(val) => setStudentAssignForm({ ...studentAssignForm, studentId: val })}
                disabled={unassignedStudents.length === 0}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue
                    placeholder={
                      unassignedStudents.length === 0
                        ? "No unassigned students available"
                        : "Select student by name or admission #"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {unassignedStudents.length === 0 ? (
                    <SelectItem value="NONE" disabled>
                      No unassigned students available
                    </SelectItem>
                  ) : (
                    unassignedStudents.map((st) => (
                      <SelectItem key={st.id} value={st.id}>
                        {st.firstName} {st.lastName || ""} — Adm: {st.admissionNumber} {st.gender ? `(${st.gender})` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Target Section <span className="text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={studentAssignForm.sectionId}
                  onValueChange={(val) => setStudentAssignForm({ ...studentAssignForm, sectionId: val })}
                >
                  <SelectTrigger className="h-8 text-xs border-zinc-300">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentSections.map((sec: any) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.name} ({sec._count?.students || 0}/{sec.capacity || 40})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.assign_section && (
                  <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.assign_section}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Roll Number (Optional)
                </Label>
                <Input
                  placeholder="e.g. 01, 14"
                  value={studentAssignForm.rollNumber}
                  onChange={(e) => setStudentAssignForm({ ...studentAssignForm, rollNumber: e.target.value })}
                  className="h-8 text-xs border-zinc-300 font-mono"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAssignStudentOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || unassignedStudents.length === 0}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Enroll Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 5: ADD SUBJECT TO GRADE
         ========================================================================= */}
      <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-zinc-900" />
              Add Subject to Grade
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Configure a curriculum subject, weekly periods, and assign specialized subject faculty.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubject} noValidate className="space-y-4 py-2">
            {formErrors.subject_form && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.subject_form}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Grade / Class <span className="text-red-500 font-bold">*</span>
              </Label>
              <Select
                value={subjectForm.classId}
                onValueChange={(val) => setSubjectForm({ ...subjectForm, classId: val })}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue placeholder="Select target grade" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.subject_class && (
                <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {formErrors.subject_class}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Subject Title <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                placeholder="e.g. Advanced Mathematics, Physics, English Literature"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="h-8 text-xs border-zinc-300"
              />
              {formErrors.subject_name && (
                <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {formErrors.subject_name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Subject Code <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  placeholder="e.g. MATH101, ENG201"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="h-8 text-xs border-zinc-300 font-mono uppercase"
                />
                {formErrors.subject_code && (
                  <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.subject_code}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Periods Per Week
                </Label>
                <Input
                  type="number"
                  placeholder="4"
                  value={subjectForm.periodsPerWeek}
                  onChange={(e) => setSubjectForm({ ...subjectForm, periodsPerWeek: e.target.value })}
                  className="h-8 text-xs border-zinc-300 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Assign Subject Faculty (Optional)
              </Label>
              <Select
                value={subjectForm.teacherId}
                onValueChange={(val) => setSubjectForm({ ...subjectForm, teacherId: val })}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="NONE">None (Assign later)</SelectItem>
                  {staffList.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddSubjectOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Add Subject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 6: ASSIGN / CHANGE SUBJECT TEACHER
         ========================================================================= */}
      <Dialog open={isAssignSubjectTeacherOpen} onOpenChange={setIsAssignSubjectTeacherOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-zinc-900" />
              Assign Subject Faculty
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Appoint a specialized subject teacher for {selectedSubjectForTeacher?.name} ({selectedSubjectForTeacher?.code}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSubjectTeacher} noValidate className="space-y-4 py-2">
            {formErrors.subject_teacher && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.subject_teacher}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs space-y-1">
              <div className="font-bold text-zinc-950 text-sm">{selectedSubjectForTeacher?.name}</div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Code: {selectedSubjectForTeacher?.code} • {selectedSubjectForTeacher?.periodsPerWeek || 4} Periods/Week
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Choose Subject Teacher
              </Label>
              <Select
                value={subjectTeacherAssignForm.teacherId}
                onValueChange={(val) => setSubjectTeacherAssignForm({ teacherId: val })}
              >
                <SelectTrigger className="h-8 text-xs border-zinc-300">
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="NONE">Unassigned (No Subject Teacher)</SelectItem>
                  {staffList.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAssignSubjectTeacherOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Save Subject Teacher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 7: TIMETABLE GENERATOR WIZARD
         ========================================================================= */}
      <Dialog open={isGenerateTimetableOpen} onOpenChange={setIsGenerateTimetableOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-900" />
              Automated Timetable Matrix Generator
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Configure daily period timings, subject allocations, mandatory PT &amp; Library periods, and
              conflict-free cross-grade faculty scheduling.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGenerateTimetableSubmit} noValidate className="space-y-4 py-2">
            {formErrors.gen_form && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formErrors.gen_form}</span>
              </div>
            )}

            {/* Target Grade & Section */}
            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                1. Target Academic Group
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">
                    Grade Standard <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Select
                    value={generateConfig.classId}
                    onValueChange={(val) => handleGeneratorClassChange(val)}
                  >
                    <SelectTrigger className="h-8 text-xs border-zinc-300">
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.gen_class && (
                    <p className="text-[11px] text-red-600 animate-in fade-in flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {formErrors.gen_class}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">Classroom Section</Label>
                  <Select
                    value={generateConfig.sectionId}
                    onValueChange={(val) => setGenerateConfig({ ...generateConfig, sectionId: val })}
                  >
                    <SelectTrigger className="h-8 text-xs border-zinc-300">
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .find((c) => c.id === generateConfig.classId)
                        ?.sections?.map((sec: any) => (
                          <SelectItem key={sec.id} value={sec.id}>
                            {sec.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* School Timings & Structure */}
            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                2. Class Timings &amp; Day Structure
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">School Start</Label>
                  <Input
                    type="time"
                    value={generateConfig.startTime}
                    onChange={(e) => setGenerateConfig({ ...generateConfig, startTime: e.target.value })}
                    className="h-8 text-xs border-zinc-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">Period Duration</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="30"
                      max="90"
                      value={generateConfig.periodDurationMinutes}
                      onChange={(e) =>
                        setGenerateConfig({
                          ...generateConfig,
                          periodDurationMinutes: Number(e.target.value) || 45,
                        })
                      }
                      className="h-8 text-xs border-zinc-300 font-mono"
                    />
                    <span className="text-[11px] text-zinc-400">mins</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">Periods / Day</Label>
                  <Select
                    value={String(generateConfig.periodsPerDay)}
                    onValueChange={(val) =>
                      setGenerateConfig({ ...generateConfig, periodsPerDay: Number(val) })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs border-zinc-300">
                      <SelectValue placeholder="Periods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Periods / Day</SelectItem>
                      <SelectItem value="7">7 Periods / Day</SelectItem>
                      <SelectItem value="8">8 Periods / Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">Weekly Days</Label>
                  <Select
                    value={String(generateConfig.daysCount)}
                    onValueChange={(val) =>
                      setGenerateConfig({ ...generateConfig, daysCount: Number(val) })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs border-zinc-300">
                      <SelectValue placeholder="Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Days (Mon - Fri)</SelectItem>
                      <SelectItem value="6">6 Days (Mon - Sat)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Breaks Config */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-zinc-700">Morning Recess Interval</Label>
                    <span className="text-[10px] text-zinc-400 font-mono">After Period 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Duration:</span>
                    <Input
                      type="number"
                      min="10"
                      max="30"
                      value={generateConfig.breakDurationMinutes}
                      onChange={(e) =>
                        setGenerateConfig({
                          ...generateConfig,
                          breakDurationMinutes: Number(e.target.value) || 15,
                        })
                      }
                      className="h-7 w-20 text-xs border-zinc-300 font-mono"
                    />
                    <span className="text-[11px] text-zinc-400">mins</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold text-zinc-700">Lunch Interval</Label>
                    <span className="text-[10px] text-zinc-400 font-mono">After Period 4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Duration:</span>
                    <Input
                      type="number"
                      min="20"
                      max="60"
                      value={generateConfig.lunchDurationMinutes}
                      onChange={(e) =>
                        setGenerateConfig({
                          ...generateConfig,
                          lunchDurationMinutes: Number(e.target.value) || 40,
                        })
                      }
                      className="h-7 w-20 text-xs border-zinc-300 font-mono"
                    />
                    <span className="text-[11px] text-zinc-400">mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Allocations & Cross-Grade Teacher Assignments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider">
                  3. Subject Allocations &amp; Multi-Grade Faculty Assignment
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 border-emerald-300 text-emerald-800">
                  Cross-Grade Conflict Free
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500">
                Define the weekly frequency for each subject and assign faculty members. If a teacher handles
                subjects across multiple grades, the scheduler guarantees they are not double-booked.
              </p>

              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-zinc-200 bg-zinc-50/70 text-xs">
                      <TableHead className="font-mono text-zinc-500">SUBJECT</TableHead>
                      <TableHead className="font-mono text-zinc-500">ASSIGNED TEACHER</TableHead>
                      <TableHead className="w-28 font-mono text-zinc-500 text-right">PERIODS / WK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mandatory 1: Physical Education (PT) */}
                    <TableRow className="border-b border-zinc-100 bg-amber-50/30 text-xs">
                      <TableCell className="font-medium text-zinc-900">
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-bold px-1.5 py-0.5">
                            🏃 PT Period
                          </Badge>
                          <span className="font-bold">Physical Education</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">Curriculum Requirement</span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={generateConfig.ptTeacherId}
                          onValueChange={(val) => setGenerateConfig({ ...generateConfig, ptTeacherId: val })}
                        >
                          <SelectTrigger className="h-7 text-xs border-zinc-300">
                            <SelectValue placeholder="Select PT Instructor" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="NONE">Unassigned (General Staff)</SelectItem>
                            {staffList.map((st) => (
                              <SelectItem key={st.id} value={st.id}>
                                {st.name} ({st.designation || "Faculty"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-zinc-900 pr-4">
                        1 period
                      </TableCell>
                    </TableRow>

                    {/* Mandatory 2: Library & Reading */}
                    <TableRow className="border-b border-zinc-100 bg-blue-50/30 text-xs">
                      <TableCell className="font-medium text-zinc-900">
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-[10px] font-bold px-1.5 py-0.5">
                            📚 Library Period
                          </Badge>
                          <span className="font-bold">Library &amp; Reading</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">Curriculum Requirement</span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={generateConfig.libraryTeacherId}
                          onValueChange={(val) =>
                            setGenerateConfig({ ...generateConfig, libraryTeacherId: val })
                          }
                        >
                          <SelectTrigger className="h-7 text-xs border-zinc-300">
                            <SelectValue placeholder="Select Librarian / Teacher" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="NONE">Unassigned (Librarian)</SelectItem>
                            {staffList.map((st) => (
                              <SelectItem key={st.id} value={st.id}>
                                {st.name} ({st.designation || "Faculty"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-zinc-900 pr-4">
                        1 period
                      </TableCell>
                    </TableRow>

                    {/* Academic Subjects */}
                    {generateConfig.subjectAllocations.map((alloc, idx) => {
                      const qualifiedTeachers = staffList.filter(
                        (st) =>
                          st.id === alloc.teacherId ||
                          st.taughtSubjects?.some((ts: any) => ts.id === alloc.subjectId)
                      );
                      const otherStaff = staffList.filter(
                        (st) => !qualifiedTeachers.some((qt) => qt.id === st.id)
                      );
                      const hrTeacher = staffList.find(
                        (st) =>
                          st.taughtSubjects?.some((ts: any) => ts.id === alloc.subjectId) ||
                          st.id === alloc.teacherId
                      );

                      return (
                        <TableRow key={alloc.subjectId} className="border-b border-zinc-100 text-xs">
                          <TableCell className="font-medium text-zinc-900">
                            <div className="font-semibold flex items-center gap-1.5">
                              <span>{alloc.subjectName}</span>
                              {hrTeacher && (
                                <Badge variant="outline" className="text-[9px] font-mono border-emerald-300 bg-emerald-50 text-emerald-800 py-0 px-1">
                                  HR Assigned: {hrTeacher.name}
                                </Badge>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400">{alloc.subjectCode}</div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={alloc.teacherId}
                              onValueChange={(val) => {
                                const updated = [...generateConfig.subjectAllocations];
                                updated[idx].teacherId = val;
                                setGenerateConfig({ ...generateConfig, subjectAllocations: updated });
                              }}
                            >
                              <SelectTrigger className="h-7 text-xs border-zinc-300">
                                <SelectValue placeholder="Assign faculty" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                <SelectItem value="NONE">Unassigned</SelectItem>
                                {qualifiedTeachers.length > 0 && (
                                  <>
                                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border-b border-emerald-100">
                                      Qualified / Assigned in HR Hub
                                    </div>
                                    {qualifiedTeachers.map((st) => (
                                      <SelectItem key={st.id} value={st.id} className="font-medium text-emerald-950">
                                        ⭐ {st.name} ({st.employeeCode}) — Handles this Subject
                                      </SelectItem>
                                    ))}
                                  </>
                                )}
                                {otherStaff.length > 0 && (
                                  <>
                                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 border-t border-zinc-100">
                                      Other Faculty Members
                                    </div>
                                    {otherStaff.map((st) => (
                                      <SelectItem key={st.id} value={st.id} className="text-zinc-600">
                                        {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                                      </SelectItem>
                                    ))}
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            value={alloc.periodsPerWeek}
                            onChange={(e) => {
                              const updated = [...generateConfig.subjectAllocations];
                              updated[idx].periodsPerWeek = Number(e.target.value) || 1;
                              setGenerateConfig({ ...generateConfig, subjectAllocations: updated });
                            }}
                            className="h-7 w-20 text-xs border-zinc-300 font-mono ml-auto text-right"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Real-time Slot Balance Summary */}
            {(() => {
              const totalAvailable = generateConfig.periodsPerDay * generateConfig.daysCount;
              const academicSum = generateConfig.subjectAllocations.reduce(
                (acc, s) => acc + (Number(s.periodsPerWeek) || 0),
                0
              );
              const totalConfigured =
                academicSum + (generateConfig.includePT ? 1 : 0) + (generateConfig.includeLibrary ? 1 : 0);

              return (
                <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-900">
                      Total Allocated: {totalConfigured} / {totalAvailable} weekly period slots
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {totalConfigured === totalAvailable ? (
                        <span className="text-emerald-700 font-medium">
                          ✓ Schedule fully utilized (no free periods).
                        </span>
                      ) : totalConfigured < totalAvailable ? (
                        <span className="text-amber-700 font-medium">
                          ℹ {totalAvailable - totalConfigured} remaining slots will serve as free / study periods.
                        </span>
                      ) : (
                        <span className="text-red-700 font-medium">
                          ⚠ Exceeds capacity by {totalConfigured - totalAvailable} periods.
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-zinc-300">
                    {totalAvailable} Slots ({generateConfig.daysCount} Days × {generateConfig.periodsPerDay} Periods)
                  </Badge>
                </div>
              );
            })()}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsGenerateTimetableOpen(false)}
                className="h-8 text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Generate Timetable Matrix
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG 8: EDIT / INSPECT TIMETABLE SLOT
         ========================================================================= */}
      <Dialog open={isEditSlotOpen} onOpenChange={setIsEditSlotOpen}>
        <DialogContent className="max-w-md bg-white border-zinc-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-900" />
              Inspect &amp; Edit Timetable Slot
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Update subject, faculty member, or special notes. Multi-grade conflict checks prevent double booking.
            </DialogDescription>
          </DialogHeader>

          {selectedSlotForEdit && (
            <form onSubmit={handleSaveSlot} noValidate className="space-y-4 py-2">
              {formErrors.slot_edit && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formErrors.slot_edit}</span>
                </div>
              )}

              {/* Slot Context Info */}
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">
                    {["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
                      selectedSlotForEdit.dayOfWeek
                    ]}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                    {selectedSlotForEdit.period?.name} ({selectedSlotForEdit.period?.startTime} -{" "}
                    {selectedSlotForEdit.period?.endTime})
                  </Badge>
                </div>
                <div className="text-[11px] text-zinc-500">
                  {selectedSlotForEdit.section?.gradeClass?.name} • {selectedSlotForEdit.section?.name}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">Curriculum Subject</Label>
                <Select
                  value={slotEditForm.subjectId}
                  onValueChange={(val) => setSlotEditForm({ ...slotEditForm, subjectId: val })}
                >
                  <SelectTrigger className="h-8 text-xs border-zinc-300">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {classes
                      .find((c) => c.id === timetableClassId)
                      ?.subjects?.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name} ({sub.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faculty */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-zinc-700">Assigned Faculty Member</Label>
                  <span className="text-[10px] text-zinc-400 font-mono">Conflict Verified</span>
                </div>
                <Select
                  value={slotEditForm.teacherId}
                  onValueChange={(val) => setSlotEditForm({ ...slotEditForm, teacherId: val })}
                >
                  <SelectTrigger className="h-8 text-xs border-zinc-300">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="NONE">Unassigned (No Teacher)</SelectItem>
                    {staffList.map((st) => (
                      <SelectItem key={st.id} value={st.id}>
                        {st.name} — {st.designation || "Faculty"} ({st.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Note */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">Special Note / Room</Label>
                <Input
                  placeholder="e.g. Science Lab 2, Sports Ground, Seminar Hall"
                  value={slotEditForm.customNote}
                  onChange={(e) => setSlotEditForm({ ...slotEditForm, customNote: e.target.value })}
                  className="h-8 text-xs border-zinc-300"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditSlotOpen(false)}
                  className="h-8 text-xs border-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={slotSaving}
                  size="sm"
                  className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
                >
                  {slotSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
