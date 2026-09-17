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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Users, Plus, Mail, CheckCircle2, Clock } from "lucide-react";

const ADMIN_ROLES = [
  "Principal",
  "School Administrator",
  "Academic Administrator",
  "Finance Administrator",
  "HR Administrator",
  "Transport Administrator",
  "Custom Administrator",
];

const INITIAL_ADMINS = [
  {
    id: "adm-1",
    name: "Dr. Eleanor Vance",
    email: "admin@greenwoodhigh.edu",
    role: "School Administrator",
    schoolName: "Greenwood High International",
    status: "ACTIVE",
    invitationAccepted: true,
  },
  {
    id: "adm-2",
    name: "Prof. Arthur Pendelton",
    email: "principal@greenwoodhigh.edu",
    role: "Principal",
    schoolName: "Greenwood High International",
    status: "ACTIVE",
    invitationAccepted: true,
  },
  {
    id: "adm-3",
    name: "Sarah Jenkins",
    email: "finance@greenwoodhigh.edu",
    role: "Finance Administrator",
    schoolName: "Greenwood High International",
    status: "ACTIVE",
    invitationAccepted: true,
  },
  {
    id: "adm-4",
    name: "David Kim",
    email: "transport@greenwoodhigh.edu",
    role: "Transport Administrator",
    schoolName: "Greenwood High International",
    status: "INVITED",
    invitationAccepted: false,
  },
  {
    id: "adm-5",
    name: "Robert Sterling",
    email: "principal@oakridge.edu",
    role: "Principal",
    schoolName: "Oakridge STEM Academy",
    status: "ACTIVE",
    invitationAccepted: true,
  },
];

export default function SchoolAdministratorsPage() {
  const [admins, setAdmins] = React.useState(INITIAL_ADMINS);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState(ADMIN_ROLES[0]);
  const [schoolName, setSchoolName] = React.useState("Greenwood High International");

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin = {
      id: `adm-${Date.now()}`,
      name,
      email,
      role,
      schoolName,
      status: "INVITED",
      invitationAccepted: false,
    };
    setAdmins([newAdmin, ...admins]);
    setIsAddOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">School Administrator Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #3: PRINCIPALS, ACADEMIC, FINANCE, HR, TRANSPORT & CUSTOM ADMINS
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Administrator
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Add School Administrator</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Allocate designated operational authority to school leaders and staff.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAdmin} className="space-y-3 py-2">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Target Institution</Label>
                <Select value={schoolName} onValueChange={setSchoolName}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="Greenwood High International">Greenwood High International</SelectItem>
                    <SelectItem value="Oakridge STEM Academy">Oakridge STEM Academy</SelectItem>
                    <SelectItem value="St. Xavier Collegiate">St. Xavier Collegiate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Administrative Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    {ADMIN_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Full Name</Label>
                <Input
                  placeholder="e.g. Dr. Catherine Brooks"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Official Email</Label>
                <Input
                  type="email"
                  placeholder="c.brooks@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-xs text-white"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Send Invitation
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
                <TableHead>Administrator</TableHead>
                <TableHead>Role Title</TableHead>
                <TableHead>School Tenant</TableHead>
                <TableHead>Invitation Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id} className="border-zinc-800/60 hover:bg-zinc-900/40">
                  <TableCell>
                    <div className="font-semibold text-white text-xs">{admin.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{admin.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-700">
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-300">{admin.schoolName}</TableCell>
                  <TableCell>
                    {admin.invitationAccepted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                        <Clock className="h-3.5 w-3.5" /> Pending Password Setup
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert(`Resent login invitation email to ${admin.email}`)}
                      className="h-7 text-xs text-zinc-400 hover:text-white"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Resend Invite
                    </Button>
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
