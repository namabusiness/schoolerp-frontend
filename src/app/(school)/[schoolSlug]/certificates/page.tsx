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
import { Award, Plus, Download, FileText, CheckCircle2 } from "lucide-react";

const DEMO_CERTIFICATES = [
  {
    id: "cert-1",
    certNo: "BON-2026-9812",
    studentName: "Alexander Chen",
    class: "Grade 10 - Section A",
    type: "BONAFIDE",
    issueDate: "2026-09-14",
    approvedBy: "Dr. Eleanor Vance (Principal)",
    status: "ISSUED",
  },
  {
    id: "cert-2",
    certNo: "STU-2026-4410",
    studentName: "Emma Watson",
    class: "Grade 10 - Section A",
    type: "STUDY_CERTIFICATE",
    issueDate: "2026-09-10",
    approvedBy: "Dr. Eleanor Vance (Principal)",
    status: "ISSUED",
  },
  {
    id: "cert-3",
    certNo: "TC-2026-1120",
    studentName: "Julian Ross",
    class: "Grade 9 - Section B",
    type: "TRANSFER_CERTIFICATE",
    issueDate: "2026-09-01",
    approvedBy: "School Management",
    status: "ISSUED",
  },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = React.useState(DEMO_CERTIFICATES);
  const [selectedCert, setSelectedCert] = React.useState<any | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false);

  // Form State
  const [studentName, setStudentName] = React.useState("Alexander Chen");
  const [certType, setCertType] = React.useState("BONAFIDE");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = certType.slice(0, 3).toUpperCase();
    const newCert = {
      id: `cert-${Date.now()}`,
      certNo: `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName,
      class: "Grade 10 - Section A",
      type: certType,
      issueDate: "2026-09-16",
      approvedBy: "Dr. Eleanor Vance (Principal)",
      status: "ISSUED",
    };
    setCertificates([newCert, ...certificates]);
    setIsGenerateOpen(false);
    setSelectedCert(newCert);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Document & Certificate Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #23: BONAFIDE, STUDY CERTIFICATES, CONDUCT & OFFICIAL TRANSFER CERTIFICATES (TC)
          </p>
        </div>

        <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Generate Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Generate Official Student Certificate</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Issues authenticated certificate with digital verification seal.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleGenerate} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Target Student</Label>
                <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Certificate Type</Label>
                <Select value={certType} onValueChange={setCertType}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="BONAFIDE">Bonafide Certificate</SelectItem>
                    <SelectItem value="STUDY_CERTIFICATE">Study & Attendance Certificate</SelectItem>
                    <SelectItem value="TRANSFER_CERTIFICATE">Official Transfer Certificate (TC)</SelectItem>
                    <SelectItem value="CONDUCT">Good Moral Conduct Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsGenerateOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200 font-semibold">
                  Generate & Digitally Sign
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
                <TableHead>Certificate No</TableHead>
                <TableHead>Student Name & Class</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                  <TableCell className="font-semibold text-white">{cert.certNo}</TableCell>
                  <TableCell className="font-sans">
                    <div className="font-medium text-white">{cert.studentName}</div>
                    <div className="text-[10px] text-zinc-500">{cert.class}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 font-mono">
                      {cert.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{cert.issueDate}</TableCell>
                  <TableCell className="font-sans text-zinc-300">{cert.approvedBy}</TableCell>
                  <TableCell>
                    <Badge variant="contrast" className="text-[10px]">{cert.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-sans">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                      className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View Certificate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Printable Certificate Modal (Monochrome Luxury Certificate) */}
      {selectedCert && (
        <Dialog open={Boolean(selectedCert)} onOpenChange={() => setSelectedCert(null)}>
          <DialogContent className="max-w-xl bg-white text-black border-4 border-double border-zinc-900 p-8 shadow-2xl">
            <div className="border border-zinc-300 p-6 space-y-4 text-center">
              <div className="space-y-1 border-b-2 border-zinc-900 pb-3">
                <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">Official Institution Document</div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-black">
                  Greenwood High International
                </h2>
                <p className="text-xs text-zinc-600 font-serif">42 Academic Boulevard, Metro West • Est. 1998</p>
              </div>

              <div className="py-2">
                <Badge variant="contrast" className="text-xs px-3 py-1 font-mono uppercase bg-black text-white">
                  {selectedCert.type.replace("_", " ")}
                </Badge>
              </div>

              <div className="text-xs leading-relaxed text-zinc-800 font-serif text-justify px-4">
                This is to certify that <strong>{selectedCert.studentName}</strong>, bearing Admission Number <strong>ADM-2026-1001</strong>, is a bonafide student of this institution currently enrolled in <strong>{selectedCert.class}</strong> for the Academic Year 2026-2027. To the best of our knowledge, their conduct and academic character have been exemplary.
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-300 pt-6 text-xs font-mono text-left">
                <div>
                  <div className="text-[10px] text-zinc-500">Document Serial:</div>
                  <div className="font-bold">{selectedCert.certNo}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Date of Issue: {selectedCert.issueDate}</div>
                </div>
                <div className="text-right">
                  <div className="h-8 flex items-end justify-end">
                    <span className="font-serif italic text-xs underline">Eleanor Vance, Ph.D.</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">Principal & Head of School</div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2 flex justify-end">
              <Button size="sm" onClick={() => window.print()} className="bg-black text-white hover:bg-zinc-800 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" />
                Print Certificate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
