"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Switch } from "@/components/ui/switch";
import {
  Bus,
  Plus,
  MapPin,
  Clock,
  Users,
  Play,
  Square,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Navigation,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  AlertOctagon,
  Wrench,
  Compass,
  Check,
  Radio,
  FileText,
  CalendarCheck,
} from "lucide-react";
import { erpApi } from "@/lib/api";

export default function DriverPortalPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolSlug = (params?.schoolSlug as string) || "greenwood-high";

  // Tab sync with query param
  const activeTab = searchParams.get("tab") || "trips";
  const handleTabChange = (tab: string) => {
    router.push(`/${schoolSlug}/driver?tab=${tab}`);
  };

  // State
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [assignedData, setAssignedData] = React.useState<any>(null);
  const [activeTrip, setActiveTrip] = React.useState<any>(null);
  const [incidents, setIncidents] = React.useState<any[]>([]);
  const [inspections, setInspections] = React.useState<any[]>([]);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Student filtering
  const [studentSearch, setStudentSearch] = React.useState("");
  const [filterStopId, setFilterStopId] = React.useState<string>("ALL");

  // GPS Telemetry
  const [gpsCoords, setGpsCoords] = React.useState({ lat: 13.0827, lng: 80.2707, speed: 28 });
  const [lastGpsSync, setLastGpsSync] = React.useState<string>("Just now");

  // Modals
  const [isStartTripOpen, setIsStartTripOpen] = React.useState(false);
  const [isEndTripOpen, setIsEndTripOpen] = React.useState(false);
  const [isSosOpen, setIsSosOpen] = React.useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = React.useState(false);

  // Form states
  const [tripType, setTripType] = React.useState("MORNING_PICKUP");
  const [endTripNotes, setEndTripNotes] = React.useState("");

  const [sosForm, setSosForm] = React.useState({
    incidentType: "BREAKDOWN",
    severity: "HIGH",
    description: "",
    location: "Main Ring Road / Near North Cross",
  });
  const [submittingSos, setSubmittingSos] = React.useState(false);

  const [inspectionForm, setInspectionForm] = React.useState({
    odometerReading: 45210,
    fuelLiters: 40,
    fuelCost: 3800,
    engineOilCheck: true,
    tirePressureCheck: true,
    brakesCheck: true,
    lightsCheck: true,
    emergencyDoorCheck: true,
    firstAidKitCheck: true,
    cleanlinessCheck: true,
    notes: "Bus verified and road-ready.",
  });
  const [submittingInspection, setSubmittingInspection] = React.useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Driver Data
  const loadData = React.useCallback(async () => {
    try {
      setRefreshing(true);
      const [assignedRes, tripRes, incidentRes, inspectRes] = await Promise.all([
        erpApi.getDriverAssignedData().catch(() => null),
        erpApi.getDriverActiveTrip().catch(() => null),
        erpApi.getDriverIncidents().catch(() => []),
        erpApi.getVehicleInspections().catch(() => []),
      ]);

      if (assignedRes) setAssignedData(assignedRes);
      setActiveTrip(tripRes || null);
      if (Array.isArray(incidentRes)) setIncidents(incidentRes);
      if (Array.isArray(inspectRes)) setInspections(inspectRes);

      if (tripRes?.currentLatitude && tripRes?.currentLongitude) {
        setGpsCoords({
          lat: tripRes.currentLatitude,
          lng: tripRes.currentLongitude,
          speed: tripRes.currentSpeed || 28,
        });
      }
    } catch (err) {
      console.error("Error loading driver data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Keep coords ref updated for stable background telemetry interval
  const coordsRef = React.useRef(gpsCoords);
  coordsRef.current = gpsCoords;

  // Periodic GPS Telemetry Broadcast during active trip
  React.useEffect(() => {
    if (!activeTrip) return;

    const interval = setInterval(async () => {
      const cur = coordsRef.current;
      const deltaLat = (Math.random() - 0.48) * 0.0006;
      const deltaLng = (Math.random() - 0.48) * 0.0006;
      const nextLat = Number((cur.lat + deltaLat).toFixed(6));
      const nextLng = Number((cur.lng + deltaLng).toFixed(6));
      const nextSpeed = Math.floor(20 + Math.random() * 25);

      setGpsCoords({ lat: nextLat, lng: nextLng, speed: nextSpeed });
      setLastGpsSync(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

      try {
        await erpApi.updateDriverTripLocation(activeTrip.id, {
          latitude: nextLat,
          longitude: nextLng,
          speed: nextSpeed,
          heading: Math.floor(Math.random() * 360),
        });
      } catch (e) {
        // silent telemetry retry
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [activeTrip?.id]);

  // Start Trip
  const handleStartTrip = async () => {
    try {
      setLoading(true);
      const newTrip = await erpApi.startDriverTrip({
        routeId: assignedData?.route?.id,
        vehicleId: assignedData?.vehicle?.id,
        tripType,
      });
      setActiveTrip(newTrip);
      setIsStartTripOpen(false);
      showToast("Trip started! Live GPS telemetry is broadcasting to parent apps.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to start trip.");
    } finally {
      setLoading(false);
    }
  };

  // End Trip
  const handleEndTrip = async () => {
    if (!activeTrip) return;
    try {
      setLoading(true);
      await erpApi.endDriverTrip(activeTrip.id, endTripNotes);
      setActiveTrip(null);
      setIsEndTripOpen(false);
      setEndTripNotes("");
      showToast("Trip ended and logged successfully.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to end trip.");
    } finally {
      setLoading(false);
    }
  };

  // Stop Reached / Skipped
  const handleStopStatus = async (stopId: string, status: "REACHED" | "SKIPPED") => {
    if (!activeTrip) {
      showToast("Please start the trip session first.");
      return;
    }
    try {
      await erpApi.updateTripStopStatus(activeTrip.id, stopId, status);
      showToast(status === "REACHED" ? "Stop marked as Reached." : "Stop marked as Skipped.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to update stop status.");
    }
  };

  // Student Boarding Status
  const handleStudentStatus = async (
    studentId: string,
    status: "WAITING" | "BOARDED" | "DROPPED" | "ABSENT" | "SKIPPED",
    remarks?: string
  ) => {
    if (!activeTrip) {
      showToast("Please start the trip session first.");
      return;
    }
    try {
      await erpApi.updateTripStudentStatus(activeTrip.id, studentId, status, remarks);
      setActiveTrip((prev: any) => {
        if (!prev) return prev;
        const list = prev.studentStatuses || [];
        const idx = list.findIndex((s: any) => s.studentId === studentId);
        let updated = [...list];
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], status, remarks };
        } else {
          updated.push({ studentId, status, remarks });
        }
        return { ...prev, studentStatuses: updated };
      });
      showToast(`Student status updated to ${status}.`);
    } catch (err: any) {
      showToast(err.message || "Failed to update boarding status.");
      loadData();
    }
  };

  // Report SOS Incident
  const handleReportSos = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSos(true);
    try {
      await erpApi.reportTransportIncident({
        ...sosForm,
        tripId: activeTrip?.id,
        latitude: gpsCoords.lat,
        longitude: gpsCoords.lng,
      });
      setIsSosOpen(false);
      setSosForm({
        incidentType: "BREAKDOWN",
        severity: "HIGH",
        description: "",
        location: "Main Ring Road / Near North Cross",
      });
      showToast("Emergency SOS broadcasted! School transport desk has been notified.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to dispatch SOS.");
    } finally {
      setSubmittingSos(false);
    }
  };

  // Submit Vehicle Inspection
  const handleReportInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInspection(true);
    try {
      await erpApi.logVehicleInspection({
        ...inspectionForm,
        vehicleId: assignedData?.vehicle?.id,
      });
      setIsInspectionOpen(false);
      showToast("Pre-trip vehicle safety inspection logged.");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to log inspection.");
    } finally {
      setSubmittingInspection(false);
    }
  };

  // Derived lists
  const stops = assignedData?.route?.stops || [];
  const students = assignedData?.students || [];

  const filteredStudents = students.filter((s: any) => {
    const query = studentSearch.toLowerCase().trim();
    const name = (s.fullName || "").toLowerCase();
    const stopName = (s.stopName || "").toLowerCase();
    const roll = (s.rollNumber || s.admissionNumber || "").toLowerCase();
    const matchesSearch = !query || name.includes(query) || stopName.includes(query) || roll.includes(query);
    const matchesStop = filterStopId === "ALL" || s.stopId === filterStopId;
    return matchesSearch && matchesStop;
  });

  const getStudentTripStatus = (studentId: string) => {
    if (!activeTrip?.studentStatuses) return "WAITING";
    const found = activeTrip.studentStatuses.find((item: any) => item.studentId === studentId);
    return found ? found.status : "WAITING";
  };

  const getStopTripStatus = (stopId: string) => {
    if (!activeTrip?.stopLogs) return "PENDING";
    const found = activeTrip.stopLogs.find((item: any) => item.stopId === stopId);
    return found ? found.status : "PENDING";
  };

  if (loading && !assignedData) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
        <p className="font-mono text-xs text-zinc-500">Connecting Driver Operations Desk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-950 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2 border border-zinc-700 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Driver Transit Hub</h1>
            <Badge
              variant="outline"
              className={
                activeTrip
                  ? "border-emerald-300 text-emerald-800 bg-emerald-50 text-[11px] font-mono animate-pulse"
                  : "border-zinc-300 text-zinc-700 bg-zinc-50 text-[11px] font-mono"
              }
            >
              {activeTrip ? "TRIP IN PROGRESS" : "FLEET STATUS: STANDBY"}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            DRIVER CONSOLE: ACTIVE TRIP DISPATCH, LIVE GPS TELEMETRY, ROUTE STOPS & PASSENGER CHECK-INS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Authenticated Driver Badge */}
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className={`h-2 w-2 rounded-full ${activeTrip ? "bg-emerald-500" : "bg-zinc-400"} inline-block shrink-0`} />
            <span className="text-zinc-500 text-[11px]">DRIVER:</span>
            <span className="font-semibold text-zinc-900">{assignedData?.driver?.name || "Murugan Fleet Driver"}</span>
            <span className="text-zinc-300">•</span>
            <Badge variant="outline" className="border-zinc-300 text-zinc-700 bg-white text-[10px] font-mono">
              DRIVER
            </Badge>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            disabled={refreshing}
            className="border-zinc-300 hover:bg-zinc-100 text-xs font-mono"
            title="Refresh Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {activeTrip ? (
            <Button
              size="sm"
              onClick={() => setIsEndTripOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              <Square className="h-3.5 w-3.5 mr-1 fill-current" />
              End Trip
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsStartTripOpen(true)}
              className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
            >
              <Play className="h-3.5 w-3.5 mr-1 fill-current" />
              Start Trip
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSosOpen(true)}
            className="border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold"
          >
            <AlertOctagon className="h-3.5 w-3.5 mr-1 text-rose-600" />
            SOS Alert
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsInspectionOpen(true)}
            className="border-zinc-300 hover:bg-zinc-100 text-xs font-mono"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Inspection
          </Button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">TRIP DISPATCH</span>
              <Compass className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-zinc-950">
                {activeTrip ? (activeTrip.tripType === "MORNING_PICKUP" ? "Morning Pickup" : "Afternoon Drop") : "Standby"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              {activeTrip ? `Started: ${new Date(activeTrip.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "No active session"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">ASSIGNED BUS</span>
              <Bus className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-zinc-950">
                {assignedData?.vehicle?.registrationNo || "TN-01-AX-9999"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              {assignedData?.vehicle?.model || "Tata Starbus"} • {assignedData?.vehicle?.capacity || 40} seats
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">ROUTE & STOPS</span>
              <MapPin className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-zinc-950">
                {activeTrip?.stopLogs?.filter((s: any) => s.status === "REACHED").length || 0} / {stops.length}
              </span>
              <span className="text-xs text-zinc-500">stops</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1 truncate">
              {assignedData?.route?.name || "Route 101"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-zinc-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">COMMUTER ROSTER</span>
              <Users className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600">
                {activeTrip?.studentStatuses?.filter((s: any) => s.status === "BOARDED" || s.status === "DROPPED").length || 0}
              </span>
              <span className="text-xs text-zinc-500">/ {students.length} checked</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              {students.length} assigned students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Trip Telemetry Strip (When active) */}
      {activeTrip && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono text-emerald-950 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-bold text-emerald-900">LIVE GPS TELEMETRY ACTIVE:</span>
            <span>Coord: {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}</span>
            <span className="text-emerald-300">•</span>
            <span>Speed: <strong>{gpsCoords.speed} km/h</strong></span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800 text-[11px]">
            <Radio className="h-3.5 w-3.5 text-emerald-600" />
            <span>Broadcasting to Parent App • Last ping: {lastGpsSync}</span>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="bg-zinc-100 border border-zinc-200 p-1 rounded-lg">
          <TabsTrigger
            value="trips"
            className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs font-mono text-zinc-600"
          >
            <Bus className="h-3.5 w-3.5 mr-1.5" />
            Console & Trip
          </TabsTrigger>
          <TabsTrigger
            value="stops"
            className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs font-mono text-zinc-600"
          >
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            Route Stops ({stops.length})
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs font-mono text-zinc-600"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Passenger Roster ({students.length})
          </TabsTrigger>
          <TabsTrigger
            value="vehicle"
            className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs font-mono text-zinc-600"
          >
            <Wrench className="h-3.5 w-3.5 mr-1.5" />
            Safety & Fuel ({inspections.length})
          </TabsTrigger>
          <TabsTrigger
            value="incidents"
            className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs font-mono text-zinc-600"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            SOS Emergency Log ({incidents.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CONSOLE & ACTIVE TRIP */}
        <TabsContent value="trips" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Operational Dispatch Card */}
            <Card className="md:col-span-2 bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-zinc-950">Daily Route Dispatch Control</CardTitle>
                    <CardDescription className="text-xs text-zinc-500 font-mono">
                      Operate scheduled transit sessions with GPS telemetry
                    </CardDescription>
                  </div>
                  {activeTrip ? (
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-[10px]">
                      ACTIVE DISPATCH
                    </Badge>
                  ) : (
                    <Badge className="bg-zinc-100 text-zinc-700 border-zinc-300 font-mono text-[10px]">
                      READY TO START
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">ASSIGNED ROUTE:</span>
                    <span className="font-bold text-zinc-900">{assignedData?.route?.name || "Route 101"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">FLEET VEHICLE:</span>
                    <span className="font-semibold text-zinc-900">
                      {assignedData?.vehicle?.registrationNo} ({assignedData?.vehicle?.model})
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">ASSIGNED STOPS:</span>
                    <span className="font-mono text-zinc-700">{stops.length} sequential stops</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono">REGISTERED COMMUTERS:</span>
                    <span className="font-mono text-zinc-700">{students.length} students</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {activeTrip ? (
                    <Button
                      onClick={() => setIsEndTripOpen(true)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-9 px-4"
                    >
                      <Square className="h-3.5 w-3.5 mr-1.5 fill-current" />
                      Complete & End Trip
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsStartTripOpen(true)}
                      className="bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs h-9 px-4"
                    >
                      <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                      Start Assigned Trip
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handleTabChange("stops")}
                    className="border-zinc-300 text-xs font-mono"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    View Stops Timeline
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleTabChange("students")}
                    className="border-zinc-300 text-xs font-mono"
                  >
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Open Commuter Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Driver Profile Card */}
            <Card className="bg-white border-zinc-200 shadow-2xs">
              <CardHeader className="pb-3 border-b border-zinc-100">
                <CardTitle className="text-base font-semibold text-zinc-950">Driver Credentials</CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-mono">
                  Authorized fleet operator profile
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 font-mono block">Operator Name</span>
                  <span className="font-bold text-zinc-900 text-sm">{assignedData?.driver?.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block">Contact Phone</span>
                  <span className="font-mono text-zinc-800">{assignedData?.driver?.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block">Driver License #</span>
                  <span className="font-mono text-zinc-800">{assignedData?.driver?.licenseNumber || "DL-TN-2023-8891"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono block">Authorization Status</span>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-[10px] mt-1">
                    VERIFIED & ACTIVE
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: ROUTE STOPS & MILESTONES */}
        <TabsContent value="stops" className="space-y-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold text-zinc-950">Route Stops & Milestones</CardTitle>
                  <CardDescription className="text-xs text-zinc-500 font-mono">
                    Sequential transit points. Record stop arrival status during the active trip.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-zinc-300 text-zinc-700 font-mono text-xs self-start sm:self-auto">
                  {assignedData?.route?.name || "Route"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stops.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No stops assigned to this route yet.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {stops.map((stop: any, index: number) => {
                    const status = getStopTripStatus(stop.id);
                    const isReached = status === "REACHED";
                    const isSkipped = status === "SKIPPED";
                    const stopStudents = students.filter((s: any) => s.stopId === stop.id);

                    return (
                      <div
                        key={stop.id}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${isReached ? "bg-emerald-50/40" : isSkipped ? "bg-zinc-50 opacity-70" : "hover:bg-zinc-50/60"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold ${isReached
                                ? "bg-emerald-600 text-white"
                                : isSkipped
                                  ? "bg-zinc-200 text-zinc-600"
                                  : "bg-zinc-100 border border-zinc-300 text-zinc-800"
                              }`}
                          >
                            {isReached ? <Check className="h-4 w-4" /> : stop.stopOrder || index + 1}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-zinc-950">{stop.stopName}</span>
                              {isReached && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-mono">
                                  REACHED
                                </Badge>
                              )}
                              {isSkipped && (
                                <Badge className="bg-zinc-100 text-zinc-700 border-zinc-300 text-[10px] font-mono">
                                  SKIPPED
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-zinc-500">
                              Pickup: <strong className="text-zinc-800">{stop.pickupTime}</strong> • Drop:{" "}
                              <strong className="text-zinc-800">{stop.dropTime}</strong>
                              {stop.landmark && ` • Landmark: ${stop.landmark}`}
                            </p>

                            <p className="text-[11px] font-mono text-zinc-500">
                              {stopStudents.length} student{stopStudents.length !== 1 ? "s" : ""} at this transit point
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            size="sm"
                            disabled={!activeTrip || isReached}
                            onClick={() => handleStopStatus(stop.id, "REACHED")}
                            className={`h-8 px-3 text-xs font-semibold ${isReached
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                                : "bg-zinc-950 hover:bg-zinc-800 text-white"
                              }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            {isReached ? "Reached" : "Mark Reached"}
                          </Button>

                          {!isReached && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!activeTrip || isSkipped}
                              onClick={() => handleStopStatus(stop.id, "SKIPPED")}
                              className="h-8 px-2.5 text-xs border-zinc-300 hover:bg-zinc-100 text-zinc-600"
                            >
                              Skip
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PASSENGER ROSTER & BOARDING */}
        <TabsContent value="students" className="space-y-4">
          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-zinc-950">Student Commuter Checklist</CardTitle>
                  <CardDescription className="text-xs text-zinc-500 font-mono">
                    Record boarding and drop status for students on your route
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <Input
                      placeholder="Search student or roll..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-8 h-8 text-xs w-full sm:w-[200px] border-zinc-200"
                    />
                  </div>

                  <Select value={filterStopId} onValueChange={setFilterStopId}>
                    <SelectTrigger className="h-8 text-xs border-zinc-200 w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter Stop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Stops ({students.length})</SelectItem>
                      {stops.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.stopName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No students matched your search criteria.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {filteredStudents.map((st: any) => {
                    const boardingStatus = getStudentTripStatus(st.id);

                    return (
                      <div
                        key={st.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs uppercase">
                            {st.firstName?.[0] || "S"}
                            {st.lastName?.[0] || ""}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-zinc-950">{st.fullName}</span>
                              <Badge variant="outline" className="border-zinc-200 text-zinc-700 text-[10px] font-mono">
                                {st.className} - {st.sectionName}
                              </Badge>
                              <Badge
                                className={
                                  boardingStatus === "BOARDED"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]"
                                    : boardingStatus === "DROPPED"
                                      ? "bg-blue-100 text-blue-800 border-blue-300 text-[10px]"
                                      : boardingStatus === "ABSENT"
                                        ? "bg-rose-100 text-rose-800 border-rose-300 text-[10px]"
                                        : "bg-amber-100 text-amber-800 border-amber-300 text-[10px]"
                                }
                              >
                                {boardingStatus}
                              </Badge>
                            </div>

                            <p className="text-xs text-zinc-500">
                              Stop: <strong className="text-zinc-800">{st.stopName}</strong> • Scheduled: {st.pickupTime}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                              <span>Parent: {st.parentName}</span>
                              {st.parentPhone && st.parentPhone !== "N/A" && (
                                <a
                                  href={`tel:${st.parentPhone}`}
                                  className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-mono"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>{st.parentPhone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <Button
                            size="sm"
                            disabled={!activeTrip}
                            onClick={() => handleStudentStatus(st.id, "BOARDED")}
                            className={`h-8 px-2.5 text-xs font-semibold ${boardingStatus === "BOARDED"
                                ? "bg-emerald-600 text-white"
                                : "bg-white hover:bg-emerald-50 text-zinc-700 border border-zinc-300"
                              }`}
                          >
                            <UserCheck className="h-3.5 w-3.5 mr-1" />
                            Board
                          </Button>

                          <Button
                            size="sm"
                            disabled={!activeTrip}
                            onClick={() => handleStudentStatus(st.id, "DROPPED")}
                            className={`h-8 px-2.5 text-xs font-semibold ${boardingStatus === "DROPPED"
                                ? "bg-blue-600 text-white"
                                : "bg-white hover:bg-blue-50 text-zinc-700 border border-zinc-300"
                              }`}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Drop
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!activeTrip}
                            onClick={() => handleStudentStatus(st.id, "ABSENT", "Absent at morning stop")}
                            className={`h-8 px-2 text-xs font-semibold ${boardingStatus === "ABSENT"
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : "text-zinc-500 hover:text-rose-700 hover:bg-rose-50"
                              }`}
                          >
                            <UserX className="h-3.5 w-3.5 mr-1" />
                            Absent
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: VEHICLE SAFETY & FUEL */}
        <TabsContent value="vehicle" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Vehicle Roadworthiness & Fuel Logs</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Mandatory pre-trip mechanical inspection and fuel refill register
              </p>
            </div>

            <Button
              onClick={() => setIsInspectionOpen(true)}
              size="sm"
              className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Safety Inspection
            </Button>
          </div>

          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950">Inspection History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {inspections.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No vehicle safety inspection logs recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {inspections.map((ins: any) => (
                    <div key={ins.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900">
                            {new Date(ins.inspectionDate).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            at {new Date(ins.inspectionDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-mono">
                            ROAD READY
                          </Badge>
                        </div>
                        <p className="text-zinc-600 text-xs">
                          Odometer: <strong>{ins.odometerReading ? `${ins.odometerReading} km` : "N/A"}</strong>
                          {ins.fuelLiters && ` • Fuel Added: ${ins.fuelLiters}L (₹${ins.fuelCost || 0})`}
                        </p>
                        {ins.notes && <p className="text-zinc-500 italic text-[11px]">&quot;{ins.notes}&quot;</p>}
                      </div>

                      <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">Oil: OK</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">Tires: OK</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">Brakes: OK</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">Emergency: OK</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: EMERGENCY SOS LOG */}
        <TabsContent value="incidents" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Emergency & Incident Dispatch Register</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Real-time breakdown, accident, and medical alert dispatch logs
              </p>
            </div>

            <Button
              onClick={() => setIsSosOpen(true)}
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold self-start sm:self-auto"
            >
              <AlertOctagon className="h-3.5 w-3.5 mr-1" />
              Dispatch Emergency SOS
            </Button>
          </div>

          <Card className="bg-white border-zinc-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950">Incident History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {incidents.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                  <p className="font-semibold text-zinc-800">All Clear</p>
                  <p className="text-zinc-500 text-xs mt-0.5">No accidents or breakdown incidents recorded.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {incidents.map((inc: any) => (
                    <div key={inc.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              inc.severity === "CRITICAL"
                                ? "bg-rose-600 text-white"
                                : inc.severity === "HIGH"
                                  ? "bg-rose-100 text-rose-800 border-rose-300"
                                  : "bg-amber-100 text-amber-800 border-amber-300"
                            }
                          >
                            {inc.incidentType}
                          </Badge>
                          <span className="text-xs font-semibold text-zinc-900">
                            {new Date(inc.reportedAt).toLocaleDateString([], { month: "short", day: "numeric" })} at{" "}
                            {new Date(inc.reportedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-zinc-300 text-zinc-700 text-[10px] font-mono">
                          {inc.status || "REPORTED"}
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-800">{inc.description}</p>

                      {inc.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                          <MapPin className="h-3 w-3 text-zinc-400" />
                          <span>Location: {inc.location}</span>
                          {inc.latitude && <span>({inc.latitude.toFixed(4)}, {inc.longitude?.toFixed(4)})</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* START TRIP DIALOG */}
      <Dialog open={isStartTripOpen} onOpenChange={setIsStartTripOpen}>
        <DialogContent className="bg-white border-zinc-200 text-zinc-950 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Bus className="h-5 w-5 text-zinc-900" />
              Start Assigned Trip
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Confirm your transit session. Live GPS telemetry will broadcast to parents and the school transport desk.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-700">Trip Direction</Label>
              <Select value={tripType} onValueChange={setTripType}>
                <SelectTrigger className="border-zinc-300 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING_PICKUP">Morning Pickup to School</SelectItem>
                  <SelectItem value="AFTERNOON_DROP">Afternoon Drop to Home</SelectItem>
                  <SelectItem value="SPECIAL_TRIP">Special / Field Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono">Route:</span>
                <span className="font-semibold text-zinc-900">{assignedData?.route?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono">Bus:</span>
                <span className="font-semibold text-zinc-900">{assignedData?.vehicle?.registrationNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono">Stops:</span>
                <span className="font-mono text-zinc-900">{stops.length} stops</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsStartTripOpen(false)}
              className="border-zinc-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartTrip}
              className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
            >
              Confirm & Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* END TRIP DIALOG */}
      <Dialog open={isEndTripOpen} onOpenChange={setIsEndTripOpen}>
        <DialogContent className="bg-white border-zinc-200 text-zinc-950 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
              <Square className="h-5 w-5 fill-current" />
              Complete & End Trip
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Ending the trip marks all stops as completed and archives today&apos;s live telemetry.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-700">Driver Closing Remarks</Label>
              <Textarea
                placeholder="E.g. All students arrived safely. Route cleared on time."
                value={endTripNotes}
                onChange={(e) => setEndTripNotes(e.target.value)}
                className="border-zinc-300 text-xs min-h-[70px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEndTripOpen(false)}
              className="border-zinc-300 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEndTrip}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Confirm End Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EMERGENCY SOS DIALOG */}
      <Dialog open={isSosOpen} onOpenChange={setIsSosOpen}>
        <DialogContent className="bg-white border-zinc-200 text-zinc-950 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
              <AlertOctagon className="h-5 w-5 text-rose-600" />
              Emergency SOS Dispatch
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Instantly notifies the school transport manager with your vehicle location and emergency notes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportSos} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-zinc-700">Incident Category</Label>
              <Select
                value={sosForm.incidentType}
                onValueChange={(val) => setSosForm({ ...sosForm, incidentType: val })}
              >
                <SelectTrigger className="border-zinc-300 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BREAKDOWN">Vehicle Breakdown / Engine Stall</SelectItem>
                  <SelectItem value="ACCIDENT">Traffic Collision / Minor Accident</SelectItem>
                  <SelectItem value="MEDICAL_EMERGENCY">Medical Emergency (Student unwell)</SelectItem>
                  <SelectItem value="TRAFFIC_DELAY">Severe Traffic / Road Blockage</SelectItem>
                  <SelectItem value="OTHER">Other Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-700">Severity Level</Label>
              <Select
                value={sosForm.severity}
                onValueChange={(val) => setSosForm({ ...sosForm, severity: val })}
              >
                <SelectTrigger className="border-zinc-300 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRITICAL">CRITICAL (Immediate Police / Medical Backup)</SelectItem>
                  <SelectItem value="HIGH">HIGH (Backup Bus Needed)</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM (Delay expected)</SelectItem>
                  <SelectItem value="LOW">LOW (Informational)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-700">Current Location / Landmark</Label>
              <Input
                placeholder="E.g. Near Toll Gate / Main Ring Road"
                value={sosForm.location}
                onChange={(e) => setSosForm({ ...sosForm, location: e.target.value })}
                className="border-zinc-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-700">Incident Description</Label>
              <Textarea
                required
                placeholder="Describe what occurred, any student needs, and immediate safety status..."
                value={sosForm.description}
                onChange={(e) => setSosForm({ ...sosForm, description: e.target.value })}
                className="border-zinc-300 text-xs min-h-[70px]"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-2 font-mono">
              <Radio className="h-4 w-4 shrink-0 text-rose-600" />
              <span>Current GPS coordinates ({gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}) will be attached automatically.</span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSosOpen(false)}
                className="border-zinc-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingSos}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
              >
                {submittingSos ? "Broadcasting..." : "Dispatch Emergency Alert"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VEHICLE INSPECTION DIALOG */}
      <Dialog open={isInspectionOpen} onOpenChange={setIsInspectionOpen}>
        <DialogContent className="bg-white border-zinc-200 text-zinc-950 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wrench className="h-5 w-5 text-zinc-900" />
              Pre-Trip Vehicle Safety Inspection
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Verify roadworthiness items before operating the bus.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportInspection} className="space-y-4 py-2 text-xs">
            {/* Vehicle Details Banner */}
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-500 font-mono text-[11px] block">Assigned Fleet Vehicle</span>
                <span className="font-semibold text-zinc-900">{assignedData?.vehicle?.registrationNo || "School Bus"}</span>
                <span className="text-zinc-500 ml-1.5 font-mono text-[11px]">({assignedData?.vehicle?.model || "Tata Starbus"})</span>
              </div>
              <Badge variant="outline" className="border-zinc-300 font-mono text-[10px] text-zinc-700">
                {assignedData?.vehicle?.capacity || 40} Seats
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-zinc-700">Odometer (km)</Label>
                <Input
                  type="number"
                  value={inspectionForm.odometerReading}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, odometerReading: Number(e.target.value) })}
                  className="border-zinc-300 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-700">Fuel Added (L)</Label>
                <Input
                  type="number"
                  placeholder="Liters"
                  value={inspectionForm.fuelLiters}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, fuelLiters: Number(e.target.value) })}
                  className="border-zinc-300 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-700">Fuel Cost (₹)</Label>
                <Input
                  type="number"
                  placeholder="Cost in ₹"
                  value={inspectionForm.fuelCost}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, fuelCost: Number(e.target.value) })}
                  className="border-zinc-300 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <Label className="font-mono text-zinc-500 uppercase text-[11px]">Roadworthiness Checklist</Label>

              <div className="space-y-1.5">
                {[
                  { key: "engineOilCheck", label: "Engine Oil & Coolant Level" },
                  { key: "tirePressureCheck", label: "Tire Pressure & Tread Condition" },
                  { key: "brakesCheck", label: "Foot Brakes & Handbrake Function" },
                  { key: "lightsCheck", label: "Headlights & Turn Signal Indicators" },
                  { key: "emergencyDoorCheck", label: "Emergency Exit Door Operable" },
                  { key: "firstAidKitCheck", label: "First Aid Kit & Fire Extinguisher Intact" },
                  { key: "cleanlinessCheck", label: "Bus Interior & Mirrors Sanitized" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200"
                  >
                    <span className="text-xs text-zinc-800">{item.label}</span>
                    <Switch
                      checked={(inspectionForm as any)[item.key]}
                      onCheckedChange={(checked) =>
                        setInspectionForm({ ...inspectionForm, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-zinc-700">Driver Notes / Observations</Label>
              <Textarea
                placeholder="E.g. Front wipers verified, washer fluid topped up."
                value={inspectionForm.notes}
                onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                className="border-zinc-300 text-xs min-h-[60px]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInspectionOpen(false)}
                className="border-zinc-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingInspection}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold"
              >
                {submittingInspection ? "Saving..." : "Save Checklist"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
