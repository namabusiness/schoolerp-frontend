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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Plus, MapPin, Users, Award } from "lucide-react";

const DEMO_EVENTS = [
  {
    id: "ev-1",
    title: "Inter-School STEM & Robotics Championship 2026",
    venue: "Main Campus Auditorium & Lab Complex",
    date: "2026-10-05",
    participants: 140,
    classes: "Grades 8, 9, 10, 11, 12",
    status: "REGISTRATION_OPEN",
  },
  {
    id: "ev-2",
    title: "Annual Track & Field Athletic Meet",
    venue: "Greenwood Olympic Sports Grounds",
    date: "2026-10-18",
    participants: 320,
    classes: "All Grades (1-12)",
    status: "REGISTRATION_OPEN",
  },
  {
    id: "ev-3",
    title: "National Mathematics Olympiad Prelims",
    venue: "Examination Halls A & B",
    date: "2026-09-02",
    participants: 95,
    classes: "Grades 9 & 10",
    status: "COMPLETED",
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Events & Competitions Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #21: EVENT DETAILS, VENUES, PARTICIPANT REGISTRATION & CERTIFICATES AWARD
          </p>
        </div>

        <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Schedule Campus Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_EVENTS.map((ev) => (
          <Card key={ev.id} className="bg-zinc-900/60 border-zinc-800 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={ev.status === "COMPLETED" ? "contrast" : "outline"} className="text-[10px]">
                  {ev.status}
                </Badge>
                <span className="font-mono text-xs text-zinc-400">{ev.date}</span>
              </div>
              <CardTitle className="text-base font-semibold text-white mt-2">{ev.title}</CardTitle>
              <CardDescription className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-zinc-500" /> {ev.venue}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between border-t border-zinc-800/80 pt-2 text-zinc-400">
                <span>Eligible Classes:</span>
                <span className="text-white font-medium">{ev.classes}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Registered Students:</span>
                <span className="text-white font-mono font-bold">{ev.participants} Participants</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
