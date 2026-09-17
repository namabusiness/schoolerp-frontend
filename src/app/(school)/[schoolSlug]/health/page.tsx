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
import { Checkbox } from "@/components/ui/checkbox";
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
import { HeartPulse, Plus, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

const DEMO_INCIDENTS = [
  {
    id: "inc-1",
    studentName: "Alexander Chen",
    class: "Grade 10 - Section A",
    dateTime: "2026-09-14 13:45",
    location: "Science Lab 2",
    type: "Minor Heat Burn",
    description: "Accidentally brushed warm beaker during chemical distillation experiment.",
    staffInvolved: "Dr. Catherine Brooks (Faculty), Nurse Clara",
    actionTaken: "Cold burn compress applied, antiseptic dressing provided. Student resumed class after 20 mins.",
    parentNotified: true,
  },
  {
    id: "inc-2",
    studentName: "Liam Smith",
    class: "Grade 10 - Section A",
    dateTime: "2026-09-11 11:20",
    location: "Soccer Ground",
    type: "Ankle Sprain",
    description: "Twisted ankle during inter-house scrimmage match.",
    staffInvolved: "Coach Taylor, Campus Infirmary Nurse",
    actionTaken: "RICE therapy protocol applied, crepe bandage support wrapped, ice pack administered.",
    parentNotified: true,
  },
];

export default function StudentHealthPage() {
  const [incidents, setIncidents] = React.useState(DEMO_INCIDENTS);
  const [isLogOpen, setIsLogOpen] = React.useState(false);

  // Form State
  const [studentName, setStudentName] = React.useState("Alexander Chen");
  const [incidentType, setIncidentType] = React.useState("Minor First Aid");
  const [location, setLocation] = React.useState("Classroom Wing B");
  const [description, setDescription] = React.useState("");
  const [actionTaken, setActionTaken] = React.useState("");
  const [parentNotified, setParentNotified] = React.useState(true);

  const handleLogIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc = {
      id: `inc-${Date.now()}`,
      studentName,
      class: "Grade 10 - Section A",
      dateTime: "2026-09-16 14:15",
      location,
      type: incidentType,
      description,
      staffInvolved: "Staff on Duty, Campus Infirmary",
      actionTaken,
      parentNotified,
    };
    setIncidents([newInc, ...incidents]);
    setIsLogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Student Health & Incident Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #22: INFIRMARY LOGS, INJURY REPORTS, STAFF INVOLVED, ACTION TAKEN & PARENT ALERTS
          </p>
        </div>

        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Record Health / Safety Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Record Student Health Incident</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Logged to student's 360 profile and dispatches immediate notification to guardian.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLogIncident} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Student Name</Label>
                <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Incident Category</Label>
                  <Input value={incidentType} onChange={(e) => setIncidentType(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Clinical / Incident Details</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Action Taken by Infirmary / Staff</Label>
                <Textarea value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} rows={2} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox checked={parentNotified} onCheckedChange={(v) => setParentNotified(Boolean(v))} />
                <span className="text-xs text-zinc-300">Send instant notification alert to Parent / Guardian</span>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsLogOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200 font-semibold">
                  Save Incident to Health File
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
                <TableHead>Date & Time</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead className="text-right">Parent Notified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((inc) => (
                <TableRow key={inc.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                  <TableCell className="font-mono text-zinc-400 whitespace-nowrap">{inc.dateTime}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-white">{inc.studentName}</div>
                    <div className="text-[10px] text-zinc-500">{inc.class}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-zinc-700">{inc.type}</Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">{inc.location}</TableCell>
                  <TableCell className="text-zinc-300 max-w-sm">{inc.actionTaken}</TableCell>
                  <TableCell className="text-right">
                    {inc.parentNotified ? (
                      <Badge variant="contrast" className="text-[10px]">NOTIFIED</Badge>
                    ) : (
                      <Badge variant="subtle" className="text-[10px]">PENDING</Badge>
                    )}
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
