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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Plus,
  Mail,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldCheck,
  Building2,
  Bus,
  Compass,
  BookOpen,
  Search,
  Loader2,
  Lock,
  UserCheck,
  UserX,
} from "lucide-react";
import { erpApi } from "@/lib/api";

const ACCESS_ROLES = [
  { id: "TEACHER", label: "Teacher", icon: BookOpen },
  { id: "DRIVER", label: "Driver", icon: Bus },
  { id: "TRANSPORT_MANAGER", label: "Transport Manager", icon: Compass },
  { id: "SCHOOL_ADMIN", label: "School Administrator", icon: Building2 },
  { id: "PRINCIPAL", label: "Principal", icon: ShieldCheck },
  { id: "SUPER_ADMIN", label: "Super Admin", icon: ShieldCheck },
];

export default function PlatformAccessPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [schools, setSchools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState("ALL");
  const [notification, setNotification] = React.useState<string | null>(null);

  // Modal State
  const [isSetupOpen, setIsSetupOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "Access@123",
    role: "TEACHER",
    schoolId: "",
  });

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [uData, sData] = await Promise.all([
        erpApi.getPlatformUsers().catch(() => []),
        erpApi.getSchools().catch(() => []),
      ]);
      setUsers(Array.isArray(uData) ? uData : []);
      const schoolsList = Array.isArray(sData) ? sData : (sData?.schools || []);
      setSchools(schoolsList);
      if (schoolsList.length > 0 && !form.schoolId) {
        setForm((prev) => ({ ...prev, schoolId: schoolsList[0].id }));
      }
    } catch (err) {
      console.error("Failed to load platform users:", err);
    } finally {
      setLoading(false);
    }
  }, [form.schoolId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSetupAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await erpApi.setupUserAccess(form);
      showToast(`Access credentials successfully provisioned for ${form.name} (${form.role}).`);
      setIsSetupOpen(false);
      setForm({
        name: "",
        email: "",
        password: "Access@123",
        role: "TEACHER",
        schoolId: schools[0]?.id || "",
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to provision user access");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const nextStatus = !user.isActive;
      await erpApi.toggleUserStatus(user.id, nextStatus);
      showToast(`Account for ${user.name} is now ${nextStatus ? "ACTIVE" : "SUSPENDED"}.`);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.school?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Access Setup & Identity Provisioning
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            SUPER ADMIN FLOW: CONFIGURE CREDENTIALS FOR TEACHERS, DRIVERS, TRANSPORT MANAGERS & ADMINISTRATORS
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsSetupOpen(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
        >
          <KeyRound className="h-3.5 w-3.5 mr-1.5" />
          Setup Access & Credentials
        </Button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-mono shadow-xs animate-in fade-in">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">TOTAL IDENTITIES</span>
              <Users className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">TEACHERS</span>
              <BookOpen className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">
              {users.filter((u) => u.role === "TEACHER").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">DRIVERS</span>
              <Bus className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">
              {users.filter((u) => u.role === "DRIVER").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">TRANSPORT MGRS</span>
              <Compass className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">
              {users.filter((u) => u.role === "TRANSPORT_MANAGER").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-zinc-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <Input
            placeholder="Search by name, email, or campus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs bg-zinc-50 border-zinc-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-500 font-mono">Role:</span>
          <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
            <SelectTrigger className="text-xs w-52 bg-zinc-50 border-zinc-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles ({users.length})</SelectItem>
              {ACCESS_ROLES.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white border-zinc-200 shadow-2xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading identities...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-100 bg-zinc-50/50">
                  <TableHead className="text-xs font-mono text-zinc-500">USER IDENTITY</TableHead>
                  <TableHead className="text-xs font-mono text-zinc-500">SYSTEM ROLE</TableHead>
                  <TableHead className="text-xs font-mono text-zinc-500">AFFILIATED SCHOOL</TableHead>
                  <TableHead className="text-xs font-mono text-zinc-500">PROFILE LINK</TableHead>
                  <TableHead className="text-xs font-mono text-zinc-500">STATUS</TableHead>
                  <TableHead className="text-xs font-mono text-zinc-500 text-right">ACCESS ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-zinc-400">
                      No matching user credentials found. Click &quot;Setup Access & Credentials&quot; to provision an account.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-zinc-100 text-xs hover:bg-zinc-50/60">
                      <TableCell>
                        <div className="font-semibold text-zinc-950">{user.name}</div>
                        <div className="text-[11px] font-mono text-zinc-500">{user.email}</div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="subtle" className="text-[10px] font-mono">
                          {user.role}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-zinc-700">
                        {user.school?.name ? (
                          <div>
                            <div className="font-medium text-zinc-900">{user.school.name}</div>
                            <span className="text-[10px] font-mono text-zinc-400">{user.school.code}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 font-mono text-[10px]">Global Platform</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {user.staffProfile ? (
                          <span className="text-[11px] font-mono text-zinc-600">
                            Faculty: {user.staffProfile.employeeCode}
                          </span>
                        ) : user.driverProfile ? (
                          <span className="text-[11px] font-mono text-zinc-600">
                            Driver: {user.driverProfile.licenseNumber}
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-[10px] font-mono italic">Independent</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={user.isActive ? "contrast" : "outline"}
                          className={`text-[10px] font-mono ${
                            !user.isActive && "text-red-700 border-red-200 bg-red-50"
                          }`}
                        >
                          {user.isActive ? "ACTIVE" : "SUSPENDED"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(user)}
                          className={`h-7 px-2 text-[11px] font-mono ${
                            user.isActive
                              ? "hover:bg-red-50 hover:text-red-600 border-zinc-200"
                              : "hover:bg-emerald-50 hover:text-emerald-700 border-zinc-200"
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="h-3 w-3 mr-1 text-red-500" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 mr-1 text-emerald-600" />
                              Activate
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DIALOG: SETUP ACCESS & PROVISION CREDENTIALS */}
      <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form onSubmit={handleSetupAccess}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Setup Access & Provision Account
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Grant login privileges and configure credentials for teachers, drivers, and transport managers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Affiliated Institution *</Label>
                <Select
                  value={form.schoolId}
                  onValueChange={(val) => setForm({ ...form, schoolId: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">System Role Tier *</Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => setForm({ ...form, role: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_ROLES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Login Email *</Label>
                <Input
                  required
                  type="email"
                  placeholder="ramesh.driver@greenwoodhigh.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Initial Password *</Label>
                <Input
                  required
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <span className="text-[10px] text-zinc-400 font-mono">
                  Default: Access@123. The user can change this after signing in.
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSetupOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Provisioning..." : "Provision Access"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
