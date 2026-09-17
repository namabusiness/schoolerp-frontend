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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Search, ShieldCheck, Eye, Terminal } from "lucide-react";
import { erpApi } from "@/lib/api";

const DEMO_AUDIT_LOGS = [
  {
    id: "log-101",
    timestamp: "2026-09-16 20:45:12",
    userEmail: "admin@greenwoodhigh.edu",
    schoolName: "Greenwood High International",
    module: "FEES",
    action: "POST /api/fees/payments",
    recordId: "rcp-2026-001",
    ipAddress: "192.168.1.45",
    device: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    previousValue: JSON.stringify({ invoiceStatus: "PENDING", paidAmount: 0 }),
    newValue: JSON.stringify({ invoiceStatus: "PAID", paidAmount: 1850, receiptNo: "RCP-2026-001" }),
  },
  {
    id: "log-102",
    timestamp: "2026-09-16 19:30:05",
    userEmail: "superadmin@schoolerp.com",
    schoolName: "Oakridge STEM Academy",
    module: "SUPPORT_ACCESS",
    action: "PRIVILEGED_SUPPORT_SESSION_STARTED",
    recordId: "sess-991",
    ipAddress: "10.0.0.1",
    device: "Chrome 128 / macOS",
    previousValue: null,
    newValue: JSON.stringify({ reason: "Fixed fee invoice rounding discrepancy on Term 1 demand" }),
  },
  {
    id: "log-103",
    timestamp: "2026-09-16 18:15:40",
    userEmail: "m.sterling@greenwoodhigh.edu",
    schoolName: "Greenwood High International",
    module: "ATTENDANCE",
    action: "POST /api/attendance/submit",
    recordId: "att-sess-2026-09-16",
    ipAddress: "192.168.1.88",
    device: "Safari Mobile / iOS 17",
    previousValue: JSON.stringify({ isLocked: false, recordsCount: 35 }),
    newValue: JSON.stringify({ isLocked: true, presentCount: 34, absentCount: 1 }),
  },
  {
    id: "log-104",
    timestamp: "2026-09-16 16:20:19",
    userEmail: "admin@greenwoodhigh.edu",
    schoolName: "Greenwood High International",
    module: "ADMISSIONS",
    action: "POST /api/admissions/applications/app-101/decision",
    recordId: "app-101",
    ipAddress: "192.168.1.45",
    device: "Chrome / Windows 11",
    previousValue: JSON.stringify({ status: "SUBMITTED" }),
    newValue: JSON.stringify({ status: "ENROLLED", admissionNumber: "ADM-2026-1001" }),
  },
  {
    id: "log-105",
    timestamp: "2026-09-16 14:02:55",
    userEmail: "superadmin@schoolerp.com",
    schoolName: "St. Xavier Collegiate",
    module: "SCHOOLS",
    action: "PATCH /api/super-admin/schools/school-st-xaviers/status",
    recordId: "school-st-xaviers",
    ipAddress: "10.0.0.1",
    device: "Platform Console",
    previousValue: JSON.stringify({ status: "PENDING_VERIFICATION" }),
    newValue: JSON.stringify({ status: "TRIAL" }),
  },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState(DEMO_AUDIT_LOGS);
  const [search, setSearch] = React.useState("");
  const [selectedLog, setSelectedLog] = React.useState<any | null>(null);

  const filteredLogs = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.userEmail.toLowerCase().includes(q) ||
      l.schoolName.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Audit Log Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #7: USER, SCHOOL, MODULE, ACTION, RECORD ID, TIMESTAMP, IP/DEVICE & PAYLOAD SNAPSHOTS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="contrast" className="text-xs font-mono py-1 px-3">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> IMMUTABLE SECURITY LOG
          </Badge>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by user email, school, module, action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-950 border-zinc-800 pl-9 text-xs text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Identity</TableHead>
                <TableHead>School Tenant</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action / Route</TableHead>
                <TableHead>IP / Network</TableHead>
                <TableHead className="text-right">Inspection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-zinc-800/60 hover:bg-zinc-900/40 font-mono text-xs">
                  <TableCell className="text-zinc-400 text-[11px] whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell className="text-white font-sans font-medium text-xs">{log.userEmail}</TableCell>
                  <TableCell className="text-zinc-300 font-sans text-xs">{log.schoolName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-zinc-700">
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300 text-[11px] truncate max-w-[220px]">{log.action}</TableCell>
                  <TableCell className="text-zinc-500 text-[11px]">{log.ipAddress}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="h-7 text-xs text-zinc-300 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View Diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <Dialog open={Boolean(selectedLog)} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white font-mono text-xs">
            <DialogHeader>
              <DialogTitle className="text-sm text-white flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Audit Snapshot: {selectedLog.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 font-sans">
                Immutable audit transaction recorded at {selectedLog.timestamp}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded bg-zinc-900/60 border border-zinc-800">
                <div><span className="text-zinc-500">User:</span> {selectedLog.userEmail}</div>
                <div><span className="text-zinc-500">School:</span> {selectedLog.schoolName}</div>
                <div><span className="text-zinc-500">Action:</span> {selectedLog.action}</div>
                <div><span className="text-zinc-500">Device:</span> {selectedLog.device}</div>
              </div>

              <div>
                <div className="text-[11px] text-zinc-400 mb-1 font-semibold">Previous Value (Before Execution):</div>
                <pre className="p-3 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 overflow-x-auto">
                  {selectedLog.previousValue ? JSON.stringify(JSON.parse(selectedLog.previousValue), null, 2) : "None (New Record Created)"}
                </pre>
              </div>

              <div>
                <div className="text-[11px] text-zinc-400 mb-1 font-semibold">New Value (After Execution):</div>
                <pre className="p-3 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 overflow-x-auto">
                  {selectedLog.newValue ? JSON.stringify(JSON.parse(selectedLog.newValue), null, 2) : "None (Record Purged)"}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
