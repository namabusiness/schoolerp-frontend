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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt, Plus, DollarSign, Download, CheckCircle2, AlertCircle } from "lucide-react";

const INITIAL_INVOICES = [
  {
    id: "inv-1",
    invoiceNo: "INV-2026-001",
    studentName: "Alexander Chen",
    class: "Grade 10 - Section A",
    title: "Term 1 Tuition & Laboratory Fee",
    totalAmount: 1850,
    paidAmount: 1850,
    balance: 0,
    dueDate: "2026-09-30",
    status: "PAID",
    receiptNo: "RCP-2026-001",
  },
  {
    id: "inv-2",
    invoiceNo: "INV-2026-002",
    studentName: "Emma Watson",
    class: "Grade 10 - Section A",
    title: "Term 1 Tuition & Transport Fee",
    totalAmount: 2200,
    paidAmount: 1100,
    balance: 1100,
    dueDate: "2026-09-30",
    status: "PARTIAL",
    receiptNo: "RCP-2026-002",
  },
  {
    id: "inv-3",
    invoiceNo: "INV-2026-003",
    studentName: "Liam Smith",
    class: "Grade 10 - Section A",
    title: "Term 1 Tuition Fee",
    totalAmount: 1600,
    paidAmount: 0,
    balance: 1600,
    dueDate: "2026-09-15",
    status: "OVERDUE",
    receiptNo: null,
  },
  {
    id: "inv-4",
    invoiceNo: "INV-2026-004",
    studentName: "Olivia Taylor",
    class: "Grade 10 - Section A",
    title: "Term 1 Tuition & Sports Fee",
    totalAmount: 1750,
    paidAmount: 1750,
    balance: 0,
    dueDate: "2026-09-30",
    status: "PAID",
    receiptNo: "RCP-2026-003",
  },
];

export default function FeesFinancePage() {
  const [invoices, setInvoices] = React.useState(INITIAL_INVOICES);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = React.useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState(0);
  const [paymentMode, setPaymentMode] = React.useState("ONLINE");
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  const totalDemand = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balance, 0);

  const handleCollectPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPay) return;

    const receiptNo = `RCP-${Date.now().toString().slice(-6)}`;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === selectedInvoiceForPay.id) {
          const newPaid = inv.paidAmount + Number(paymentAmount);
          const newBalance = Math.max(0, inv.totalAmount - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            balance: newBalance,
            status: newBalance === 0 ? "PAID" : "PARTIAL",
            receiptNo,
          };
        }
        return inv;
      })
    );

    setSelectedInvoiceForPay(null);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fees & Finance Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #15: FEE HEADS → INVOICE GENERATION → PAYMENT RECORDING → RECEIPTS & LEDGER
          </p>
        </div>

        {paymentSuccess && (
          <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" /> Payment Recorded & Official Receipt Generated
          </Badge>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Fee Demand (Term 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">${totalDemand.toLocaleString()}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Total invoiced institutional tuition & heads</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">${totalCollected.toLocaleString()}</div>
            <p className="text-[11px] text-zinc-500 mt-1">
              {Math.round((totalCollected / totalDemand) * 100)}% collected into school account
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-zinc-400 uppercase">Total Outstanding Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">${totalOutstanding.toLocaleString()}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Automated payment reminders active</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-white">Student Fee Invoices & Demands</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Active ledger of student billing and receipts
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => alert("Batch generating Term 2 fee demands for all active students...")}
            className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Generate Term Demand
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Invoice No</TableHead>
                <TableHead>Student Name & Class</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Demanded</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                  <TableCell className="text-white">{inv.invoiceNo}</TableCell>
                  <TableCell className="font-sans">
                    <div className="font-medium text-white">{inv.studentName}</div>
                    <div className="text-[10px] text-zinc-500">{inv.class}</div>
                  </TableCell>
                  <TableCell className="font-sans text-zinc-300">{inv.title}</TableCell>
                  <TableCell className="text-zinc-300">${inv.totalAmount}</TableCell>
                  <TableCell className="text-white font-bold">${inv.paidAmount}</TableCell>
                  <TableCell className="text-zinc-300">${inv.balance}</TableCell>
                  <TableCell className="text-zinc-400 text-[11px]">{inv.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inv.status === "PAID"
                          ? "contrast"
                          : inv.status === "PARTIAL"
                          ? "subtle"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {inv.balance > 0 ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedInvoiceForPay(inv);
                          setPaymentAmount(inv.balance);
                        }}
                        className="h-7 text-xs bg-white text-black hover:bg-zinc-200 font-semibold font-sans"
                      >
                        Record Payment
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Official Receipt ${inv.receiptNo} verified. Ready for print.`)}
                        className="h-7 text-xs border-zinc-700 hover:bg-zinc-800 font-sans"
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Processing Modal */}
      {selectedInvoiceForPay && (
        <Dialog open={Boolean(selectedInvoiceForPay)} onOpenChange={() => setSelectedInvoiceForPay(null)}>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Record Fee Collection & Issue Receipt</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Invoice {selectedInvoiceForPay.invoiceNo} for {selectedInvoiceForPay.studentName}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCollectPayment} className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 flex justify-between items-center font-mono">
                <span className="text-zinc-400">Outstanding Balance:</span>
                <span className="text-base font-bold text-white">${selectedInvoiceForPay.balance}</span>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Amount Being Paid ($)</Label>
                <Input
                  type="number"
                  max={selectedInvoiceForPay.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  required
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-base"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Payment Gateway / Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="ONLINE">Online Portal / Credit Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Direct Wire / NEFT Transfer</SelectItem>
                    <SelectItem value="CASH">Cash Office Collection</SelectItem>
                    <SelectItem value="CHEQUE">Banker's Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedInvoiceForPay(null)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200 font-semibold">
                  Generate Receipt & Update Ledger
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
