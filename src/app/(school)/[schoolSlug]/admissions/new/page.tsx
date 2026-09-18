"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  User,
  GraduationCap,
  Users,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Award,
  AlertCircle,
  FileCheck2,
  Building,
  ShieldCheck,
  Check,
} from "lucide-react";
import { erpApi } from "@/lib/api";
import { DocumentVaultModal } from "@/components/admissions/document-vault-modal";

// Higher Secondary Syllabus Groups for Tamil Nadu State Board
const TN_SYLLABUS_GROUPS: Record<string, { name: string; subjects: Array<{ code: string; name: string; maxTheory: number; maxPractical: number; minPass: number }> }> = {
  "BIO_MATHS": {
    name: "Group 1: Biology + Mathematics (Bio-Maths)",
    subjects: [
      { code: "001", name: "Language (Tamil / First Language)", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "002", name: "English", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "103", name: "Physics", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "104", name: "Chemistry", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "105", name: "Biology", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "106", name: "Mathematics", maxTheory: 90, maxPractical: 10, minPass: 35 },
    ],
  },
  "CS_MATHS": {
    name: "Group 2: Computer Science + Mathematics (CS-Maths)",
    subjects: [
      { code: "001", name: "Language (Tamil / First Language)", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "002", name: "English", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "103", name: "Physics", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "104", name: "Chemistry", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "107", name: "Computer Science", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "106", name: "Mathematics", maxTheory: 90, maxPractical: 10, minPass: 35 },
    ],
  },
  "PURE_SCIENCE": {
    name: "Group 3: Pure Science (Botany + Zoology)",
    subjects: [
      { code: "001", name: "Language (Tamil / First Language)", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "002", name: "English", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "103", name: "Physics", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "104", name: "Chemistry", maxTheory: 70, maxPractical: 30, minPass: 35 },
      { code: "108", name: "Botany", maxTheory: 35, maxPractical: 15, minPass: 18 },
      { code: "109", name: "Zoology", maxTheory: 35, maxPractical: 15, minPass: 18 },
    ],
  },
  "COMMERCE_CA": {
    name: "Group 4: Commerce + Computer Applications",
    subjects: [
      { code: "001", name: "Language (Tamil / First Language)", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "002", name: "English", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "201", name: "Commerce", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "202", name: "Accountancy", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "203", name: "Economics", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "204", name: "Computer Applications", maxTheory: 70, maxPractical: 30, minPass: 35 },
    ],
  },
  "COMMERCE_BM": {
    name: "Group 5: Commerce + Business Mathematics",
    subjects: [
      { code: "001", name: "Language (Tamil / First Language)", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "002", name: "English", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "201", name: "Commerce", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "202", name: "Accountancy", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "203", name: "Economics", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "205", name: "Business Mathematics & Statistics", maxTheory: 90, maxPractical: 10, minPass: 35 },
    ],
  },
  "ARTS": {
    name: "Group 6: Arts & Humanities",
    subjects: [
      { code: "001", name: "Language (Tamil / First Language)", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "002", name: "English", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "301", name: "History", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "302", name: "Geography", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "203", name: "Economics", maxTheory: 90, maxPractical: 10, minPass: 35 },
      { code: "303", name: "Political Science", maxTheory: 90, maxPractical: 10, minPass: 35 },
    ],
  },
};

