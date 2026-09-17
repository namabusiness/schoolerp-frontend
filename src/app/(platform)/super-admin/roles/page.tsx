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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Save, CheckCircle2, RotateCcw } from "lucide-react";

const MODULES = [
  "Admissions",
  "Academics",
  "Attendance",
  "Fees & Billing",
  "Examinations",
  "Transport",
  "Library",
  "Communication",
  "Staff / HR",
  "Inventory",
  "Events",
  "Health & Incidents",
  "Certificates",
  "Student Promotion",
];

const PERMISSIONS = [
  "View",
  "Create",
  "Edit",
  "Delete",
  "Approve",
  "Export",
  "Manage",
];

const ROLES_LIST = [
  "Principal",
  "School Administrator",
  "Academic Administrator",
  "Finance Administrator",
  "Teacher",
  "Staff Member",
  "Student",
  "Parent / Guardian",
];

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = React.useState("Principal");
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // Matrix: module -> permission -> boolean
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    MODULES.forEach((mod) => {
      initial[mod] = {};
      PERMISSIONS.forEach((perm) => {
        initial[mod][perm] = true; // Default Principal all true
      });
    });
    return initial;
  });

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    setSavedSuccess(false);

    // Apply realistic defaults per role
    const updated: Record<string, Record<string, boolean>> = {};
    MODULES.forEach((mod) => {
      updated[mod] = {};
      PERMISSIONS.forEach((perm) => {
        if (newRole === "Principal" || newRole === "School Administrator") {
          updated[mod][perm] = true;
        } else if (newRole === "Teacher") {
          const teacherPermittedMods = ["Academics", "Attendance", "Examinations", "Communication", "Events"];
          updated[mod][perm] = teacherPermittedMods.includes(mod) && ["View", "Create", "Edit", "Export"].includes(perm);
        } else if (newRole === "Finance Administrator") {
          updated[mod][perm] = (mod === "Fees & Billing" || mod === "Inventory") ? true : ["View"].includes(perm);
        } else if (newRole === "Student" || newRole === "Parent / Guardian") {
          updated[mod][perm] = ["View"].includes(perm);
        } else {
          updated[mod][perm] = ["View", "Create"].includes(perm);
        }
      });
    });
    setMatrix(updated);
  };

  const togglePermission = (mod: string, perm: string) => {
    setSavedSuccess(false);
    setMatrix((prev) => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [perm]: !prev[mod]?.[perm],
      },
    }));
  };

  const toggleAllForModule = (mod: string, enable: boolean) => {
    setSavedSuccess(false);
    setMatrix((prev) => {
      const newPerms: Record<string, boolean> = {};
      PERMISSIONS.forEach((p) => { newPerms[p] = enable; });
      return { ...prev, [mod]: newPerms };
    });
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Global User & Role Management</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #5: GRANULAR PERMISSION MATRIX (VIEW, CREATE, EDIT, DELETE, APPROVE, EXPORT, MANAGE)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-2.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Permissions Saved & Applied
            </Badge>
          )}
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Permission Matrix
          </Button>
        </div>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-sm font-semibold text-white">Role Selection & Scope</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Configure fine-grained module access rights for specific user groups across all schools.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <Label className="text-xs text-zinc-400">Active Role:</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-56 bg-zinc-950 border-zinc-800 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                {ROLES_LIST.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="w-48">ERP Flow Module</TableHead>
                {PERMISSIONS.map((perm) => (
                  <TableHead key={perm} className="text-center">
                    {perm}
                  </TableHead>
                ))}
                <TableHead className="text-right">Quick Toggle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map((mod) => (
                <TableRow key={mod} className="border-zinc-800/60 hover:bg-zinc-900/40">
                  <TableCell className="font-semibold text-white text-xs">{mod}</TableCell>
                  {PERMISSIONS.map((perm) => {
                    const isChecked = Boolean(matrix[mod]?.[perm]);
                    return (
                      <TableCell key={perm} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => togglePermission(mod, perm)}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAllForModule(mod, true)}
                      className="h-6 text-[10px] text-zinc-400 hover:text-white px-1.5"
                    >
                      All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAllForModule(mod, false)}
                      className="h-6 text-[10px] text-zinc-500 hover:text-white px-1.5"
                    >
                      None
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
