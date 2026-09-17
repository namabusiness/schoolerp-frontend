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
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Save, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";

export default function SchoolSettingsPage() {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">School Profile & Configuration</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            CAMPUS IDENTITY, CONTACT DETAILS, TENANT SLUG & WHITE-LABEL BRANDING
          </p>
        </div>

        {saved && (
          <Badge variant="contrast" className="text-xs gap-1 py-1 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" /> Institution Settings Updated
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">Institutional Identity</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Details rendered on printable report cards, invoices, receipts, and certificates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Official Institution Name</Label>
                <Input defaultValue="Greenwood High International" className="bg-zinc-950 border-zinc-800 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Affiliation / School Code</Label>
                <Input defaultValue="GWH-2026" className="bg-zinc-950 border-zinc-800 text-white font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Primary Contact Email</Label>
                <Input defaultValue="office@greenwoodhigh.edu" className="bg-zinc-950 border-zinc-800 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Official Phone Line</Label>
                <Input defaultValue="+1 (555) 019-2834" className="bg-zinc-950 border-zinc-800 text-white font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Subdomain / Tenant Slug</Label>
                <Input defaultValue="greenwood-high" disabled className="bg-zinc-950/50 border-zinc-800 text-zinc-400 font-mono" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-zinc-300">Official Campus Address</Label>
              <Input defaultValue="42 Academic Boulevard, Metro West" className="bg-zinc-950 border-zinc-800 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-white">Security & Multi-Tenant Isolation</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Database tenant isolation parameters verified by platform guards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex justify-between items-center font-mono">
              <span className="text-zinc-400">Tenant ID:</span>
              <span className="text-white">school-greenwood-high</span>
            </div>
            <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex justify-between items-center font-mono">
              <span className="text-zinc-400">Active Storage Vault:</span>
              <span className="text-white">supabase://school-erp-vault/school-greenwood-high/</span>
            </div>
            <div className="p-3 rounded bg-zinc-950 border border-zinc-800 flex justify-between items-center font-mono">
              <span className="text-zinc-400">Enrolled Plan:</span>
              <Badge variant="contrast" className="text-[10px]">ENTERPRISE (ALL FLOWS UNLOCKED)</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
