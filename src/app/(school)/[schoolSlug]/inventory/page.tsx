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
import { Boxes, Plus, CheckCircle2, Wrench } from "lucide-react";

const INITIAL_ASSETS = [
  { id: "ast-1", code: "AST-STEM-01", name: "Dell 4K Interactive Smartboard", category: "Electronics", allocatedTo: "Room 101 (Grade 10)", status: "ACTIVE" },
  { id: "ast-2", code: "AST-STEM-02", name: "Olympus Binocular Compound Microscope", category: "Lab Equipment", allocatedTo: "Biology Lab 3", status: "ACTIVE" },
  { id: "ast-3", code: "AST-IT-01", name: "Cisco Catalyst 48-Port Switch", category: "Network IT", allocatedTo: "Server Room B", status: "ACTIVE" },
  { id: "ast-4", code: "AST-FURN-01", name: "Ergonomic Chemistry Lab Workbenches (Set of 10)", category: "Furniture", allocatedTo: "Chemistry Lab 1", status: "ACTIVE" },
];

const PURCHASE_REQUESTS = [
  { id: "pr-1", reqNo: "PR-2026-044", item: "30x Vernier Calipers & Micrometer Screws", requestedBy: "Dr. Catherine Brooks", department: "Academics (Physics)", cost: 1250, status: "APPROVED" },
  { id: "pr-2", reqNo: "PR-2026-045", item: "Replacement Heavy Duty Brake Discs for Bus 01", requestedBy: "Robert Martinez", department: "Transportation", cost: 680, status: "PURCHASED" },
  { id: "pr-3", reqNo: "PR-2026-046", item: "15x Replacement Ethernet Patch Cables & RJ45 Connectors", requestedBy: "IT Administrator", department: "IT Infrastructure", cost: 150, status: "PENDING" },
];

export default function InventoryPage() {
  const [assets, setAssets] = React.useState(INITIAL_ASSETS);
  const [requests, setRequests] = React.useState(PURCHASE_REQUESTS);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // New asset state
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Electronics");
  const [allocatedTo, setAllocatedTo] = React.useState("Room 102");

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `ast-${Date.now()}`,
      code: `AST-${category.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name,
      category,
      allocatedTo,
      status: "ACTIVE",
    };
    setAssets([created, ...assets]);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Inventory & Asset Register Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #20: PURCHASE REQUESTS, APPROVALS, ASSET REGISTER & DEPARTMENT ALLOCATION
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Register New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Register Institutional Asset</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Asset will be barcoded and mapped to department or classroom.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAsset} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Asset Title</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-zinc-300">Allocated To (Room/Dept)</Label>
                  <Input value={allocatedTo} onChange={(e) => setAllocatedTo(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200">
                  Register Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="assets" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Boxes className="h-3.5 w-3.5 mr-1.5" /> Institutional Asset Register ({assets.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
            <Wrench className="h-3.5 w-3.5 mr-1.5" /> Purchase & Procurement Requests ({requests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Allocated Location / Staff</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((ast) => (
                    <TableRow key={ast.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs">
                      <TableCell className="font-mono text-white font-semibold">{ast.code}</TableCell>
                      <TableCell className="font-medium text-white">{ast.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-700">{ast.category}</Badge>
                      </TableCell>
                      <TableCell className="text-zinc-300">{ast.allocatedTo}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="contrast" className="text-[10px]">{ast.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4 pt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead>Request No</TableHead>
                    <TableHead>Item Requested</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead className="text-right">Approval Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((pr) => (
                    <TableRow key={pr.id} className="border-zinc-800/60 hover:bg-zinc-900/40 text-xs font-mono">
                      <TableCell className="text-white">{pr.reqNo}</TableCell>
                      <TableCell className="font-sans font-medium text-white">{pr.item}</TableCell>
                      <TableCell className="font-sans text-zinc-400">{pr.department}</TableCell>
                      <TableCell className="text-white font-bold">${pr.cost.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={pr.status === "PURCHASED" ? "contrast" : pr.status === "APPROVED" ? "subtle" : "outline"} className="text-[10px]">
                          {pr.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
