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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bus,
  Plus,
  MapPin,
  Clock,
  Users,
  Play,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2,
  Phone,
  IdCard,
  Compass,
  ArrowRight,
  ShieldCheck,
  Navigation,
  GraduationCap,
  UserCheck,
  ShieldAlert,
  Lock,
  Unlock,
  UserX,
  UserPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { erpApi } from "@/lib/api";

export default function TransportPage() {
  const [activeTab, setActiveTab] = React.useState("routes");
  const [loading, setLoading] = React.useState(true);
  const [routes, setRoutes] = React.useState<any[]>([]);
  const [vehicles, setVehicles] = React.useState<any[]>([]);
  const [drivers, setDrivers] = React.useState<any[]>([]);
  const [trips, setTrips] = React.useState<any[]>([]);
  const [staffList, setStaffList] = React.useState<any[]>([]);
  const [studentsList, setStudentsList] = React.useState<any[]>([]);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Authenticated signed-in user state
  const [currentUser, setCurrentUser] = React.useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);
  const [userRole, setUserRole] = React.useState<string>("TRANSPORT_MANAGER");

  // Only Principal, Transport Manager, and School/Super Admin can add/assign students and incharge faculty
  const canManageAssignments = ["PRINCIPAL", "TRANSPORT_MANAGER", "SUPER_ADMIN", "SCHOOL_ADMIN"].includes(
    userRole
  );

  // Dialog States
  const [isAddDriverOpen, setIsAddDriverOpen] = React.useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = React.useState(false);
  const [isAddRouteOpen, setIsAddRouteOpen] = React.useState(false);
  const [isAddStopOpen, setIsAddStopOpen] = React.useState(false);
  const [selectedRouteForStop, setSelectedRouteForStop] = React.useState<any | null>(null);

  // Incharge Faculty & Student Assignment Dialog States
  const [isAssignInchargeOpen, setIsAssignInchargeOpen] = React.useState(false);
  const [selectedRouteForIncharge, setSelectedRouteForIncharge] = React.useState<any | null>(null);
  const [selectedInchargeStaffId, setSelectedInchargeStaffId] = React.useState<string>("NONE");

  const [isAssignStudentOpen, setIsAssignStudentOpen] = React.useState(false);
  const [selectedRouteForStudent, setSelectedRouteForStudent] = React.useState<any | null>(null);
  const [studentAssignForm, setStudentAssignForm] = React.useState({
    studentId: "",
    stopId: "",
  });

  const [expandedRosters, setExpandedRosters] = React.useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = React.useState(false);

  // Form States
  const [driverForm, setDriverForm] = React.useState({
    name: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    experienceYears: "5",
    status: "ACTIVE",
    address: "",
    emergencyContact: "",
  });

  const [vehicleForm, setVehicleForm] = React.useState({
    registrationNo: "",
    model: "",
    capacity: "40",
    vehicleType: "BUS",
    driverId: "",
    fuelType: "DIESEL",
    status: "ACTIVE",
  });

  const [routeForm, setRouteForm] = React.useState({
    name: "",
    code: "",
    startLocation: "",
    endLocation: "",
    vehicleId: "",
    driverId: "",
    inchargeStaffId: "",
  });

  const [stopForm, setStopForm] = React.useState({
    stopName: "",
    pickupTime: "07:30 AM",
    dropTime: "03:45 PM",
    landmark: "",
    fare: "0",
    stopOrder: "",
  });

  // Sync authenticated user and role on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      let parsedUser: any = null;
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        try {
          parsedUser = JSON.parse(storedUserStr);
        } catch (e) {
          // ignore
        }
      }
      const activeRole =
        parsedUser?.role ||
        localStorage.getItem("auth_role") ||
        localStorage.getItem("demo_role") ||
        "PRINCIPAL";
      setUserRole(activeRole);
      setCurrentUser(
        parsedUser || {
          name:
            activeRole === "PRINCIPAL"
              ? "Dr. Eleanor Vance"
              : activeRole === "TRANSPORT_MANAGER"
              ? "Vikram Patel"
              : "School Staff",
          email: `${activeRole.toLowerCase()}@greenwoodhigh.edu`,
          role: activeRole,
        }
      );
    }
  }, []);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [rData, vData, dData, tData, sData, stData] = await Promise.all([
        erpApi.getRoutes().catch(() => []),
        erpApi.getVehicles().catch(() => []),
        erpApi.getDrivers().catch(() => []),
        erpApi.getTrips().catch(() => []),
        erpApi.getStaff().catch(() => []),
        erpApi.getStudents().catch(() => ({ students: [] })),
      ]);
      setRoutes(Array.isArray(rData) ? rData : []);
      setVehicles(Array.isArray(vData) ? vData : []);
      setDrivers(Array.isArray(dData) ? dData : []);
      setTrips(Array.isArray(tData) ? tData : []);
      setStaffList(Array.isArray(sData) ? sData : []);
      const studentsArr = Array.isArray(stData) ? stData : (stData?.students || []);
      setStudentsList(studentsArr);
    } catch (err) {
      console.error("Failed to fetch transport data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleRoster = (routeId: string) => {
    setExpandedRosters((prev) => ({
      ...prev,
      [routeId]: prev[routeId] === undefined ? false : !prev[routeId],
    }));
  };

  // 3-Second Field Error Thrower State
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const errorTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showErrors = (errors: Record<string, string>) => {
    setFormErrors(errors);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = setTimeout(() => {
      setFormErrors({});
    }, 3000);
  };

  const clearFieldError = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Submit Handlers
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!driverForm.name.trim()) errs.driver_name = "Full name is required";
    if (!driverForm.phone.trim()) errs.driver_phone = "Contact phone number is required";
    if (!driverForm.licenseNumber.trim()) errs.driver_license = "Driving license number is required";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.createDriver(driverForm);
      showToast(`Driver ${driverForm.name} added successfully.`);
      setIsAddDriverOpen(false);
      setDriverForm({
        name: "",
        phone: "",
        licenseNumber: "",
        licenseExpiry: "",
        experienceYears: "5",
        status: "ACTIVE",
        address: "",
        emergencyContact: "",
      });
      await loadData();
    } catch (err: any) {
      showErrors({ driver_form: err.message || "Failed to add driver" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!vehicleForm.registrationNo.trim()) errs.veh_regNo = "Registration number is required";
    if (!vehicleForm.model.trim()) errs.veh_model = "Vehicle make / model is required";
    if (!vehicleForm.capacity || Number(vehicleForm.capacity) <= 0) errs.veh_capacity = "Valid seating capacity is required";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.createVehicle(vehicleForm);
      showToast(`Vehicle ${vehicleForm.registrationNo} registered to fleet.`);
      setIsAddVehicleOpen(false);
      setVehicleForm({
        registrationNo: "",
        model: "",
        capacity: "40",
        vehicleType: "BUS",
        driverId: "",
        fuelType: "DIESEL",
        status: "ACTIVE",
      });
      await loadData();
    } catch (err: any) {
      showErrors({ veh_form: err.message || "Failed to add vehicle" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!routeForm.name.trim()) errs.route_name = "Route name is required";
    if (!routeForm.startLocation.trim()) errs.route_start = "Start location is required";
    if (!routeForm.endLocation.trim()) errs.route_end = "Destination / End location is required";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.createRoute(routeForm);
      showToast(`Route ${routeForm.name} created successfully.`);
      setIsAddRouteOpen(false);
      setRouteForm({
        name: "",
        code: "",
        startLocation: "",
        endLocation: "",
        vehicleId: "",
        driverId: "",
        inchargeStaffId: "",
      });
      await loadData();
    } catch (err: any) {
      showErrors({ route_form: err.message || "Failed to create route" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteForStop) return;
    const errs: Record<string, string> = {};
    if (!stopForm.stopName.trim()) errs.stop_name = "Stop name is required";
    if (!stopForm.pickupTime.trim()) errs.stop_pickup = "Morning pickup time is required";
    if (!stopForm.dropTime.trim()) errs.stop_drop = "Afternoon drop time is required";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.addRouteStop(selectedRouteForStop.id, stopForm);
      showToast(`Stop "${stopForm.stopName}" added to ${selectedRouteForStop.name}.`);
      setIsAddStopOpen(false);
      setStopForm({
        stopName: "",
        pickupTime: "07:30 AM",
        dropTime: "03:45 PM",
        landmark: "",
        fare: "0",
        stopOrder: "",
      });
      await loadData();
    } catch (err: any) {
      showErrors({ stop_form: err.message || "Failed to add stop" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDriver = async (id: string, name: string) => {
    if (!confirm(`Delete driver "${name}"?`)) return;
    try {
      await erpApi.deleteDriver(id);
      showToast("Driver removed.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete driver");
    }
  };

  const handleDeleteVehicle = async (id: string, regNo: string) => {
    if (!confirm(`Delete vehicle "${regNo}"?`)) return;
    try {
      await erpApi.deleteVehicle(id);
      showToast("Vehicle removed from fleet.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete vehicle");
    }
  };

  const handleDeleteRoute = async (id: string, name: string) => {
    if (!confirm(`Delete route "${name}" and its stops?`)) return;
    try {
      await erpApi.deleteRoute(id);
      showToast("Route deleted.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete route");
    }
  };

  const handleDeleteStop = async (routeId: string, stopId: string, stopName: string) => {
    if (!confirm(`Delete stop "${stopName}"?`)) return;
    try {
      await erpApi.deleteRouteStop(routeId, stopId);
      showToast("Stop removed from route.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete stop");
    }
  };

  const handleUpdateIncharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteForIncharge) return;
    if (!canManageAssignments) {
      showErrors({ incharge_staff: "Permission Denied: Only Principal and Transport Manager can appoint route faculty incharge." });
      return;
    }
    if (!selectedInchargeStaffId || selectedInchargeStaffId === "NONE") {
      showErrors({ incharge_staff: "Please select a faculty member from the list." });
      return;
    }
    setSubmitting(true);
    try {
      await erpApi.updateRouteIncharge(selectedRouteForIncharge.id, selectedInchargeStaffId);
      showToast(`Faculty incharge updated for "${selectedRouteForIncharge.name}".`);
      setIsAssignInchargeOpen(false);
      await loadData();
    } catch (err: any) {
      showErrors({ incharge_staff: err.message || "Failed to update faculty incharge" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteForStudent) return;
    if (!canManageAssignments) {
      showErrors({ assign_student: "Permission Denied: Only Principal and Transport Manager can assign students to routes." });
      return;
    }
    const errs: Record<string, string> = {};
    if (!studentAssignForm.studentId) errs.assign_student = "Please choose a student to assign";
    if (!studentAssignForm.stopId) errs.assign_stop = "Please designate a boarding stop";

    if (Object.keys(errs).length > 0) {
      showErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await erpApi.assignStudent({
        studentId: studentAssignForm.studentId,
        routeId: selectedRouteForStudent.id,
        stopId: studentAssignForm.stopId,
      });
      showToast("Student assigned to route successfully.");
      setIsAssignStudentOpen(false);
      setStudentAssignForm({ studentId: "", stopId: "" });
      await loadData();
    } catch (err: any) {
      showErrors({ assign_student: err.message || "Failed to assign student" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassignStudent = async (studentId: string, studentName: string) => {
    if (!canManageAssignments) {
      showToast("Permission Denied: Only Principal and Transport Manager can unassign students.");
      return;
    }
    if (!confirm(`Unassign student "${studentName}" from this route?`)) return;
    try {
      await erpApi.unassignStudent(studentId);
      showToast(`Student "${studentName}" unassigned.`);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to unassign student");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Transport & Fleet Hub</h1>
            <Badge
              variant="outline"
              className={
                canManageAssignments
                  ? "border-emerald-300 text-emerald-800 bg-emerald-50 text-[11px] font-mono"
                  : "border-amber-300 text-amber-800 bg-amber-50 text-[11px] font-mono"
              }
            >
              {canManageAssignments ? "Assignment Authority: Full" : "Assignment: View Only"}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            MANAGEMENT SUITE: DRIVERS ROSTER, VEHICLE FLEET, ROUTES, STOPS & PASSENGER ALLOCATION
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Authenticated Signed-in User & Role */}
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span className="text-zinc-500 text-[11px]">SIGNED IN:</span>
            <span className="font-semibold text-zinc-900">{currentUser?.name || "Authenticated User"}</span>
            <span className="text-zinc-300">•</span>
            <Badge
              variant="outline"
              className={
                canManageAssignments
                  ? "border-emerald-300 text-emerald-800 bg-emerald-50 text-[10px] font-mono"
                  : "border-zinc-300 text-zinc-700 bg-white text-[10px] font-mono"
              }
            >
              {userRole.replace("_", " ")}
            </Badge>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddDriverOpen(true)}
            className="border-zinc-300 hover:bg-zinc-100 text-xs font-mono"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Driver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddVehicleOpen(true)}
            className="border-zinc-300 hover:bg-zinc-100 text-xs font-mono"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Vehicle
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddRouteOpen(true)}
            className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Route
          </Button>
        </div>
      </div>

      {/* Role Restriction Notice Banner */}
      {!canManageAssignments && (
        <div className="flex items-center gap-2.5 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 font-mono shadow-2xs">
          <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
          <div>
            <strong>ROLE RESTRICTION ACTIVE ({userRole}):</strong> In accordance with safety policies, student passenger assignments and faculty incharge appointments are strictly restricted to <strong>Principal</strong> and <strong>Transport Manager</strong> roles.
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-mono shadow-xs animate-in fade-in">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">ACTIVE ROUTES</span>
              <Compass className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">{routes.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">FLEET VEHICLES</span>
              <Bus className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">LICENSED DRIVERS</span>
              <Users className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">{drivers.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">TOTAL STOPS</span>
              <MapPin className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-1">
              {routes.reduce((acc, r) => acc + (r.stops?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-100 border border-zinc-200 p-1">
          <TabsTrigger
            value="routes"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Compass className="h-3.5 w-3.5 mr-1.5" />
            Routes & Stops ({routes.length})
          </TabsTrigger>
          <TabsTrigger
            value="vehicles"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Bus className="h-3.5 w-3.5 mr-1.5" />
            Vehicles Fleet ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger
            value="drivers"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Drivers Roster ({drivers.length})
          </TabsTrigger>
          <TabsTrigger
            value="trips"
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Trip Logs ({trips.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ROUTES & STOPS */}
        <TabsContent value="routes" className="space-y-4 pt-2">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading routes...
            </div>
          ) : routes.length === 0 ? (
            <Card className="bg-white border-zinc-200 p-8 text-center space-y-3">
              <Compass className="h-8 w-8 text-zinc-300 mx-auto" />
              <div className="text-sm font-semibold text-zinc-900">No transport routes configured</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Create routes to connect school buses with designated student pickup and drop stops.
              </p>
              <Button
                size="sm"
                onClick={() => setIsAddRouteOpen(true)}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add First Route
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {routes.map((route) => {
                const isRosterExpanded = expandedRosters[route.id] !== false;
                const studentCount = route.studentAssignments?.length || route._count?.studentAssignments || 0;
                const capacity = Number(route.vehicle?.capacity || 40);
                const occupancyPercent = Math.min(100, Math.round((studentCount / capacity) * 100));

                return (
                  <Card key={route.id} className="bg-white border-zinc-200 shadow-2xs overflow-hidden">
                    {/* Route Card Top Bar */}
                    <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/40">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-zinc-900 text-white shrink-0">
                            <Bus className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-zinc-950">{route.name}</span>
                              {route.code && (
                                <Badge variant="outline" className="text-[10px] font-mono border-zinc-300 bg-white">
                                  {route.code}
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={
                                  studentCount >= capacity
                                    ? "bg-red-50 text-red-700 border-red-200 text-[10px] font-mono"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-mono"
                                }
                              >
                                {studentCount} / {capacity} Seats ({occupancyPercent}%)
                              </Badge>
                            </div>
                            <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                              {route.startLocation && route.endLocation && (
                                <span className="flex items-center gap-1 font-medium text-zinc-700">
                                  <MapPin className="h-3 w-3 text-zinc-400" />
                                  {route.startLocation} → {route.endLocation}
                                </span>
                              )}
                              <span>
                                Bus: <strong className="text-zinc-800 font-mono">{route.vehicle?.registrationNo || "Unassigned"}</strong>
                                {route.vehicle?.model ? ` (${route.vehicle.model})` : ""}
                              </span>
                              <span>
                                Driver: <strong className="text-zinc-800">{route.driver?.name || route.driverName || "Unassigned"}</strong>
                                {(route.driver?.phone || route.driverPhone) ? ` (${route.driver?.phone || route.driverPhone})` : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {canManageAssignments && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRouteForStop(route);
                                setIsAddStopOpen(true);
                              }}
                              className="h-7 px-2.5 text-[11px] border-zinc-300 hover:bg-zinc-100 font-mono"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Stop
                            </Button>
                          )}
                          {canManageAssignments && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRoute(route.id, route.name)}
                              className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Route"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-4">
                      {/* 1. FACULTY INCHARGE SECTION */}
                      <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${route.inchargeStaff ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"}`}>
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
                                Faculty Incharge
                              </span>
                              {route.inchargeStaff ? (
                                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[9px] px-1.5 py-0">
                                  Assigned
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-zinc-500 border-zinc-300 text-[9px] px-1.5 py-0 bg-white">
                                  Not Assigned
                                </Badge>
                              )}
                            </div>
                            {route.inchargeStaff ? (
                              <div className="text-xs">
                                <span className="font-bold text-zinc-950 mr-2">{route.inchargeStaff.name}</span>
                                <span className="text-zinc-500 mr-2">• {route.inchargeStaff.designation || "Faculty"}</span>
                                {route.inchargeStaff.phone && (
                                  <span className="text-zinc-600 font-mono text-[11px] inline-flex items-center gap-1">
                                    <Phone className="h-2.5 w-2.5 text-zinc-400" />
                                    {route.inchargeStaff.phone}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-zinc-500 italic">
                                No faculty appointed for bus safety and passenger discipline.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {canManageAssignments ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRouteForIncharge(route);
                                  setSelectedInchargeStaffId(route.inchargeStaffId || "NONE");
                                  setIsAssignInchargeOpen(true);
                                }}
                                className="h-7 px-2.5 text-[11px] border-zinc-300 hover:bg-zinc-100 font-medium"
                              >
                                <UserCheck className="h-3 w-3 mr-1 text-zinc-700" />
                                {route.inchargeStaff ? "Change Incharge" : "Appoint Incharge"}
                              </Button>
                              {route.inchargeStaff && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={async () => {
                                    if (confirm(`Remove incharge faculty for "${route.name}"?`)) {
                                      await erpApi.updateRouteIncharge(route.id, null);
                                      showToast("Faculty incharge removed.");
                                      await loadData();
                                    }
                                  }}
                                  className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 text-[11px]"
                                  title="Remove Incharge"
                                >
                                  Remove
                                </Button>
                              )}
                            </>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-300 font-mono gap-1 bg-white">
                              <Lock className="h-2.5 w-2.5 text-amber-600" />
                              Principal / Transport Mgr Only
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* 2. STOPS SEQUENCE */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-600">
                          <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                            Stops Corridor Sequence ({route.stops?.length || 0}):
                          </span>
                        </div>

                        {(!route.stops || route.stops.length === 0) ? (
                          <div className="p-3 bg-zinc-50 rounded-lg border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
                            No stops added yet. Click &quot;Add Stop&quot; to configure route pickup points.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {route.stops.map((stop: any, idx: number) => (
                              <div
                                key={stop.id}
                                className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 flex items-start justify-between gap-2 text-xs"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                                    <span className="h-4 w-4 rounded-full bg-zinc-200 text-zinc-700 text-[10px] flex items-center justify-center shrink-0 font-mono">
                                      {stop.stopOrder || idx + 1}
                                    </span>
                                    <span className="truncate">{stop.stopName}</span>
                                  </div>
                                  <div className="text-[11px] font-mono text-zinc-500 pl-5">
                                    Pick: {stop.pickupTime} • Drop: {stop.dropTime}
                                  </div>
                                  {stop.landmark && (
                                    <div className="text-[10px] text-zinc-400 pl-5 truncate">
                                      Near: {stop.landmark}
                                    </div>
                                  )}
                                </div>

                                {canManageAssignments && (
                                  <button
                                    onClick={() => handleDeleteStop(route.id, stop.id, stop.stopName)}
                                    className="text-zinc-300 hover:text-red-600 p-1 shrink-0 transition-colors"
                                    title="Delete Stop"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 3. STUDENT PASSENGER ROSTER */}
                      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
                        <div className="px-3.5 py-2.5 bg-zinc-100/70 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRoster(route.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-zinc-950 hover:text-zinc-700"
                            >
                              {isRosterExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5 text-zinc-500" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                              )}
                              Student Passenger Roster ({route.studentAssignments?.length || 0})
                            </button>
                            <span className="text-[11px] font-mono text-zinc-500">
                              • {capacity - studentCount} seats available
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {canManageAssignments ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRouteForStudent(route);
                                  setStudentAssignForm({
                                    studentId: "",
                                    stopId: route.stops?.[0]?.id || "",
                                  });
                                  setIsAssignStudentOpen(true);
                                }}
                                disabled={!route.stops || route.stops.length === 0}
                                className="h-7 px-2.5 text-[11px] bg-zinc-950 text-white hover:bg-zinc-800 font-semibold"
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Assign Student
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-300 font-mono gap-1 bg-white">
                                <Lock className="h-2.5 w-2.5 text-amber-600" />
                                Principal / Transport Mgr Only
                              </Badge>
                            )}
                          </div>
                        </div>

                        {isRosterExpanded && (
                          <div className="p-0">
                            {(!route.studentAssignments || route.studentAssignments.length === 0) ? (
                              <div className="p-4 text-center text-xs text-zinc-400 space-y-1">
                                <Users className="h-5 w-5 mx-auto text-zinc-300" />
                                <div>No students currently assigned to this bus route.</div>
                                <div className="text-[11px] text-zinc-400">
                                  {canManageAssignments
                                    ? "Click 'Assign Student' above to designate pickup stop and seat allocation."
                                    : "Assignments can be configured by Principal or Transport Manager."}
                                </div>
                              </div>
                            ) : (
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-b border-zinc-100 bg-zinc-50/50 text-[10px]">
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">STUDENT NAME & ID</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">CLASS / SECTION</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">BOARDING STOP</TableHead>
                                    <TableHead className="py-2 text-[10px] font-mono text-zinc-500">PARENT CONTACT</TableHead>
                                    {canManageAssignments && (
                                      <TableHead className="py-2 text-[10px] font-mono text-zinc-500 text-right">ACTION</TableHead>
                                    )}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {route.studentAssignments.map((assignment: any) => {
                                    const st = assignment.student;
                                    const studentName = st ? `${st.firstName} ${st.lastName || ""}`.trim() : "Student";
                                    return (
                                      <TableRow key={assignment.id || assignment.studentId} className="border-b border-zinc-100 text-xs">
                                        <TableCell className="py-2">
                                          <div className="font-semibold text-zinc-950">{studentName}</div>
                                          <div className="text-[10px] font-mono text-zinc-500">
                                            Adm: {st?.admissionNumber || "N/A"}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <Badge variant="outline" className="text-[10px] font-mono border-zinc-300">
                                            {st?.gradeClass?.name || "Class"} {st?.section?.name ? `- ${st.section.name}` : ""}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="py-2">
                                          <div className="font-medium text-zinc-900 flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                                            <span>{assignment.stop?.stopName || "Corridor Stop"}</span>
                                          </div>
                                          {assignment.stop?.pickupTime && (
                                            <div className="text-[10px] font-mono text-zinc-500 pl-4">
                                              Pick: {assignment.stop.pickupTime} • Drop: {assignment.stop.dropTime}
                                            </div>
                                          )}
                                        </TableCell>
                                        <TableCell className="py-2">
                                          {st?.parent?.phone ? (
                                            <div className="font-mono text-[11px] text-zinc-700 flex items-center gap-1">
                                              <Phone className="h-2.5 w-2.5 text-zinc-400" />
                                              {st.parent.phone}
                                            </div>
                                          ) : (
                                            <span className="text-zinc-400 text-[11px] italic">Not registered</span>
                                          )}
                                          {(st?.parent?.fatherName || st?.parent?.motherName) && (
                                            <div className="text-[10px] text-zinc-400">
                                              {st?.parent?.fatherName || st?.parent?.motherName}
                                            </div>
                                          )}
                                        </TableCell>
                                        {canManageAssignments && (
                                          <TableCell className="py-2 text-right">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => handleUnassignStudent(st?.id || assignment.studentId, studentName)}
                                              className="h-6 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 text-[11px]"
                                              title="Unassign Student"
                                            >
                                              <UserX className="h-3.5 w-3.5 mr-1" />
                                              Unassign
                                            </Button>
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: VEHICLES FLEET */}
        <TabsContent value="vehicles" className="space-y-4 pt-2">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-950">Institutional Fleet</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Registered school buses, vans, and multi-passenger transport vehicles
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddVehicleOpen(true)}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Vehicle
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50/50">
                    <TableHead className="text-xs font-mono text-zinc-500">REGISTRATION NO</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">MODEL & TYPE</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">SEATS</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">ASSIGNED DRIVER</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">FUEL</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">STATUS</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500 text-right">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-xs text-zinc-400">
                        No vehicles registered in fleet. Click &quot;Add Vehicle&quot; to begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vehicles.map((v) => (
                      <TableRow key={v.id} className="border-b border-zinc-100 text-xs">
                        <TableCell className="font-bold text-zinc-950 font-mono">
                          {v.registrationNo}
                        </TableCell>
                        <TableCell className="text-zinc-700">
                          <div>{v.model}</div>
                          <span className="text-[10px] text-zinc-400 font-mono">{v.vehicleType}</span>
                        </TableCell>
                        <TableCell className="font-mono text-zinc-700">
                          {v.capacity} Seats
                        </TableCell>
                        <TableCell className="text-zinc-700">
                          {v.driver ? (
                            <div>
                              <div className="font-medium text-zinc-900">{v.driver.name}</div>
                              <div className="text-[10px] font-mono text-zinc-500">{v.driver.phone}</div>
                            </div>
                          ) : (
                            <span className="text-zinc-400 italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-zinc-600">
                          {v.fuelType}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={v.status === "ACTIVE" ? "contrast" : "outline"}
                            className="text-[10px] font-mono"
                          >
                            {v.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteVehicle(v.id, v.registrationNo)}
                            className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: DRIVERS ROSTER */}
        <TabsContent value="drivers" className="space-y-4 pt-2">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-950">Drivers Roster</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Certified institutional drivers, commercial license verification, and contact records
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddDriverOpen(true)}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Driver
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-100 bg-zinc-50/50">
                    <TableHead className="text-xs font-mono text-zinc-500">DRIVER NAME</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">PHONE</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">COMMERCIAL LICENSE</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">EXP (YRS)</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">EMERGENCY</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500">STATUS</TableHead>
                    <TableHead className="text-xs font-mono text-zinc-500 text-right">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-xs text-zinc-400">
                        No drivers registered yet. Click &quot;Add Driver&quot; to enroll institutional drivers.
                      </TableCell>
                    </TableRow>
                  ) : (
                    drivers.map((d) => (
                      <TableRow key={d.id} className="border-b border-zinc-100 text-xs">
                        <TableCell className="font-semibold text-zinc-950">
                          {d.name}
                        </TableCell>
                        <TableCell className="font-mono text-zinc-700">
                          {d.phone}
                        </TableCell>
                        <TableCell className="font-mono text-zinc-800">
                          <div>{d.licenseNumber}</div>
                          {d.licenseExpiry && (
                            <span className="text-[10px] text-zinc-400">
                              Exp: {new Date(d.licenseExpiry).toLocaleDateString()}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-zinc-700">
                          {d.experienceYears || 0} yrs
                        </TableCell>
                        <TableCell className="text-zinc-600 font-mono text-[11px]">
                          {d.emergencyContact || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={d.status === "ACTIVE" ? "contrast" : "outline"}
                            className="text-[10px] font-mono"
                          >
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDriver(d.id, d.name)}
                            className="h-7 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: TRIP LOGS */}
        <TabsContent value="trips" className="space-y-4 pt-2">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950">Trip Dispatch Logs</CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Live morning pickup and afternoon drop run audit
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {trips.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  No active or recorded trips for today yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Bus className="h-4 w-4 text-zinc-600" />
                        <div>
                          <div className="font-semibold text-zinc-900">{trip.route?.name || "Route Trip"}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            {trip.tripType} • {new Date(trip.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="contrast" className="text-[10px] font-mono">
                        {trip.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: ADD DRIVER */}
      <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form noValidate onSubmit={handleAddDriver}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Register New Driver</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Enter driver credentials, commercial license verification, and contact info.
              </DialogDescription>
            </DialogHeader>

            {formErrors.driver_form && (
              <p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2 animate-in fade-in">
                {formErrors.driver_form}
              </p>
            )}

            <div className="space-y-3 py-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Full Name <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  placeholder="e.g. Ramesh Kumar"
                  value={driverForm.name}
                  onChange={(e) => {
                    clearFieldError("driver_name");
                    setDriverForm({ ...driverForm, name: e.target.value });
                  }}
                  className={formErrors.driver_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formErrors.driver_name && (
                  <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                    {formErrors.driver_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Phone Number <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="+91 9876543210"
                    value={driverForm.phone}
                    onChange={(e) => {
                      clearFieldError("driver_phone");
                      setDriverForm({ ...driverForm, phone: e.target.value });
                    }}
                    className={formErrors.driver_phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.driver_phone && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.driver_phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Experience (Years)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={driverForm.experienceYears}
                    onChange={(e) => setDriverForm({ ...driverForm, experienceYears: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Driving License No <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="TN-01-2018-00291"
                    value={driverForm.licenseNumber}
                    onChange={(e) => {
                      clearFieldError("driver_license");
                      setDriverForm({ ...driverForm, licenseNumber: e.target.value.toUpperCase() });
                    }}
                    className={formErrors.driver_license ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.driver_license && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.driver_license}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">License Expiry</Label>
                  <Input
                    type="date"
                    value={driverForm.licenseExpiry}
                    onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Emergency Contact</Label>
                <Input
                  placeholder="Relative name / phone (+91 9840012345)"
                  value={driverForm.emergencyContact}
                  onChange={(e) => setDriverForm({ ...driverForm, emergencyContact: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Residential Address</Label>
                <Input
                  placeholder="Street, City, Postal Code"
                  value={driverForm.address}
                  onChange={(e) => setDriverForm({ ...driverForm, address: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDriverOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Saving..." : "Save Driver"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ADD VEHICLE */}
      <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form noValidate onSubmit={handleAddVehicle}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Register Fleet Vehicle</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Enroll a new bus, van, or staff vehicle into the institutional transport fleet.
              </DialogDescription>
            </DialogHeader>

            {formErrors.veh_form && (
              <p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2 animate-in fade-in">
                {formErrors.veh_form}
              </p>
            )}

            <div className="space-y-3 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Registration Number <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="TN-09-AX-4821"
                    value={vehicleForm.registrationNo}
                    onChange={(e) => {
                      clearFieldError("veh_regNo");
                      setVehicleForm({ ...vehicleForm, registrationNo: e.target.value.toUpperCase() });
                    }}
                    className={formErrors.veh_regNo ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.veh_regNo && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.veh_regNo}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Vehicle Type</Label>
                  <Select
                    value={vehicleForm.vehicleType}
                    onValueChange={(val) => setVehicleForm({ ...vehicleForm, vehicleType: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUS">School Bus</SelectItem>
                      <SelectItem value="VAN">Student Van</SelectItem>
                      <SelectItem value="MINIBUS">Mini Bus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Model / Make <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Tata Starbus Ultra"
                    value={vehicleForm.model}
                    onChange={(e) => {
                      clearFieldError("veh_model");
                      setVehicleForm({ ...vehicleForm, model: e.target.value });
                    }}
                    className={formErrors.veh_model ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.veh_model && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.veh_model}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Seating Capacity <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={vehicleForm.capacity}
                    onChange={(e) => {
                      clearFieldError("veh_capacity");
                      setVehicleForm({ ...vehicleForm, capacity: e.target.value });
                    }}
                    className={formErrors.veh_capacity ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.veh_capacity && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.veh_capacity}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Fuel Type</Label>
                  <Select
                    value={vehicleForm.fuelType}
                    onValueChange={(val) => setVehicleForm({ ...vehicleForm, fuelType: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                      <SelectItem value="ELECTRIC">Electric</SelectItem>
                      <SelectItem value="PETROL">Petrol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Assigned Driver</Label>
                  <Select
                    value={vehicleForm.driverId}
                    onValueChange={(val) => setVehicleForm({ ...vehicleForm, driverId: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select Driver (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Unassigned</SelectItem>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddVehicleOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Saving..." : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ADD ROUTE */}
      <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form noValidate onSubmit={handleAddRoute}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Create Transport Route</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Setup route corridor, assigned bus, and primary driver.
              </DialogDescription>
            </DialogHeader>

            {formErrors.route_form && (
              <p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2 animate-in fade-in">
                {formErrors.route_form}
              </p>
            )}

            <div className="space-y-3 py-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs font-medium">
                    Route Name <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Route 101 - North Corridor"
                    value={routeForm.name}
                    onChange={(e) => {
                      clearFieldError("route_name");
                      setRouteForm({ ...routeForm, name: e.target.value });
                    }}
                    className={formErrors.route_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.route_name && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.route_name}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Route Code</Label>
                  <Input
                    placeholder="RT-101"
                    value={routeForm.code}
                    onChange={(e) => setRouteForm({ ...routeForm, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Start Location <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. T. Nagar Terminus"
                    value={routeForm.startLocation}
                    onChange={(e) => {
                      clearFieldError("route_start");
                      setRouteForm({ ...routeForm, startLocation: e.target.value });
                    }}
                    className={formErrors.route_start ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.route_start && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.route_start}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    End Location <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Greenwood Main Gate"
                    value={routeForm.endLocation}
                    onChange={(e) => {
                      clearFieldError("route_end");
                      setRouteForm({ ...routeForm, endLocation: e.target.value });
                    }}
                    className={formErrors.route_end ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.route_end && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.route_end}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Assign Vehicle</Label>
                  <Select
                    value={routeForm.vehicleId}
                    onValueChange={(val) => setRouteForm({ ...routeForm, vehicleId: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Unassigned</SelectItem>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.registrationNo} ({v.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Assign Driver</Label>
                  <Select
                    value={routeForm.driverId}
                    onValueChange={(val) => setRouteForm({ ...routeForm, driverId: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select Driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Unassigned</SelectItem>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Faculty Incharge (Optional)</Label>
                <Select
                  value={routeForm.inchargeStaffId}
                  onValueChange={(val) => setRouteForm({ ...routeForm, inchargeStaffId: val })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Incharge Faculty (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None / Appoint Later</SelectItem>
                    {staffList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.designation || "Faculty"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddRouteOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Saving..." : "Create Route"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ADD STOP TO ROUTE */}
      <Dialog open={isAddStopOpen} onOpenChange={setIsAddStopOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form noValidate onSubmit={handleAddStop}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Add Stop to {selectedRouteForStop?.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Specify stop name, morning pickup time, and afternoon drop time.
              </DialogDescription>
            </DialogHeader>

            {formErrors.stop_form && (
              <p className="text-[11px] font-medium text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2 animate-in fade-in">
                {formErrors.stop_form}
              </p>
            )}

            <div className="space-y-3 py-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Stop Name <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  placeholder="e.g. Gandhi Nagar Junction"
                  value={stopForm.stopName}
                  onChange={(e) => {
                    clearFieldError("stop_name");
                    setStopForm({ ...stopForm, stopName: e.target.value });
                  }}
                  className={formErrors.stop_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formErrors.stop_name && (
                  <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                    {formErrors.stop_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Pickup Time <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="07:20 AM"
                    value={stopForm.pickupTime}
                    onChange={(e) => {
                      clearFieldError("stop_pickup");
                      setStopForm({ ...stopForm, pickupTime: e.target.value });
                    }}
                    className={formErrors.stop_pickup ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.stop_pickup && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.stop_pickup}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Drop Time <span className="text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    placeholder="03:45 PM"
                    value={stopForm.dropTime}
                    onChange={(e) => {
                      clearFieldError("stop_drop");
                      setStopForm({ ...stopForm, dropTime: e.target.value });
                    }}
                    className={formErrors.stop_drop ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.stop_drop && (
                    <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                      {formErrors.stop_drop}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Landmark / Cross Road</Label>
                  <Input
                    placeholder="Opposite Post Office"
                    value={stopForm.landmark}
                    onChange={(e) => setStopForm({ ...stopForm, landmark: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Sequence Order</Label>
                  <Input
                    type="number"
                    placeholder="Leave empty for next"
                    value={stopForm.stopOrder}
                    onChange={(e) => setStopForm({ ...stopForm, stopOrder: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddStopOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Adding..." : "Add Stop"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: APPOINT / CHANGE FACULTY INCHARGE */}
      <Dialog open={isAssignInchargeOpen} onOpenChange={setIsAssignInchargeOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form noValidate onSubmit={handleUpdateIncharge}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-zinc-900" />
                Appoint Route Faculty Incharge
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Designate a faculty member to supervise student discipline and emergency safety on route:{" "}
                <strong className="text-zinc-900">{selectedRouteForIncharge?.name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Select Faculty Member <span className="text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={selectedInchargeStaffId}
                  onValueChange={(val) => {
                    clearFieldError("incharge_staff");
                    setSelectedInchargeStaffId(val);
                  }}
                >
                  <SelectTrigger className={`text-xs ${formErrors.incharge_staff ? "border-red-500 focus:ring-red-500" : ""}`}>
                    <SelectValue placeholder="Choose faculty incharge" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="NONE">-- Remove / No Incharge Appointed --</SelectItem>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.designation || "Faculty"} - {staff.phone || "No Phone"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.incharge_staff && (
                  <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                    {formErrors.incharge_staff}
                  </p>
                )}
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs space-y-1 text-zinc-600">
                <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Incharge Role & Access Level
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Only <strong>Principal</strong> and <strong>Transport Manager</strong> can appoint or reassign route incharge faculty. Designated incharge faculty will receive trip manifests and oversee student boarding attendance.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignInchargeOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Saving..." : "Save Incharge"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ASSIGN STUDENT TO ROUTE */}
      <Dialog open={isAssignStudentOpen} onOpenChange={setIsAssignStudentOpen}>
        <DialogContent className="sm:max-w-md bg-white text-zinc-950">
          <form noValidate onSubmit={handleAssignStudent}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-900" />
                Assign Student to Transport Route
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Register student boarding stop and seat allocation for route:{" "}
                <strong className="text-zinc-900">{selectedRouteForStudent?.name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Select Student <span className="text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={studentAssignForm.studentId}
                  onValueChange={(val) => {
                    clearFieldError("assign_student");
                    setStudentAssignForm({ ...studentAssignForm, studentId: val });
                  }}
                >
                  <SelectTrigger className={`text-xs ${formErrors.assign_student ? "border-red-500 focus:ring-red-500" : ""}`}>
                    <SelectValue placeholder="Choose student to assign" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {studentsList.map((st) => (
                      <SelectItem key={st.id} value={st.id}>
                        {st.firstName} {st.lastName || ""} (Adm: {st.admissionNumber || "N/A"}{st.gradeClass ? ` • ${st.gradeClass.name}` : ""})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.assign_student && (
                  <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                    {formErrors.assign_student}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Designated Boarding Stop <span className="text-red-500 font-bold">*</span>
                </Label>
                {(!selectedRouteForStudent?.stops || selectedRouteForStudent.stops.length === 0) ? (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px]">
                    This route has no stops configured yet. Please add a stop before assigning students.
                  </div>
                ) : (
                  <Select
                    value={studentAssignForm.stopId}
                    onValueChange={(val) => {
                      clearFieldError("assign_stop");
                      setStudentAssignForm({ ...studentAssignForm, stopId: val });
                    }}
                  >
                    <SelectTrigger className={`text-xs ${formErrors.assign_stop ? "border-red-500 focus:ring-red-500" : ""}`}>
                      <SelectValue placeholder="Choose boarding stop" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {selectedRouteForStudent?.stops.map((stop: any) => (
                        <SelectItem key={stop.id} value={stop.id}>
                          Stop #{stop.stopOrder}: {stop.stopName} (Pick: {stop.pickupTime}, Drop: {stop.dropTime})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {formErrors.assign_stop && (
                  <p className="text-[11px] font-medium text-red-600 mt-1 animate-in fade-in">
                    {formErrors.assign_stop}
                  </p>
                )}
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-500 space-y-1">
                <span className="font-semibold text-zinc-900 block">Fleet Capacity Check</span>
                <span>
                  Route Occupancy: {selectedRouteForStudent?.studentAssignments?.length || 0} /{" "}
                  {selectedRouteForStudent?.vehicle?.capacity || 40} seats occupied.
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignStudentOpen(false)}
                className="text-xs border-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !selectedRouteForStudent?.stops?.length}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submitting ? "Assigning..." : "Confirm Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
