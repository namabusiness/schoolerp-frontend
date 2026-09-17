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
import { Bus, Plus, MapPin, Clock, Users, Play, CheckCircle2, ShieldCheck } from "lucide-react";

const ROUTES = [
  {
    id: "route-1",
    name: "Route 101 - North Valley Express",
    vehicle: "BUS-GWH-01 (Volvo 45-Seater)",
    driver: "Robert Martinez (+1 555-839-1122)",
    studentsCount: 38,
    capacity: 45,
    stops: [
      { name: "Evergreen Terrace Square", pickup: "07:20 AM", drop: "03:40 PM", students: 12 },
      { name: "Oakridge High Street Junction", pickup: "07:35 AM", drop: "03:55 PM", students: 15 },
      { name: "West Valley Boulevard", pickup: "07:50 AM", drop: "04:10 PM", students: 11 },
      { name: "Greenwood High Campus Main Gate", pickup: "08:15 AM", drop: "03:20 PM", students: 0 },
    ],
    status: "IN_TRANSIT",
  },
  {
    id: "route-2",
    name: "Route 102 - South Metro Corridor",
    vehicle: "BUS-GWH-02 (Tata Marcopolo 36-Seater)",
    driver: "Samir Khan (+1 555-449-0099)",
    studentsCount: 30,
    capacity: 36,
    stops: [
      { name: "Metro Station Exit 3", pickup: "07:30 AM", drop: "03:45 PM", students: 18 },
      { name: "Parkside Central Garden", pickup: "07:45 AM", drop: "04:00 PM", students: 12 },
      { name: "Greenwood High Campus Main Gate", pickup: "08:10 AM", drop: "03:20 PM", students: 0 },
    ],
    status: "COMPLETED",
  },
];

export default function TransportPage() {
  const [activeTrip, setActiveTrip] = React.useState("Route 101 Morning Pickup");
  const [tripStarted, setTripStarted] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Transport & Fleet Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #16: VEHICLE FLEET, DRIVERS, ROUTES, STOPS, TRIP LOGS & LIVE PASSENGER ROSTER
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tripStarted ? (
            <Badge variant="contrast" className="text-xs gap-1 py-1 px-3 animate-pulse">
              <Bus className="h-3.5 w-3.5" /> MORNING TRIP DISPATCHED • GPS TRACKING ACTIVE
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => setTripStarted(true)}
              className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
            >
              <Play className="h-3.5 w-3.5 mr-1" />
              Start Morning Trip
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROUTES.map((route) => (
          <Card key={route.id} className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">{route.name}</CardTitle>
                <Badge variant={route.status === "IN_TRANSIT" ? "contrast" : "outline"} className="text-[10px]">
                  {route.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-zinc-400">
                {route.vehicle} • {route.driver}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono p-2 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Passenger Roster Capacity:</span>
                <span className="font-bold text-white">{route.studentsCount} / {route.capacity} Students</span>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-mono text-zinc-500 uppercase">Stop-by-Stop Itinerary</div>
                <div className="space-y-2 pl-2 border-l-2 border-zinc-800">
                  {route.stops.map((stop, idx) => (
                    <div key={stop.name} className="relative pl-3 text-xs">
                      <div className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-white" />
                      <div className="font-medium text-white">{stop.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        Pickup: {stop.pickup} • Drop: {stop.drop} • {stop.students} Passengers
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
