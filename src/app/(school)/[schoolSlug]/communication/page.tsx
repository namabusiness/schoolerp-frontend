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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Megaphone, Plus, Send, CheckCircle2, MessageSquare, Smartphone, Mail } from "lucide-react";

const DEMO_NOTICES = [
  {
    id: "not-1",
    title: "Annual STEM & Science Innovation Fair 2026",
    audience: "Entire School & Parents",
    channels: ["In-App", "Email", "WhatsApp"],
    publishedAt: "2026-09-15 09:00",
    author: "Dr. Eleanor Vance (Principal)",
    content: "We invite all students from Grades 6-12 to register project proposals for the upcoming Innovation Fair. Lab spaces and mentor sessions commence next Monday.",
    readRate: "94% Read (1,334 Parents)",
  },
  {
    id: "not-2",
    title: "Midterm Examination Schedules Released",
    audience: "Grade 10 & Parents",
    channels: ["In-App", "SMS", "Email"],
    publishedAt: "2026-09-14 11:30",
    author: "Academic Administration",
    content: "Midterm examination dates have been confirmed for Oct 12-22. Hall tickets and seating matrices are accessible via student portals.",
    readRate: "99% Read (348 Parents)",
  },
];

export default function CommunicationPage() {
  const [notices, setNotices] = React.useState(DEMO_NOTICES);
  const [isComposeOpen, setIsComposeOpen] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [audience, setAudience] = React.useState("Entire School");
  const [content, setContent] = React.useState("");
  const [sendInApp, setSendInApp] = React.useState(true);
  const [sendEmail, setSendEmail] = React.useState(true);
  const [sendSMS, setSendSMS] = React.useState(false);
  const [sendWhatsApp, setSendWhatsApp] = React.useState(true);
  const [publishedAlert, setPublishedAlert] = React.useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const channels = [];
    if (sendInApp) channels.push("In-App");
    if (sendEmail) channels.push("Email");
    if (sendSMS) channels.push("SMS");
    if (sendWhatsApp) channels.push("WhatsApp");

    const created = {
      id: `not-${Date.now()}`,
      title,
      audience,
      channels,
      publishedAt: "Just now",
      author: "School Administration",
      content,
      readRate: "Dispatched to Gateway",
    };

    setNotices([created, ...notices]);
    setIsComposeOpen(false);
    setTitle("");
    setContent("");
    setPublishedAlert(true);
    setTimeout(() => setPublishedAlert(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Communication Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #18: ANNOUNCEMENTS, AUDIENCE TARGETING & MULTI-CHANNEL DISPATCH (PUSH, EMAIL, SMS, WHATSAPP)
          </p>
        </div>

        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Broadcast Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-base text-white">Broadcast Announcement / Alert</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Dispatches high-priority notices across authorized communication channels.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePublish} className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Notice Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Target Audience Scope</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="Entire School">Entire School (All Students, Staff & Parents)</SelectItem>
                    <SelectItem value="Grade 10 & Parents">Grade 10 & Parents</SelectItem>
                    <SelectItem value="Grade 9 & Parents">Grade 9 & Parents</SelectItem>
                    <SelectItem value="Teaching Faculty Only">Teaching Faculty Only</SelectItem>
                    <SelectItem value="Transport Passengers Only">Transport Passengers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Message Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                  placeholder="Draft announcement details here..."
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="border-t border-zinc-800 pt-3 space-y-2">
                <Label className="text-xs text-zinc-400">Dispatch Gateways</Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-zinc-900">
                    <Checkbox checked={sendInApp} onCheckedChange={(v) => setSendInApp(Boolean(v))} />
                    <span>In-App Mobile Push</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-zinc-900">
                    <Checkbox checked={sendEmail} onCheckedChange={(v) => setSendEmail(Boolean(v))} />
                    <span>Parent Email</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-zinc-900">
                    <Checkbox checked={sendSMS} onCheckedChange={(v) => setSendSMS(Boolean(v))} />
                    <span>SMS Gateway</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border border-zinc-800 bg-zinc-900">
                    <Checkbox checked={sendWhatsApp} onCheckedChange={(v) => setSendWhatsApp(Boolean(v))} />
                    <span>WhatsApp Business</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsComposeOpen(false)} className="border-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200 font-semibold">
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Dispatch Broadcast
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {publishedAlert && (
        <div className="p-3 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-white" />
            <span>Notice broadcast successfully published across active gateways.</span>
          </div>
          <Badge variant="contrast" className="text-[10px]">DELIVERED</Badge>
        </div>
      )}

      {/* Notice Board Cards */}
      <div className="space-y-4">
        {notices.map((n) => (
          <Card key={n.id} className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold text-white">{n.title}</CardTitle>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {n.channels.map((ch) => (
                    <Badge key={ch} variant="outline" className="text-[10px] font-mono border-zinc-700">
                      {ch}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardDescription className="text-xs text-zinc-400 flex items-center gap-2">
                <span>Audience: {n.audience}</span>
                <span>•</span>
                <span>By {n.author}</span>
                <span>•</span>
                <span>{n.publishedAt}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-800/80">
                {n.content}
              </p>
              <div className="flex justify-between items-center text-[11px] text-zinc-500 font-mono">
                <span>Delivery & Read Status:</span>
                <span className="text-zinc-300 font-medium">{n.readRate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