export default function NewAdmissionDirectPage() {
  const params = useParams();
  const router = useRouter();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";
  const basePath = `/${schoolSlug}`;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdApplication, setCreatedApplication] = React.useState<any | null>(null);
  const [isVaultOpen, setIsVaultOpen] = React.useState(false);

  // Section 1: Candidate Bio & Aadhar
  const [studentName, setStudentName] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [aadharNumber, setAadharNumber] = React.useState("");
  const [studentPhoto, setStudentPhoto] = React.useState<string | null>(null);
  const [address, setAddress] = React.useState("");
  const [emergencyContact, setEmergencyContact] = React.useState("");
  const [previousSchool, setPreviousSchool] = React.useState("");
  const [previousBoard, setPreviousBoard] = React.useState("");

  // Section 2: Parents & Guardians
  const [fatherName, setFatherName] = React.useState("");
  const [fatherPhone, setFatherPhone] = React.useState("");
  const [fatherOccupation, setFatherOccupation] = React.useState("");
  const [fatherPhoto, setFatherPhoto] = React.useState<string | null>(null);

  const [motherName, setMotherName] = React.useState("");
  const [motherPhone, setMotherPhone] = React.useState("");
  const [motherOccupation, setMotherOccupation] = React.useState("");
  const [motherPhoto, setMotherPhoto] = React.useState<string | null>(null);

  const [parentEmail, setParentEmail] = React.useState("");

  // Section 3: Target Grade & Tamil Nadu Marksheets
  const [targetGrade, setTargetGrade] = React.useState("");
  const [selectedGroupKey, setSelectedGroupKey] = React.useState("BIO_MATHS");

  // 10th SSLC Marksheet Fields
  const [tenthRegNo, setTenthRegNo] = React.useState("");
  const [tenthTmrCode, setTenthTmrCode] = React.useState("");
  const [tenthYear, setTenthYear] = React.useState("");

  const [tenthMarks, setTenthMarks] = React.useState({
    tamil: { theory: "", practical: "" },
    english: { theory: "", practical: "" },
    maths: { theory: "", practical: "" },
    science: { theory: "", practical: "" },
    social: { theory: "", practical: "" },
  });

  // 11th HSC Marksheet Fields (For Grade 12 Admission)
  const [eleventhRegNo, setEleventhRegNo] = React.useState("");
  const [eleventhMarks, setEleventhMarks] = React.useState<Record<string, { theory: string; practical: string }>>({});

  // Sync 11th marks structure when syllabus group changes
  React.useEffect(() => {
    const groupDef = TN_SYLLABUS_GROUPS[selectedGroupKey];
    if (!groupDef) return;

    const initialMarks: Record<string, { theory: string; practical: string }> = {};
    groupDef.subjects.forEach((sub) => {
      initialMarks[sub.code] = {
        theory: "",
        practical: "",
      };
    });
    setEleventhMarks(initialMarks);
  }, [selectedGroupKey]);

  // Recalculate age from DOB
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthYear = new Date(val).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear > 1990 && birthYear <= currentYear) {
        setAge((currentYear - birthYear).toString());
      }
    } else {
      setAge("");
    }
  };

  // Image reader with high-fidelity canvas compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setter(compressed);
        } else {
          setter(reader.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Aadhar format
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const parts = raw.match(/.{1,4}/g) || [];
    setAadharNumber(parts.join(" "));
  };

  // Calculate 10th stats
  const calculateTenthStats = () => {
    const t = Number(tenthMarks.tamil.theory) || 0;
    const e = Number(tenthMarks.english.theory) || 0;
    const m = Number(tenthMarks.maths.theory) || 0;
    const sciTheo = Number(tenthMarks.science.theory) || 0;
    const sciPrac = Number(tenthMarks.science.practical) || 0;
    const s = sciTheo + sciPrac;
    const soc = Number(tenthMarks.social.theory) || 0;

    const total = t + e + m + s + soc;
    const hasAnyMarks = [
      tenthMarks.tamil.theory,
      tenthMarks.english.theory,
      tenthMarks.maths.theory,
      tenthMarks.science.theory,
      tenthMarks.science.practical,
      tenthMarks.social.theory,
    ].some((v) => v.trim() !== "");

    const isPass = hasAnyMarks
      ? t >= 35 && e >= 35 && m >= 35 && s >= 35 && soc >= 35 && sciTheo >= 20 && sciPrac >= 15
      : false;
    const percentage = hasAnyMarks ? ((total / 500) * 100).toFixed(1) : "0.0";

    return { total, isPass, percentage, sciTotal: s, hasAnyMarks };
  };

  // Calculate 11th stats
  const calculateEleventhStats = () => {
    const groupDef = TN_SYLLABUS_GROUPS[selectedGroupKey];
    if (!groupDef) return { total: 0, isPass: false, percentage: "0.0", maxTotal: 600, hasAnyMarks: false };

    let total = 0;
    let isPass = true;
    let maxTotal = 0;
    let hasAnyMarks = false;

    groupDef.subjects.forEach((sub) => {
      const entry = eleventhMarks[sub.code] || { theory: "", practical: "" };
      if (entry.theory.trim() !== "" || entry.practical.trim() !== "") {
        hasAnyMarks = true;
      }
      const th = Number(entry.theory) || 0;
      const pr = Number(entry.practical) || 0;
      const subTotal = th + pr;
      total += subTotal;
      maxTotal += (sub.maxTheory + sub.maxPractical);

      if (subTotal < sub.minPass) {
        isPass = false;
      }
    });

    const percentage = maxTotal > 0 && hasAnyMarks ? ((total / maxTotal) * 100).toFixed(1) : "0.0";
    return { total, isPass: hasAnyMarks && isPass, percentage, maxTotal, hasAnyMarks };
  };

  const tenthStats = calculateTenthStats();
  const eleventhStats = calculateEleventhStats();

  // Step completion status for the top neat progress card
  const isStep1Complete = Boolean(
    studentName.trim() &&
    dob &&
    gender &&
    aadharNumber.replace(/\D/g, "").length === 12
  );

  const isStep2Complete = Boolean(
    (fatherName.trim() || motherName.trim()) &&
    (fatherPhone.trim() || motherPhone.trim()) &&
    parentEmail.trim().includes("@")
  );

  const isStep3Complete = Boolean(
    targetGrade &&
    (targetGrade === "Grade 11"
      ? (tenthRegNo.trim() && tenthStats.hasAnyMarks)
      : targetGrade === "Grade 12"
      ? (eleventhRegNo.trim() && eleventhStats.hasAnyMarks)
      : true)
  );

  const completedStepsCount = (isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0) + (isStep3Complete ? 1 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("Please enter candidate's full name");
      return;
    }

    setIsSubmitting(true);
    try {
      const is12th = targetGrade === "Grade 12";
      const isHigherSec = targetGrade === "Grade 11" || targetGrade === "Grade 12";
      const groupDef = TN_SYLLABUS_GROUPS[selectedGroupKey];

      const tenthMarksData = {
        regNo: tenthRegNo,
        tmrCode: tenthTmrCode,
        year: tenthYear,
        board: "Tamil Nadu State Board of School Examinations (SSLC)",
        subjects: [
          { code: "001", name: "Language (Tamil)", max: 100, min: 35, theory: Number(tenthMarks.tamil.theory), practical: null, total: Number(tenthMarks.tamil.theory), result: Number(tenthMarks.tamil.theory) >= 35 ? "PASS" : "FAIL" },
          { code: "002", name: "English", max: 100, min: 35, theory: Number(tenthMarks.english.theory), practical: null, total: Number(tenthMarks.english.theory), result: Number(tenthMarks.english.theory) >= 35 ? "PASS" : "FAIL" },
          { code: "003", name: "Mathematics", max: 100, min: 35, theory: Number(tenthMarks.maths.theory), practical: null, total: Number(tenthMarks.maths.theory), result: Number(tenthMarks.maths.theory) >= 35 ? "PASS" : "FAIL" },
          { code: "004", name: "Science", max: 100, min: 35, theory: Number(tenthMarks.science.theory), practical: Number(tenthMarks.science.practical), total: tenthStats.sciTotal, result: tenthStats.sciTotal >= 35 ? "PASS" : "FAIL" },
          { code: "005", name: "Social Science", max: 100, min: 35, theory: Number(tenthMarks.social.theory), practical: null, total: Number(tenthMarks.social.theory), result: Number(tenthMarks.social.theory) >= 35 ? "PASS" : "FAIL" },
        ],
        totalScore: tenthStats.total,
        percentage: tenthStats.percentage,
        result: tenthStats.isPass ? "PASS" : "FAIL",
      };

      const eleventhMarksData = is12th && groupDef ? {
        regNo: eleventhRegNo,
        groupName: groupDef.name,
        board: "Tamil Nadu Department of Government Examinations (HSC +1)",
        subjects: groupDef.subjects.map((sub) => {
          const entry = eleventhMarks[sub.code] || { theory: "0", practical: "0" };
          const th = Number(entry.theory) || 0;
          const pr = Number(entry.practical) || 0;
          const tot = th + pr;
          return {
            code: sub.code,
            name: sub.name,
            max: sub.maxTheory + sub.maxPractical,
            min: sub.minPass,
            theory: th,
            practical: pr,
            total: tot,
            result: tot >= sub.minPass ? "PASS" : "FAIL",
          };
        }),
        totalScore: eleventhStats.total,
        maxScore: eleventhStats.maxTotal,
        percentage: eleventhStats.percentage,
        result: eleventhStats.isPass ? "PASS" : "FAIL",
      } : null;

      const payload = {
        studentName,
        dob,
        age: parseInt(age, 10) || 16,
        gender,
        bloodGroup,
        studentPhotoUrl: studentPhoto,
        aadharNumber,
        previousSchool,
        previousBoard,
        fatherName: fatherName || null,
        fatherPhone: fatherPhone || null,
        fatherPhotoUrl: fatherPhoto || null,
        motherName: motherName || null,
        motherPhone: motherPhone || null,
        motherPhotoUrl: motherPhoto || null,
        parentName: fatherName || motherName || "Parent / Guardian",
        parentPhone: fatherPhone || motherPhone || "",
        parentEmail: parentEmail || "parent@admissions.edu",
        emergencyPhone: emergencyContact,
        address,
        targetGrade,
        streamGroup: isHigherSec ? groupDef?.name || selectedGroupKey : null,
        tenthMarksData,
        eleventhMarksData,
        documentsData: JSON.stringify([]),
      };

      const newApp = await erpApi.submitApplication(payload);
      setCreatedApplication(newApp);
      setIsVaultOpen(true);
    } catch (err: any) {
      console.error("Failed to submit admission to database:", err);
      alert(`Submission Error: ${err?.message || "Could not save to database. Please check connection."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Step Completion Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Student Admission Registration Form
          </h1>
        </div>

        {/* Small, neat step completion tracker card */}
        <div className="bg-white border border-zinc-200 rounded-lg px-3 py-1.5 shadow-2xs flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 font-medium pr-2 border-r border-zinc-200">
            <span className="text-zinc-950 font-bold">{completedStepsCount}/3</span>
            <span>Done</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            {/* Step 1: Student Identity */}
            <button
              type="button"
              onClick={() => document.getElementById("section-student-identity")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to jump to Section 1: Student Identity"
            >
              {isStep1Complete ? (
                <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              ) : (
                <span className="h-4 w-4 rounded-full border border-zinc-300 text-zinc-400 flex items-center justify-center text-[10px] font-mono font-medium">
                  1
                </span>
              )}
              <span className={`text-[11px] ${isStep1Complete ? "font-semibold text-zinc-950" : "text-zinc-500"}`}>
                Student
              </span>
            </button>

            <div className="h-3 w-px bg-zinc-200" />

            {/* Step 2: Parent Records */}
            <button
              type="button"
              onClick={() => document.getElementById("section-guardian-details")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to jump to Section 2: Parents & Guardians"
            >
              {isStep2Complete ? (
                <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              ) : (
                <span className="h-4 w-4 rounded-full border border-zinc-300 text-zinc-400 flex items-center justify-center text-[10px] font-mono font-medium">
                  2
                </span>
              )}
              <span className={`text-[11px] ${isStep2Complete ? "font-semibold text-zinc-950" : "text-zinc-500"}`}>
                Parents
              </span>
            </button>

            <div className="h-3 w-px bg-zinc-200" />

            {/* Step 3: Academic & Marksheet */}
            <button
              type="button"
              onClick={() => document.getElementById("section-academics-marksheet")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to jump to Section 3: Academic & Marksheet"
            >
              {isStep3Complete ? (
                <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              ) : (
                <span className="h-4 w-4 rounded-full border border-zinc-300 text-zinc-400 flex items-center justify-center text-[10px] font-mono font-medium">
                  3
                </span>
              )}
              <span className={`text-[11px] ${isStep3Complete ? "font-semibold text-zinc-950" : "text-zinc-500"}`}>
                Academics
              </span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Student Identity */}
        <Card id="section-student-identity" className="bg-white border-zinc-200 shadow-sm scroll-mt-6">
          <CardHeader className="border-b border-zinc-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-950">
                    Section 1: Student Identity & UIDAI Aadhar Verification
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Primary candidate identification and demographic credentials
                  </CardDescription>
                </div>
              </div>
              {isStep1Complete && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1 font-mono">
                  <Check className="h-3 w-3 text-emerald-600 stroke-[3]" /> Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Photo Upload & Preview */}
              <div className="flex flex-col items-center gap-2 shrink-0 sm:w-40">
                <div className="h-40 w-36 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xs">
                  {studentPhoto ? (
                    <>
                      <img src={studentPhoto} alt="Student" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setStudentPhoto(null)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-3 text-center h-full w-full">
                      <Camera className="h-7 w-7 text-zinc-400 mb-1.5" />
                      <span className="text-[11px] text-zinc-800 font-semibold">Student Photo</span>
                      <span className="text-[10px] text-zinc-400 font-mono">Passport Size (PNG/JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setStudentPhoto)}
                      />
                    </label>
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">Live Photo Preview</span>
              </div>

              {/* Bio Inputs */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold">Student Full Name *</Label>
                  <Input
                    placeholder="e.g. S. Ananya"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-9 text-xs bg-white border-zinc-300"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold">Date of Birth (DOB) *</Label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={handleDobChange}
                    className="h-9 text-xs bg-white border-zinc-300 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold">Calculated Age</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 16"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-9 text-xs bg-white border-zinc-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold">Gender *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-9 text-xs bg-white border-zinc-300">
                      <SelectValue placeholder="Select Gender (e.g. Female)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="h-9 text-xs bg-white border-zinc-300">
                      <SelectValue placeholder="Select Blood Group (e.g. B+)" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold flex items-center justify-between">
                    <span>Student Aadhar Number (UIDAI) *</span>
                    <span className="text-[10px] text-zinc-500 font-mono">12-Digit Format (Verified)</span>
                  </Label>
                  <Input
                    placeholder="e.g. 6721 8840 1923"
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    maxLength={14}
                    className="h-9 text-xs bg-white border-zinc-300 font-mono tracking-widest text-zinc-950 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-800 font-semibold">Permanent Residential Address</Label>
                <Input
                  placeholder="e.g. 42, Gandhi Road, Adyar, Chennai - 600020"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-9 text-xs bg-white border-zinc-300"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-800 font-semibold">Emergency Contact Number</Label>
                <Input
                  placeholder="e.g. +91 98400 11223"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="h-9 text-xs bg-white border-zinc-300 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-800 font-semibold">Previous School Attended</Label>
                <Input
                  placeholder="e.g. DAV Matriculation Higher Secondary School, Chennai"
                  value={previousSchool}
                  onChange={(e) => setPreviousSchool(e.target.value)}
                  className="h-9 text-xs bg-white border-zinc-300"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-800 font-semibold">Previous Education Board</Label>
                <Select value={previousBoard} onValueChange={setPreviousBoard}>
                  <SelectTrigger className="h-9 text-xs bg-white border-zinc-300">
                    <SelectValue placeholder="Select Board (e.g. Tamil Nadu State Board)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tamil Nadu State Board">Tamil Nadu State Board (Samacheer Kalvi)</SelectItem>
                    <SelectItem value="Matriculation">Matriculation Board (Tamil Nadu)</SelectItem>
                    <SelectItem value="CBSE">CBSE (Central Board)</SelectItem>
                    <SelectItem value="ICSE">ICSE / ISC</SelectItem>
                    <SelectItem value="Other">Other State / International Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Parents & Guardians */}
        <Card id="section-guardian-details" className="bg-white border-zinc-200 shadow-sm scroll-mt-6">
          <CardHeader className="border-b border-zinc-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-950">
                    Section 2: Father & Mother Identification with Dual Photos
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Guardian records, occupations, contact coordinates, and verification portraits
                  </CardDescription>
                </div>
              </div>
              {isStep2Complete && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1 font-mono">
                  <Check className="h-3 w-3 text-emerald-600 stroke-[3]" /> Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Father Box */}
              <div className="p-4 rounded-lg border border-zinc-300 bg-zinc-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-950">Father / Primary Guardian</span>
                  <Badge variant="contrast" className="text-[10px] font-mono">Guardian 1</Badge>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-zinc-300 bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 group shadow-2xs">
                    {fatherPhoto ? (
                      <>
                        <img src={fatherPhoto} alt="Father" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFatherPhoto(null)}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full text-center p-1.5">
                        <Camera className="h-5 w-5 text-zinc-400 mb-1" />
                        <span className="text-[10px] text-zinc-700 font-semibold">Father Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setFatherPhoto)}
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="space-y-1">
                      <Label className="text-xs text-zinc-800 font-semibold">Father Full Name *</Label>
                      <Input
                        placeholder="e.g. R. Sundararaman"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="h-8 text-xs bg-white border-zinc-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-800 font-semibold">Mobile Phone *</Label>
                    <Input
                      placeholder="+91 98401 55667"
                      value={fatherPhone}
                      onChange={(e) => setFatherPhone(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-300 font-mono font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-800 font-semibold">Occupation</Label>
                    <Input
                      placeholder="e.g. Software Architect"
                      value={fatherOccupation}
                      onChange={(e) => setFatherOccupation(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-300"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Box */}
              <div className="p-4 rounded-lg border border-zinc-300 bg-zinc-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-950">Mother Details</span>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">Guardian 2</Badge>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-zinc-300 bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 group shadow-2xs">
                    {motherPhoto ? (
                      <>
                        <img src={motherPhoto} alt="Mother" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setMotherPhoto(null)}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full text-center p-1.5">
                        <Camera className="h-5 w-5 text-zinc-400 mb-1" />
                        <span className="text-[10px] text-zinc-700 font-semibold">Mother Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setMotherPhoto)}
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="space-y-1">
                      <Label className="text-xs text-zinc-800 font-semibold">Mother Full Name</Label>
                      <Input
                        placeholder="e.g. S. Jayashree"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        className="h-8 text-xs bg-white border-zinc-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-800 font-semibold">Mobile Phone</Label>
                    <Input
                      placeholder="+91 98402 77889"
                      value={motherPhone}
                      onChange={(e) => setMotherPhone(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-300 font-mono font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-800 font-semibold">Occupation</Label>
                    <Input
                      placeholder="e.g. Professor"
                      value={motherOccupation}
                      onChange={(e) => setMotherOccupation(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs text-zinc-800 font-semibold">Official Notification Email Address *</Label>
              <Input
                type="email"
                placeholder="e.g. sundar.family@gmail.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="h-9 text-xs bg-white border-zinc-300 font-mono"
                required
              />
              <span className="text-[11px] text-zinc-500 font-mono">
                Used for sending digital fee invoices, roll call alerts, and printable report cards.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Academic Admission & Tamil Nadu Marksheets */}
        <Card id="section-academics-marksheet" className="bg-white border-zinc-200 shadow-sm scroll-mt-6">
          <CardHeader className="border-b border-zinc-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-zinc-950">
                    Section 3: Target Grade & Tamil Nadu State Board Marksheet Tables
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Syllabus group subject selections, SSLC 10th marks, and Higher Secondary (+1) exam records
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isStep3Complete && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1 font-mono">
                    <Check className="h-3 w-3 text-emerald-600 stroke-[3]" /> Complete
                  </Badge>
                )}
                <Badge variant="contrast" className="font-mono text-[10px]">TN DGE COMPLIANT</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5 text-xs">
            {/* Grade Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-800 font-semibold">Applying For Grade / Standard *</Label>
                <Select value={targetGrade} onValueChange={setTargetGrade}>
                  <SelectTrigger className="h-9 text-xs bg-white border-zinc-300 font-bold">
                    <SelectValue placeholder="Select Target Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(targetGrade === "Grade 11" || targetGrade === "Grade 12") && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-800 font-semibold">
                    {targetGrade === "Grade 12" ? "Higher Secondary (+2) Syllabus Group *" : "Target Senior Secondary Stream *"}
                  </Label>
                  <Select value={selectedGroupKey} onValueChange={setSelectedGroupKey}>
                    <SelectTrigger className="h-9 text-xs bg-white border-zinc-300 font-medium">
                      <SelectValue placeholder="Select Syllabus Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TN_SYLLABUS_GROUPS).map(([key, item]) => (
                        <SelectItem key={key} value={key}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* If Grade 11: Display Tamil Nadu 10th SSLC Marksheet Table */}
            {targetGrade === "Grade 11" && (
              <div className="p-4 rounded-lg border border-zinc-300 bg-white space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                  <div>
                    <div className="font-bold text-xs text-zinc-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-zinc-800" />
                      Tamil Nadu 10th Standard (SSLC) Public Exam Marksheet
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      Department of Government Examinations, Chennai • Samacheer Kalvi Format
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Reg No (e.g. TN-SSLC-991204)"
                      value={tenthRegNo}
                      onChange={(e) => setTenthRegNo(e.target.value)}
                      className="h-8 text-xs w-48 font-mono border-zinc-300"
                    />
                    <Input
                      placeholder="Year (e.g. 2026)"
                      value={tenthYear}
                      onChange={(e) => setTenthYear(e.target.value)}
                      className="h-8 text-xs w-28 font-mono border-zinc-300"
                    />
                  </div>
                </div>

                <div className="border border-zinc-300 rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-100 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800">
                        <TableHead className="w-16">CODE</TableHead>
                        <TableHead>SUBJECT NAME</TableHead>
                        <TableHead className="text-center w-20">MAX</TableHead>
                        <TableHead className="text-center w-20">PASS MIN</TableHead>
                        <TableHead className="text-center w-24">THEORY</TableHead>
                        <TableHead className="text-center w-24">PRACTICAL</TableHead>
                        <TableHead className="text-right w-24">TOTAL</TableHead>
                        <TableHead className="text-right w-20">RESULT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Language */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">001</TableCell>
                        <TableCell className="font-medium text-zinc-950">Language (Tamil)</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            placeholder="e.g. 98"
                            value={tenthMarks.tamil.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, tamil: { ...tenthMarks.tamil, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold text-zinc-950">
                          {tenthMarks.tamil.theory.trim() !== "" ? tenthMarks.tamil.theory : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tenthMarks.tamil.theory.trim() !== "" ? (
                            <Badge variant={Number(tenthMarks.tamil.theory) >= 35 ? "contrast" : "destructive"} className="text-[10px]">
                              {Number(tenthMarks.tamil.theory) >= 35 ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* English */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">002</TableCell>
                        <TableCell className="font-medium text-zinc-950">English</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            placeholder="e.g. 95"
                            value={tenthMarks.english.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, english: { ...tenthMarks.english, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold text-zinc-950">
                          {tenthMarks.english.theory.trim() !== "" ? tenthMarks.english.theory : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tenthMarks.english.theory.trim() !== "" ? (
                            <Badge variant={Number(tenthMarks.english.theory) >= 35 ? "contrast" : "destructive"} className="text-[10px]">
                              {Number(tenthMarks.english.theory) >= 35 ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Mathematics */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">003</TableCell>
                        <TableCell className="font-medium text-zinc-950">Mathematics</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            placeholder="e.g. 100"
                            value={tenthMarks.maths.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, maths: { ...tenthMarks.maths, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold text-zinc-950">
                          {tenthMarks.maths.theory.trim() !== "" ? tenthMarks.maths.theory : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tenthMarks.maths.theory.trim() !== "" ? (
                            <Badge variant={Number(tenthMarks.maths.theory) >= 35 ? "contrast" : "destructive"} className="text-[10px]">
                              {Number(tenthMarks.maths.theory) >= 35 ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Science (Theory 75 + Practical 25) */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">004</TableCell>
                        <TableCell className="font-medium text-zinc-950">Science (Theory 75 + Practical 25)</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={75}
                            min={0}
                            placeholder="Theory (e.g. 74)"
                            value={tenthMarks.science.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, science: { ...tenthMarks.science, theory: e.target.value } })}
                            className="h-7 text-xs w-28 mx-auto text-center font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={25}
                            min={0}
                            placeholder="Prac (e.g. 25)"
                            value={tenthMarks.science.practical}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, science: { ...tenthMarks.science, practical: e.target.value } })}
                            className="h-7 text-xs w-24 mx-auto text-center font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-zinc-950">
                          {tenthMarks.science.theory.trim() !== "" || tenthMarks.science.practical.trim() !== "" ? tenthStats.sciTotal : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tenthMarks.science.theory.trim() !== "" || tenthMarks.science.practical.trim() !== "" ? (
                            <Badge variant={tenthStats.sciTotal >= 35 && Number(tenthMarks.science.theory) >= 20 && Number(tenthMarks.science.practical) >= 15 ? "contrast" : "destructive"} className="text-[10px]">
                              {tenthStats.sciTotal >= 35 && Number(tenthMarks.science.theory) >= 20 && Number(tenthMarks.science.practical) >= 15 ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Social Science */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">005</TableCell>
                        <TableCell className="font-medium text-zinc-950">Social Science</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            placeholder="e.g. 96"
                            value={tenthMarks.social.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, social: { ...tenthMarks.social, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold text-zinc-950">
                          {tenthMarks.social.theory.trim() !== "" ? tenthMarks.social.theory : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tenthMarks.social.theory.trim() !== "" ? (
                            <Badge variant={Number(tenthMarks.social.theory) >= 35 ? "contrast" : "destructive"} className="text-[10px]">
                              {Number(tenthMarks.social.theory) >= 35 ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Aggregate Summary */}
                      <TableRow className="bg-zinc-100/80 border-t-2 border-zinc-300 font-bold text-xs">
                        <TableCell colSpan={2} className="text-zinc-950">AGGREGATE 10TH TOTAL</TableCell>
                        <TableCell className="text-center font-mono">500</TableCell>
                        <TableCell className="text-center font-mono">175</TableCell>
                        <TableCell colSpan={2} className="text-right text-zinc-600 font-mono">
                          PERCENTAGE: <span className="text-zinc-950 font-bold text-sm">{tenthStats.hasAnyMarks ? `${tenthStats.percentage}%` : "-"}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-zinc-950 font-bold">
                          {tenthStats.hasAnyMarks ? `${tenthStats.total} / 500` : "- / 500"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tenthStats.hasAnyMarks ? (
                            <Badge variant={tenthStats.isPass ? "contrast" : "destructive"}>
                              {tenthStats.isPass ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* If Grade 12: Dynamic Higher Secondary Group Subjects Table */}
            {targetGrade === "Grade 12" && (
              <div className="p-4 rounded-lg border border-zinc-300 bg-white space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                  <div>
                    <div className="font-bold text-xs text-zinc-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-zinc-800" />
                      Tamil Nadu +1 (Grade 11) Public Exam Marks: {TN_SYLLABUS_GROUPS[selectedGroupKey]?.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      Subjects update automatically based on selected group
                    </div>
                  </div>
                  <Input
                    placeholder="11th Reg No (e.g. TN-HSC-729104)"
                    value={eleventhRegNo}
                    onChange={(e) => setEleventhRegNo(e.target.value)}
                    className="h-8 text-xs w-60 font-mono border-zinc-300"
                  />
                </div>

                <div className="border border-zinc-300 rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-100 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800">
                        <TableHead className="w-16">CODE</TableHead>
                        <TableHead>SUBJECT NAME</TableHead>
                        <TableHead className="text-center w-20">MAX</TableHead>
                        <TableHead className="text-center w-20">PASS</TableHead>
                        <TableHead className="text-center w-28">THEORY</TableHead>
                        <TableHead className="text-center w-28">PRACT/INT</TableHead>
                        <TableHead className="text-right w-24">TOTAL</TableHead>
                        <TableHead className="text-right w-20">RESULT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TN_SYLLABUS_GROUPS[selectedGroupKey]?.subjects.map((sub) => {
                        const entry = eleventhMarks[sub.code] || { theory: "", practical: "" };
                        const hasValue = entry.theory.trim() !== "" || entry.practical.trim() !== "";
                        const th = Number(entry.theory) || 0;
                        const pr = Number(entry.practical) || 0;
                        const subTotal = th + pr;
                        const isSubPass = subTotal >= sub.minPass;

                        return (
                          <TableRow key={sub.code} className="border-zinc-200 text-xs">
                            <TableCell className="font-mono text-zinc-500">{sub.code}</TableCell>
                            <TableCell className="font-medium text-zinc-950">{sub.name}</TableCell>
                            <TableCell className="text-center font-mono text-zinc-600">{sub.maxTheory + sub.maxPractical}</TableCell>
                            <TableCell className="text-center font-mono text-zinc-600">{sub.minPass}</TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                max={sub.maxTheory}
                                min={0}
                                placeholder={`e.g. ${sub.maxTheory - 5}`}
                                value={entry.theory}
                                onChange={(e) => {
                                  setEleventhMarks({
                                    ...eleventhMarks,
                                    [sub.code]: { ...entry, theory: e.target.value },
                                  });
                                }}
                                className="h-7 text-xs w-20 mx-auto text-center font-mono font-bold"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                max={sub.maxPractical}
                                min={0}
                                placeholder={`e.g. ${sub.maxPractical}`}
                                value={entry.practical}
                                onChange={(e) => {
                                  setEleventhMarks({
                                    ...eleventhMarks,
                                    [sub.code]: { ...entry, practical: e.target.value },
                                  });
                                }}
                                className="h-7 text-xs w-20 mx-auto text-center font-mono font-bold"
                              />
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-zinc-950">
                              {hasValue ? subTotal : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {hasValue ? (
                                <Badge variant={isSubPass ? "contrast" : "destructive"} className="text-[10px]">
                                  {isSubPass ? "PASS" : "FAIL"}
                                </Badge>
                              ) : (
                                <span className="text-zinc-400 font-mono text-[11px]">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* 11th Aggregate Summary */}
                      <TableRow className="bg-zinc-100/80 border-t-2 border-zinc-300 font-bold text-xs">
                        <TableCell colSpan={2} className="text-zinc-950">11TH EXAM AGGREGATE</TableCell>
                        <TableCell className="text-center font-mono">{eleventhStats.maxTotal}</TableCell>
                        <TableCell className="text-center font-mono">210</TableCell>
                        <TableCell colSpan={2} className="text-right text-zinc-600 font-mono">
                          PERCENTAGE: <span className="text-zinc-950 font-bold text-sm">{eleventhStats.hasAnyMarks ? `${eleventhStats.percentage}%` : "-"}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-zinc-950 font-bold">
                          {eleventhStats.hasAnyMarks ? `${eleventhStats.total} / ${eleventhStats.maxTotal}` : `- / ${eleventhStats.maxTotal}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {eleventhStats.hasAnyMarks ? (
                            <Badge variant={eleventhStats.isPass ? "contrast" : "destructive"}>
                              {eleventhStats.isPass ? "PASS" : "FAIL"}
                            </Badge>
                          ) : (
                            <span className="text-zinc-400 font-mono text-[11px]">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* If Grade 1 to 10 */}
            {targetGrade !== "Grade 11" && targetGrade !== "Grade 12" && (
              <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 text-center space-y-1.5">
                <Building className="h-6 w-6 text-zinc-500 mx-auto" />
                <div className="font-semibold text-xs text-zinc-900">Elementary / Middle School ({targetGrade})</div>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                  Standard grade admission. Evaluation based on previous school report cards and Transfer Certificate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Submission Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-zinc-200 bg-zinc-50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <ShieldCheck className="h-4 w-4 text-zinc-950" />
            <span>Submitting immediately registers candidate into database and opens the <strong>Document Vault</strong>.</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`${basePath}/admissions`}>
              <Button type="button" variant="outline" size="sm" className="h-9 text-xs border-zinc-300">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 text-xs bg-zinc-900 text-white hover:bg-zinc-800 font-semibold px-5 shadow-sm"
            >
              {isSubmitting ? "Submitting Registration..." : "Submit Admission & Open Document Vault"}
            </Button>
          </div>
        </div>
      </form>

      {/* Document Vault Modal upon submission */}
      <DocumentVaultModal
        isOpen={isVaultOpen}
        onClose={() => {
          setIsVaultOpen(false);
          router.push(`${basePath}/admissions`);
        }}
        application={createdApplication}
      />
    </div>
  );
}
