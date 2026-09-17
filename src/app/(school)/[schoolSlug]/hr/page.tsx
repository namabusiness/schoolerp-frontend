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
import { Briefcase, Plus, CheckCircle2, Clock, DollarSign, Download, Users } from "lucide-react";

const DEMO_STAFF = [
  { id: "stf-1", code: "EMP-1001", name: "Prof. Marcus Sterling", dept: "Academics", designation: "Head of Mathematics", salary: 5800, status: "ACTIVE" },
  { id: "stf-2", code: "EMP-1002", name: "Dr. Catherine Brooks", dept: "Academics", designation: "Physics Department Lead", salary: 5600, status: "ACTIVE" },
  { id: "stf-3", code: "EMP-1003", name: "Sarah Jenkins", dept: "Accounts", designation: "Finance Controller", salary: 5200, status: "ACTIVE" },
  { id: "stf-4", code: "EMP-1004", name: "Robert Martinez", dept: "Transportation", designation: "Fleet Chief Driver", salary: 3400, status: "ACTIVE" },
];

const DEMO_LEAVES = [
  { id: "lv-1", staffName: "Dr. Ronald Hayes", type: "Sick Leave", dates: "2026-09-16 to 2026-09-17", reason: "Viral fever", status: "APPROVED" },
  { id: "lv-2", staffName: "Emily Watson", type: "Casual Leave", dates: "2026-09-16", reason: "Attending pedagogical workshop", status: "APPROVED" },
  { id: "lv-3", staffName: "David Kim", type: "Annual Leave", dates: "2026-09-24 to 2026-09-28", reason: "Family vacation", status: "PENDING" },
];

export default function StaffHrPage() {
  const [payrollRan, setPayrollRan] = React.useState(false);
  const [selectedPayslip, setSelectedPayslip] = React.useState<any | null>(null);

  const handleRunPayroll = () => {
    setPayrollRan(true);
    setTimeout(() => setPayrollRan(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Staff & HR Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #19: EMPLOYEE DIRECTORY, DEPARTMENTS, LEAVE APPROVALS & PAYROLL PAYSLIPS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {payrollRan && (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
              <CheckCircle2 className="h-3.5 w-3.5" /> Payroll Run for September 2026 Processed
            </Badge>
          )}
          <Button
            size="sm"
            onClick={handleRunPayroll}
            className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
          >
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            Run Monthly Payroll
          </Button>
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="directory" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Users className="h-3.5 w-3.5 mr-1.5" /> Faculty & Staff Directory ({DEMO_STAFF.length})
          </TabsTrigger>
          <TabsTrigger value="leaves" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> Leave Management ({DEMO_LEAVES.length})
          </TabsTrigger>
          <TabsTrigger value="payroll" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <DollarSign className="h-3.5 w-3.5 mr-1.5" /> Payroll & Digital Payslips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Employee Code</TableHead>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_STAFF.map((stf) => (
                    <TableRow key={stf.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell className="font-mono text-zinc-400">{stf.code}</TableCell>
                      <TableCell className="font-medium text-white">{stf.name}</TableCell>
                      <TableCell>{stf.dept}</TableCell>
                      <TableCell className="text-zinc-300">{stf.designation}</TableCell>
                      <TableCell className="font-mono text-white">${stf.salary.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="contrast" className="text-[10px]">{stf.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Period Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_LEAVES.map((lv) => (
                    <TableRow key={lv.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell className="font-medium text-white">{lv.staffName}</TableCell>
                      <TableCell>{lv.type}</TableCell>
                      <TableCell className="font-mono text-zinc-300">{lv.dates}</TableCell>
                      <TableCell className="text-zinc-400">{lv.reason}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={lv.status === "APPROVED" ? "contrast" : "outline"} className="text-[10px]">
                          {lv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Pay</TableHead>
                    <TableHead>Allowances (+15%)</TableHead>
                    <TableHead>Deductions (-5%)</TableHead>
                    <TableHead>Net Disbursed</TableHead>
                    <TableHead className="text-right">Digital Payslip</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_STAFF.map((stf) => {
                    const allow = Math.round(stf.salary * 0.15);
                    const ded = Math.round(stf.salary * 0.05);
                    const net = stf.salary + allow - ded;
                    return (
                      <TableRow key={stf.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                        <TableCell className="font-sans font-medium text-white">{stf.name}</TableCell>
                        <TableCell className="text-zinc-400">${stf.salary.toLocaleString()}</TableCell>
                        <TableCell className="text-zinc-400">+${allow}</TableCell>
                        <TableCell className="text-zinc-400">-${ded}</TableCell>
                        <TableCell className="text-white font-bold">${net.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-sans">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayslip({ ...stf, allow, ded, net })}
                            className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                          >
                            <Download className="h-3 w-3 mr-1" /> View Payslip
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Printable Payslip Modal */}
      {selectedPayslip && (
        <Dialog open={Boolean(selectedPayslip)} onOpenChange={() => setSelectedPayslip(null)}>
          <DialogContent className="max-w-md bg-white text-black border-zinc-300">
            <DialogHeader className="border-b border-zinc-200 pb-3 text-center sm:text-center">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Official Monthly Salary Slip</div>
              <DialogTitle className="text-base font-bold text-black uppercase">Greenwood High International</DialogTitle>
              <div className="text-[11px] text-zinc-600 font-mono">Pay Period: September 2026 • Code: {selectedPayslip.code}</div>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 border border-zinc-200 p-2.5 bg-zinc-50">
                <div><strong>Employee:</strong> {selectedPayslip.name}</div>
                <div><strong>Department:</strong> {selectedPayslip.dept}</div>
                <div><strong>Designation:</strong> {selectedPayslip.designation}</div>
                <div><strong>Payment Date:</strong> 2026-09-16</div>
              </div>

              <div className="border border-zinc-200 divide-y divide-zinc-200 font-mono">
                <div className="p-2 flex justify-between">
                  <span>Basic Salary:</span>
                  <span>${selectedPayslip.salary.toLocaleString()}.00</span>
                </div>
                <div className="p-2 flex justify-between">
                  <span>Standard Allowances (15%):</span>
                  <span>+${selectedPayslip.allow}.00</span>
                </div>
                <div className="p-2 flex justify-between">
                  <span>Statutory Deductions (5%):</span>
                  <span>-${selectedPayslip.ded}.00</span>
                </div>
                <div className="p-2 flex justify-between font-bold text-sm bg-zinc-100">
                  <span>Net Salary Payable:</span>
                  <span>${selectedPayslip.net.toLocaleString()}.00</span>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-3">
              <Button size="sm" onClick={() => window.print()} className="bg-black text-white hover:bg-zinc-800 text-xs w-full">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Print Payslip
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
