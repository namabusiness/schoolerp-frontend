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
import { Textarea } from "@/components/ui/textarea";
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
import { Attachment } from "@/components/ui/attachment";
import { BookOpen, Plus, FileText, CheckCircle2, Clock } from "lucide-react";

const DEMO_HOMEWORK = [
  {
    id: "hw-1",
    title: "Trigonometric Identities & Complex Equations",
    subject: "Advanced Mathematics",
    class: "Grade 10 - Section A",
    dueDate: "2026-09-20",
    submissionsCount: 32,
    totalStudents: 35,
    attachment: "Unit_3_Trig_ProblemSet.pdf",
    status: "ACTIVE",
  },
  {
    id: "hw-2",
    title: "Newton's Second Law & Friction Vectors Experiment",
    subject: "Physics & Lab Mechanics",
    class: "Grade 10 - Section A",
    dueDate: "2026-09-18",
    submissionsCount: 34,
    totalStudents: 35,
    attachment: "Friction_Lab_Manual_v2.pdf",
    status: "ACTIVE",
  },
  {
    id: "hw-3",
    title: "Shakespearean Soliloquy Literary Analysis Essay",
    subject: "English Literature",
    class: "Grade 10 - Section A",
    dueDate: "2026-09-15",
    submissionsCount: 35,
    totalStudents: 35,
    attachment: "Macbeth_Act_1_Prompt.pdf",
    status: "GRADED",
  },
];

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = React.useState(DEMO_HOMEWORK);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [subject, setSubject] = React.useState("Advanced Mathematics");
  const [dueDate, setDueDate] = React.useState("2026-09-22");
  const [instructions, setInstructions] = React.useState("");

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const newHw = {
      id: `hw-${Date.now()}`,
      title,
      subject,
      class: "Grade 10 - Section A",
      dueDate,
      submissionsCount: 0,
      totalStudents: 35,
      attachment: "Homework_Worksheet_Attached.pdf",
      status: "ACTIVE",
    };
    setHomeworkList([newHw, ...homeworkList]);
    setIsCreateOpen(false);
    setTitle("");
    setInstructions("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Homework & Learning Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #13: CREATE MATERIAL → ATTACHMENTS & DUE DATES → SUBMISSION → TEACHER REVIEW & GRADES
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Publish Homework / Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Publish Assignment / Learning Material</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Dispatches assignment notice to student and parent dashboards with attachment download.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateHomework} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Assignment Title</Label>
                <Input
                  placeholder="e.g. Chapter 4: Matrix Transformations & Determinants"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Submission Due Date</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Instructions & Objectives</Label>
                <Textarea
                  placeholder="Complete problem exercises 1 through 15 on page 84..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1 pt-1">
                <Label className="text-xs text-zinc-400">Attached Resource / Worksheet</Label>
                <Attachment name="Algebra_Chapter_4_Notes.pdf" size="1.2 MB" />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Publish to Classroom
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Assignment Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Classroom</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions Rate</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworkList.map((hw) => (
                <TableRow key={hw.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                  <TableCell className="font-medium text-white">{hw.title}</TableCell>
                  <TableCell className="text-zinc-300">{hw.subject}</TableCell>
                  <TableCell className="text-zinc-400">{hw.class}</TableCell>
                  <TableCell className="font-mono text-zinc-300">{hw.dueDate}</TableCell>
                  <TableCell className="font-mono">
                    {hw.submissionsCount} / {hw.totalStudents} ({Math.round((hw.submissionsCount / hw.totalStudents) * 100)}%)
                  </TableCell>
                  <TableCell>
                    <Attachment name={hw.attachment} size="850 KB" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={hw.status === "GRADED" ? "contrast" : "outline"} className="text-[10px]">
                      {hw.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
