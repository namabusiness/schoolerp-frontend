"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, CreditCard, Sparkles, Building2 } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    priceMonthly: "$99",
    priceAnnual: "$990",
    description: "Essential operations for small academies and tutoring centers.",
    studentLimit: "Up to 300 Students",
    staffLimit: "Up to 30 Faculty",
    modules: [
      "Academics Setup & Timetable",
      "Daily Attendance & Roll Call",
      "Fees & Billing Collection",
      "Direct Communication & Notices",
    ],
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    priceMonthly: "$199",
    priceAnnual: "$1,990",
    description: "Full academic lifecycle for growing schools and colleges.",
    studentLimit: "Up to 1,000 Students",
    staffLimit: "Up to 80 Faculty",
    modules: [
      "Everything in Basic",
      "Complete Admission Pipeline",
      "Homework & Submissions",
      "Examinations & Report Cards",
      "Library Circulation & Fines",
      "Staff & HR Leave Management",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    priceMonthly: "$299",
    priceAnnual: "$2,990",
    description: "Expanded campus operations with transport and asset management.",
    studentLimit: "Up to 2,500 Students",
    staffLimit: "Up to 200 Faculty",
    modules: [
      "Everything in Standard",
      "Transport Fleet & Trip Tracking",
      "Inventory & Asset Register",
      "Campus Events & Certificates",
      "Student Health & Incident Logging",
      "Bonafide & TC Document Generation",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: "$399",
    priceAnnual: "$3,990",
    description: "Uncapped institution governance with all 30 flows and priority SLAs.",
    studentLimit: "Unlimited Students",
    staffLimit: "Unlimited Faculty",
    modules: [
      "Everything in Professional",
      "Student Promotion & Rollover Wizard",
      "Privileged Support Access Integration",
      "Central 360 Degree Student Hub",
      "Custom Subdomains & Multi-School Grouping",
      "Dedicated Supabase Vault & Redis Cache",
    ],
    popular: false,
  },
];

export default function SubscriptionsPlansPage() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("monthly");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Subscription & Plan Flow</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            FLOW #6: BASIC, STANDARD, PROFESSIONAL & ENTERPRISE TIERS WITH LIMIT ENFORCEMENT
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              billingCycle === "monthly" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              billingCycle === "annual" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col justify-between bg-zinc-900/60 border-zinc-800 ${
              plan.popular ? "border-zinc-500 shadow-2xl relative" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="contrast" className="text-[10px] tracking-wider uppercase py-0.5 px-3">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{plan.name} Tier</div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold text-white">
                  {billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {billingCycle === "monthly" ? "/month" : "/year"}
                </span>
              </div>
              <CardDescription className="text-xs text-zinc-400 mt-2 min-h-[36px]">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-1">
              <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 space-y-1">
                <div>• {plan.studentLimit}</div>
                <div>• {plan.staffLimit}</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="text-[10px] font-mono uppercase text-zinc-400">Included Modules</div>
                {plan.modules.map((mod) => (
                  <div key={mod} className="flex items-start gap-2 text-xs text-zinc-300">
                    <Check className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-4 border-t border-zinc-800">
              <Button
                variant={plan.popular ? "default" : "outline"}
                size="sm"
                className={`w-full text-xs font-semibold ${
                  plan.popular
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-100"
                }`}
              >
                Assign Plan to School
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
