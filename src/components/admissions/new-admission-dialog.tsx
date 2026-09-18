"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ArrowLeft,
  Award,
  AlertCircle,
  FileCheck2,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react";
import { erpApi } from "@/lib/api";

interface NewAdmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  onAdmissionCreated: (newApp: any) => void;
}

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

export function NewAdmissionDialog({
  isOpen,
  onClose,
  schoolSlug,
  onAdmissionCreated,
}: NewAdmissionDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Step 1: Student Details
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

  // Step 2: Parent Details
  const [fatherName, setFatherName] = React.useState("");
  const [fatherPhone, setFatherPhone] = React.useState("");
  const [fatherOccupation, setFatherOccupation] = React.useState("");
  const [fatherPhoto, setFatherPhoto] = React.useState<string | null>(null);

  const [motherName, setMotherName] = React.useState("");
  const [motherPhone, setMotherPhone] = React.useState("");
  const [motherOccupation, setMotherOccupation] = React.useState("");
  const [motherPhoto, setMotherPhoto] = React.useState<string | null>(null);

  const [parentEmail, setParentEmail] = React.useState("");

  // Step 3: Academic Admission & Tamil Nadu Marksheet
  const [targetGrade, setTargetGrade] = React.useState("");
  const [selectedGroupKey, setSelectedGroupKey] = React.useState("BIO_MATHS");

  // 10th SSLC Marksheet Fields (Tamil Nadu format)
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

  // Initialize 11th marks structure whenever selected group changes
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

  // Recalculate age when DOB changes
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

  // Generic Photo Reader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Format Aadhar number as XXXX XXXX XXXX
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const parts = raw.match(/.{1,4}/g) || [];
    setAadharNumber(parts.join(" "));
  };

  // Calculate 10th SSLC Total and Pass/Fail
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

  // Calculate 11th HSC Total and Pass/Fail (for Grade 12 Admission)
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

  const handleNext = () => {
    if (currentStep === 1) {
      if (!studentName.trim()) {
        alert("Please enter candidate's full name");
        return;
      }
    } else if (currentStep === 2) {
      if (!fatherName.trim() && !motherName.trim()) {
        alert("Please provide Father or Mother details");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const is12th = targetGrade === "Grade 12";
      const isHigherSec = targetGrade === "Grade 11" || targetGrade === "Grade 12";

      // Build Tamil Nadu 10th Marks JSON
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

      // Build Tamil Nadu 11th Marks JSON (if 12th)
      const groupDef = TN_SYLLABUS_GROUPS[selectedGroupKey];
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
      };

      let createdRecord = null;
      try {
        createdRecord = await erpApi.submitApplication(payload);
      } catch {
        // Mock fallback record if offline
        createdRecord = {
          id: `app-${Date.now()}`,
          applicationNo: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
          studentName,
          dob,
          gender,
          targetGrade,
          parentName: fatherName || motherName || "Guardian",
          parentPhone: fatherPhone || motherPhone || "",
          aadharNumber,
          studentPhotoUrl: studentPhoto,
          streamGroup: isHigherSec ? groupDef?.name : null,
          tenthMarksData: JSON.stringify(tenthMarksData),
          eleventhMarksData: eleventhMarksData ? JSON.stringify(eleventhMarksData) : null,
          status: "UNDER_REVIEW",
          interviewScore: null,
          docsVerified: false,
          documentsData: "[]",
        };
      }

      onAdmissionCreated(createdRecord);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto bg-white border-zinc-200 text-zinc-950 p-6">
        <DialogHeader className="border-b border-zinc-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-950">
                  New Student Admission Wizard
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 font-mono">
                  FLOW #9 • INSTITUTIONAL CANDIDATE REGISTRATION & COMPLIANCE
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    currentStep === step
                      ? "w-7 bg-zinc-900"
                      : currentStep > step
                      ? "w-4 bg-zinc-400"
                      : "w-4 bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* STEP 1: Candidate Bio & Aadhar */}
        {currentStep === 1 && (
          <div className="space-y-4 py-3 text-xs">
            <div className="font-semibold text-xs text-zinc-900 border-b border-zinc-100 pb-1 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Step 1: Student Identity & UIDAI Aadhar Verification
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Photo Upload & Live Preview */}
              <div className="flex flex-col items-center gap-2 shrink-0 sm:w-36">
                <div className="h-36 w-32 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center relative overflow-hidden group">
                  {studentPhoto ? (
                    <>
                      <img
                        src={studentPhoto}
                        alt="Student"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setStudentPhoto(null)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-2 text-center h-full w-full">
                      <Camera className="h-6 w-6 text-zinc-400 mb-1" />
                      <span className="text-[10px] text-zinc-600 font-medium">Student Photo</span>
                      <span className="text-[9px] text-zinc-400">(Passport size)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setStudentPhoto)}
                      />
                    </label>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Live Photo Preview</span>
              </div>

              {/* Bio Inputs */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs text-zinc-700">Student Full Name *</Label>
                  <Input
                    placeholder="e.g. Alexander Chen / K. Saravanan"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-8 text-xs bg-white border-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-zinc-700">Date of Birth (DOB) *</Label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={handleDobChange}
                    className="h-8 text-xs bg-white border-zinc-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-zinc-700">Calculated Age</Label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-8 text-xs bg-white border-zinc-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-zinc-700">Gender *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-8 text-xs bg-white border-zinc-200">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-zinc-700">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="h-8 text-xs bg-white border-zinc-200">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs text-zinc-700 flex items-center justify-between">
                    <span>Student Aadhar Number (UIDAI) *</span>
                    <span className="text-[10px] text-zinc-400 font-mono">12 Digits (Encrypted)</span>
                  </Label>
                  <Input
                    placeholder="e.g. 5482 9104 8821"
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    maxLength={14}
                    className="h-8 text-xs bg-white border-zinc-200 font-mono tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Address & Previous School */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-700">Permanent Residential Address</Label>
                <Input
                  placeholder="Street, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-8 text-xs bg-white border-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-700">Emergency Contact Number</Label>
                <Input
                  placeholder="+91 98765 43210"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="h-8 text-xs bg-white border-zinc-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-700">Previous School Attended</Label>
                <Input
                  placeholder="e.g. St. Bede's Matriculation School, Chennai"
                  value={previousSchool}
                  onChange={(e) => setPreviousSchool(e.target.value)}
                  className="h-8 text-xs bg-white border-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-700">Previous Education Board</Label>
                <Select value={previousBoard} onValueChange={setPreviousBoard}>
                  <SelectTrigger className="h-8 text-xs bg-white border-zinc-200">
                    <SelectValue placeholder="Select Board" />
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
          </div>
        )}

        {/* STEP 2: Parents Information (Father & Mother with Photos) */}
        {currentStep === 2 && (
          <div className="space-y-4 py-3 text-xs">
            <div className="font-semibold text-xs text-zinc-900 border-b border-zinc-100 pb-1 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Step 2: Father & Mother Identification with Dual Photo Preview
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Father Profile */}
              <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-zinc-900">Father / Primary Guardian</span>
                  <Badge variant="outline" className="text-[10px] border-zinc-300">Guardian 1</Badge>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="h-20 w-20 rounded-md border-2 border-dashed border-zinc-300 bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 group">
                    {fatherPhoto ? (
                      <>
                        <img src={fatherPhoto} alt="Father" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFatherPhoto(null)}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full text-center p-1">
                        <Camera className="h-4 w-4 text-zinc-400 mb-1" />
                        <span className="text-[9px] text-zinc-500 font-medium">Father Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setFatherPhoto)}
                        />
                      </label>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-[11px] text-zinc-600">Father's Full Name *</Label>
                    <Input
                      placeholder="e.g. Rajesh Chen / S. Kandasamy"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-zinc-600">Mobile Phone Number *</Label>
                    <Input
                      placeholder="+91 98401 23456"
                      value={fatherPhone}
                      onChange={(e) => setFatherPhone(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-zinc-600">Occupation / Business</Label>
                    <Input
                      placeholder="e.g. Civil Engineer / Merchant"
                      value={fatherOccupation}
                      onChange={(e) => setFatherOccupation(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-200"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Profile */}
              <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-zinc-900">Mother Details</span>
                  <Badge variant="outline" className="text-[10px] border-zinc-300">Guardian 2</Badge>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="h-20 w-20 rounded-md border-2 border-dashed border-zinc-300 bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 group">
                    {motherPhoto ? (
                      <>
                        <img src={motherPhoto} alt="Mother" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setMotherPhoto(null)}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full text-center p-1">
                        <Camera className="h-4 w-4 text-zinc-400 mb-1" />
                        <span className="text-[9px] text-zinc-500 font-medium">Mother Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setMotherPhoto)}
                        />
                      </label>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-[11px] text-zinc-600">Mother's Full Name *</Label>
                    <Input
                      placeholder="e.g. Priya Chen / K. Meenakshi"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-zinc-600">Mobile Phone Number</Label>
                    <Input
                      placeholder="+91 98402 34567"
                      value={motherPhone}
                      onChange={(e) => setMotherPhone(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-200 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-zinc-600">Occupation</Label>
                    <Input
                      placeholder="e.g. Educator / Homemaker"
                      value={motherOccupation}
                      onChange={(e) => setMotherOccupation(e.target.value)}
                      className="h-8 text-xs bg-white border-zinc-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <Label className="text-xs text-zinc-700">Official Communication Email ID *</Label>
              <Input
                type="email"
                placeholder="parents@domain.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="h-8 text-xs bg-white border-zinc-200 font-mono"
              />
              <span className="text-[10px] text-zinc-500 font-mono">
                Used for sending digital fee invoices, report cards, and SMS admission confirmations.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Academic Admission & Tamil Nadu Marksheet Engine */}
        {currentStep === 3 && (
          <div className="space-y-4 py-3 text-xs">
            <div className="font-semibold text-xs text-zinc-900 border-b border-zinc-100 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Step 3: Target Grade & Tamil Nadu Marksheet Subject Tables
              </div>
              <Badge variant="contrast" className="text-[10px] font-mono">TN DGE Standard</Badge>
            </div>

            {/* Target Grade Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-700 font-semibold">Applying For Grade / Standard *</Label>
                <Select value={targetGrade} onValueChange={setTargetGrade}>
                  <SelectTrigger className="h-8 text-xs bg-white border-zinc-300 font-bold">
                    <SelectValue placeholder="Select Target Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* If Grade 11 or 12: Stream Group Selector */}
              {(targetGrade === "Grade 11" || targetGrade === "Grade 12") && (
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-700 font-semibold">
                    {targetGrade === "Grade 12" ? "Higher Secondary (+2) Syllabus Group *" : "Target Senior Secondary Stream *"}
                  </Label>
                  <Select value={selectedGroupKey} onValueChange={setSelectedGroupKey}>
                    <SelectTrigger className="h-8 text-xs bg-white border-zinc-300 font-medium">
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
              <div className="p-3.5 rounded-lg border border-zinc-300 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200">
                  <div>
                    <div className="font-bold text-xs text-zinc-950 uppercase tracking-wide">
                      Tamil Nadu 10th Standard (SSLC) Public Exam Marksheet
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Department of Government Examinations, Chennai • Samacheer Kalvi
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Reg No (e.g. 847291)"
                      value={tenthRegNo}
                      onChange={(e) => setTenthRegNo(e.target.value)}
                      className="h-7 text-xs w-36 font-mono border-zinc-300"
                    />
                    <Input
                      placeholder="Year (2026)"
                      value={tenthYear}
                      onChange={(e) => setTenthYear(e.target.value)}
                      className="h-7 text-xs w-20 font-mono border-zinc-300"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="border border-zinc-200 rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-100 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800">
                        <TableHead className="w-12">CODE</TableHead>
                        <TableHead>SUBJECT</TableHead>
                        <TableHead className="text-center w-20">MAX</TableHead>
                        <TableHead className="text-center w-20">PASS MIN</TableHead>
                        <TableHead className="text-center w-24">THEORY</TableHead>
                        <TableHead className="text-center w-24">PRACTICAL</TableHead>
                        <TableHead className="text-right w-24">TOTAL</TableHead>
                        <TableHead className="text-right w-16">RESULT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Language */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">001</TableCell>
                        <TableCell className="font-medium text-zinc-900">Language (Tamil)</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            value={tenthMarks.tamil.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, tamil: { ...tenthMarks.tamil, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold">{tenthMarks.tamil.theory || 0}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-[10px] font-mono font-bold ${Number(tenthMarks.tamil.theory) >= 35 ? "text-zinc-900" : "text-zinc-500"}`}>
                            {Number(tenthMarks.tamil.theory) >= 35 ? "PASS" : "FAIL"}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* English */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">002</TableCell>
                        <TableCell className="font-medium text-zinc-900">English</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            value={tenthMarks.english.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, english: { ...tenthMarks.english, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold">{tenthMarks.english.theory || 0}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-[10px] font-mono font-bold ${Number(tenthMarks.english.theory) >= 35 ? "text-zinc-900" : "text-zinc-500"}`}>
                            {Number(tenthMarks.english.theory) >= 35 ? "PASS" : "FAIL"}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* Mathematics */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">003</TableCell>
                        <TableCell className="font-medium text-zinc-900">Mathematics</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            value={tenthMarks.maths.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, maths: { ...tenthMarks.maths, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold">{tenthMarks.maths.theory || 0}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-[10px] font-mono font-bold ${Number(tenthMarks.maths.theory) >= 35 ? "text-zinc-900" : "text-zinc-500"}`}>
                            {Number(tenthMarks.maths.theory) >= 35 ? "PASS" : "FAIL"}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* Science (Theory 75 + Practical 25) */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">004</TableCell>
                        <TableCell className="font-medium text-zinc-900">Science (Theory 75 + Practical 25)</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={75}
                            min={0}
                            placeholder="Max 75"
                            value={tenthMarks.science.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, science: { ...tenthMarks.science, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={25}
                            min={0}
                            placeholder="Max 25"
                            value={tenthMarks.science.practical}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, science: { ...tenthMarks.science, practical: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold">{tenthStats.sciTotal}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-[10px] font-mono font-bold ${tenthStats.sciTotal >= 35 ? "text-zinc-900" : "text-zinc-500"}`}>
                            {tenthStats.sciTotal >= 35 ? "PASS" : "FAIL"}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* Social Science */}
                      <TableRow className="border-zinc-200 text-xs">
                        <TableCell className="font-mono text-zinc-500">005</TableCell>
                        <TableCell className="font-medium text-zinc-900">Social Science</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">100</TableCell>
                        <TableCell className="text-center font-mono text-zinc-600">35</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            value={tenthMarks.social.theory}
                            onChange={(e) => setTenthMarks({ ...tenthMarks, social: { ...tenthMarks.social, theory: e.target.value } })}
                            className="h-7 text-xs w-16 mx-auto text-center font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-center font-mono text-zinc-400">-</TableCell>
                        <TableCell className="text-right font-mono font-bold">{tenthMarks.social.theory || 0}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-[10px] font-mono font-bold ${Number(tenthMarks.social.theory) >= 35 ? "text-zinc-900" : "text-zinc-500"}`}>
                            {Number(tenthMarks.social.theory) >= 35 ? "PASS" : "FAIL"}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* Aggregate Row */}
                      <TableRow className="bg-zinc-100/70 border-t-2 border-zinc-300 font-bold text-xs">
                        <TableCell colSpan={2}>AGGREGATE TOTAL</TableCell>
                        <TableCell className="text-center font-mono">500</TableCell>
                        <TableCell className="text-center font-mono">175</TableCell>
                        <TableCell colSpan={2} className="text-right text-zinc-500 font-mono">
                          PERCENTAGE: <span className="text-zinc-950">{tenthStats.percentage}%</span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-zinc-950 font-bold">
                          {tenthStats.total} / 500
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={tenthStats.isPass ? "contrast" : "destructive"} className="text-[10px]">
                            {tenthStats.isPass ? "PASS" : "FAIL"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* If Grade 12: Dynamic Higher Secondary Group Subjects Table */}
            {targetGrade === "Grade 12" && (
              <div className="p-3.5 rounded-lg border border-zinc-300 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200">
                  <div>
                    <div className="font-bold text-xs text-zinc-950 uppercase tracking-wide">
                      Tamil Nadu +1 (Grade 11) Public Exam Marks for: {TN_SYLLABUS_GROUPS[selectedGroupKey]?.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Dynamic subject list adapts automatically to chosen syllabus group
                    </div>
                  </div>
                  <Input
                    placeholder="11th Reg No (729104)"
                    value={eleventhRegNo}
                    onChange={(e) => setEleventhRegNo(e.target.value)}
                    className="h-7 text-xs w-40 font-mono border-zinc-300"
                  />
                </div>

                <div className="border border-zinc-200 rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-100 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-800">
                        <TableHead className="w-12">CODE</TableHead>
                        <TableHead>SUBJECT NAME</TableHead>
                        <TableHead className="text-center w-16">MAX</TableHead>
                        <TableHead className="text-center w-16">PASS</TableHead>
                        <TableHead className="text-center w-24">THEORY</TableHead>
                        <TableHead className="text-center w-24">PRACT/INT</TableHead>
                        <TableHead className="text-right w-20">TOTAL</TableHead>
                        <TableHead className="text-right w-16">RESULT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TN_SYLLABUS_GROUPS[selectedGroupKey]?.subjects.map((sub) => {
                        const entry = eleventhMarks[sub.code] || { theory: "0", practical: "0" };
                        const th = Number(entry.theory) || 0;
                        const pr = Number(entry.practical) || 0;
                        const subTotal = th + pr;
                        const isSubPass = subTotal >= sub.minPass;

                        return (
                          <TableRow key={sub.code} className="border-zinc-200 text-xs">
                            <TableCell className="font-mono text-zinc-500">{sub.code}</TableCell>
                            <TableCell className="font-medium text-zinc-900">{sub.name}</TableCell>
                            <TableCell className="text-center font-mono text-zinc-600">{sub.maxTheory + sub.maxPractical}</TableCell>
                            <TableCell className="text-center font-mono text-zinc-600">{sub.minPass}</TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                max={sub.maxTheory}
                                min={0}
                                placeholder={`Max ${sub.maxTheory}`}
                                value={entry.theory}
                                onChange={(e) => {
                                  setEleventhMarks({
                                    ...eleventhMarks,
                                    [sub.code]: { ...entry, theory: e.target.value },
                                  });
                                }}
                                className="h-7 text-xs w-16 mx-auto text-center font-mono"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                max={sub.maxPractical}
                                min={0}
                                placeholder={`Max ${sub.maxPractical}`}
                                value={entry.practical}
                                onChange={(e) => {
                                  setEleventhMarks({
                                    ...eleventhMarks,
                                    [sub.code]: { ...entry, practical: e.target.value },
                                  });
                                }}
                                className="h-7 text-xs w-16 mx-auto text-center font-mono"
                              />
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-zinc-950">{subTotal}</TableCell>
                            <TableCell className="text-right">
                              <span className={`text-[10px] font-mono font-bold ${isSubPass ? "text-zinc-900" : "text-zinc-500"}`}>
                                {isSubPass ? "PASS" : "FAIL"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* Aggregate Row */}
                      <TableRow className="bg-zinc-100/70 border-t-2 border-zinc-300 font-bold text-xs">
                        <TableCell colSpan={2}>11TH EXAM AGGREGATE</TableCell>
                        <TableCell className="text-center font-mono">{eleventhStats.maxTotal}</TableCell>
                        <TableCell className="text-center font-mono">210</TableCell>
                        <TableCell colSpan={2} className="text-right text-zinc-500 font-mono">
                          PERCENTAGE: <span className="text-zinc-950">{eleventhStats.percentage}%</span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-zinc-950 font-bold">
                          {eleventhStats.total} / {eleventhStats.maxTotal}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={eleventhStats.isPass ? "contrast" : "destructive"} className="text-[10px]">
                            {eleventhStats.isPass ? "PASS" : "FAIL"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* If Grade 1 to 10: Simple previous score note */}
            {targetGrade !== "Grade 11" && targetGrade !== "Grade 12" && (
              <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 text-center space-y-2">
                <Building className="h-8 w-8 text-zinc-400 mx-auto" />
                <div className="font-semibold text-xs text-zinc-900">Elementary & Middle School Admission ({targetGrade})</div>
                <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
                  Applicant will be admitted based on previous academic year record card, entrance diagnostic review, and TC verification.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-4 py-3 text-xs">
            <div className="font-semibold text-xs text-zinc-900 border-b border-zinc-100 pb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Step 4: Final Candidate Review & Document Vault Queue
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full border border-zinc-300 overflow-hidden bg-white flex items-center justify-center">
                  {studentPhoto ? (
                    <img src={studentPhoto} alt="Student" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-zinc-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-950">{studentName || "Candidate"}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">DOB: {dob} (Age {age})</div>
                  <div className="text-[10px] text-zinc-500 font-mono">UIDAI: {aadharNumber || "Pending"}</div>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5 text-left">
                <span className="text-[10px] text-zinc-500 font-mono block uppercase">Parents & Contacts</span>
                <div>
                  <span className="font-semibold text-zinc-900">Father: </span>
                  <span className="text-zinc-700">{fatherName || "N/A"} ({fatherPhone || "N/A"})</span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-900">Mother: </span>
                  <span className="text-zinc-700">{motherName || "N/A"} ({motherPhone || "N/A"})</span>
                </div>
                <div className="pt-1 text-[11px] text-zinc-600 truncate">
                  {address || "Chennai, Tamil Nadu"}
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5 text-left">
                <span className="text-[10px] text-zinc-500 font-mono block uppercase">Academic Placement</span>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Enrolling Into:</span>
                  <Badge variant="contrast" className="font-bold">{targetGrade}</Badge>
                </div>
                {(targetGrade === "Grade 11" || targetGrade === "Grade 12") && (
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-mono">Syllabus Group:</span>
                    <span className="font-semibold text-zinc-900 text-[11px]">
                      {TN_SYLLABUS_GROUPS[selectedGroupKey]?.name || selectedGroupKey}
                    </span>
                  </div>
                )}
                {targetGrade === "Grade 11" && (
                  <div className="pt-1 text-[11px] text-zinc-700 font-mono">
                    10th SSLC Score: <span className="font-bold text-zinc-950">{tenthStats.total}/500 ({tenthStats.percentage}%)</span>
                  </div>
                )}
                {targetGrade === "Grade 12" && (
                  <div className="pt-1 text-[11px] text-zinc-700 font-mono">
                    11th HSC Score: <span className="font-bold text-zinc-950">{eleventhStats.total}/{eleventhStats.maxTotal} ({eleventhStats.percentage}%)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-300 bg-zinc-100/50 flex items-start gap-2.5">
              <FileCheck2 className="h-4 w-4 text-zinc-800 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-700">
                <span className="font-semibold text-zinc-950">Immediate Next Step: Document Vault Upload</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Submitting this candidate generates the institutional application ID and automatically triggers the **Document Vault** where you can upload the student's Transfer Certificate (TC), Marksheet scan, and Aadhar proof.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <DialogFooter className="border-t border-zinc-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="h-8 text-xs border-zinc-300"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Previous Step
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs border-zinc-200"
            >
              Cancel
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 font-semibold"
              >
                Continue to Step {currentStep + 1} <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 font-semibold"
              >
                {isSubmitting ? "Registering Candidate..." : "Submit Admission & Open Document Vault"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
