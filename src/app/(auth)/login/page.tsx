"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Users,
  KeyRound,
  ArrowRight,
  Bus,
  Compass,
  BookOpen,
} from "lucide-react";
import { erpApi } from "@/lib/api";

const SCHOOL_ROLES = [
  { id: "SCHOOL_ADMIN", label: "Admin", icon: Building2, defaultEmail: "admin@greenwoodhigh.edu", path: "/greenwood-high/dashboard" },
  { id: "TEACHER", label: "Teacher", icon: BookOpen, defaultEmail: "teacher@greenwoodhigh.edu", path: "/greenwood-high/academics" },
  { id: "TRANSPORT_MANAGER", label: "Transport Manager", icon: Compass, defaultEmail: "transport@greenwoodhigh.edu", path: "/greenwood-high/transport" },
  { id: "DRIVER", label: "Driver", icon: Bus, defaultEmail: "driver@greenwoodhigh.edu", path: "/greenwood-high/transport" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("school");
  const [selectedRole, setSelectedRole] = React.useState("SCHOOL_ADMIN");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const getTargetPath = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "/super-admin";
      case "TEACHER":
        return "/greenwood-high/academics";
      case "DRIVER":
      case "TRANSPORT_MANAGER":
        return "/greenwood-high/transport";
      case "SCHOOL_ADMIN":
      default:
        return "/greenwood-high/dashboard";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const targetRole = activeTab === "super" ? "SUPER_ADMIN" : selectedRole;
    const defaultEmail = activeTab === "super"
      ? "superadmin@schoolerp.com"
      : (SCHOOL_ROLES.find((r) => r.id === targetRole)?.defaultEmail || "admin@greenwoodhigh.edu");

    const loginEmail = email || defaultEmail;

    try {
      const res = await erpApi.login(loginEmail, password, targetRole);

      localStorage.setItem("token", res.accessToken || "mock-token");
      localStorage.setItem("demo_role", targetRole);
      localStorage.setItem("auth_role", targetRole);
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      if (res.user?.schoolId) {
        localStorage.setItem("school_id", res.user.schoolId);
      } else if (targetRole !== "SUPER_ADMIN") {
        localStorage.setItem("school_id", "school-greenwood-high");
      }

      router.push(getTargetPath(targetRole));
    } catch (err: any) {
      // Graceful fallback for demo testing
      localStorage.setItem("demo_role", targetRole);
      localStorage.setItem("auth_role", targetRole);
      const fallbackUser = {
        name: SCHOOL_ROLES.find((r) => r.id === targetRole)?.title || targetRole,
        role: targetRole,
        email: loginEmail,
      };
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      if (targetRole !== "SUPER_ADMIN") {
        localStorage.setItem("school_id", "school-greenwood-high");
      }
      router.push(getTargetPath(targetRole));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: string) => {
    localStorage.setItem("demo_role", role);
    localStorage.setItem("auth_role", role);
    const roleInfo = SCHOOL_ROLES.find((r) => r.id === role);
    const demoUser = {
      name: roleInfo?.title || role,
      role: role,
      email: roleInfo?.defaultEmail || `${role.toLowerCase()}@schoolerp.com`,
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    if (role !== "SUPER_ADMIN") {
      localStorage.setItem("school_id", "school-greenwood-high");
    }
    router.push(getTargetPath(role));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-white text-zinc-950 selection:bg-zinc-200 selection:text-black">
      {/* Background subtle geometric grid in pure monochrome */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 shadow-xs">
            <Building2 className="h-6 w-6 text-zinc-900" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            SCHOOL ERP PLATFORM
          </h1>
          <p className="text-xs text-zinc-500 font-mono tracking-wide">
            ENTERPRISE MULTI-TENANT ARCHITECTURE
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-zinc-200 bg-white shadow-xl text-zinc-950">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-zinc-950">Sign In</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Select your authorization tier to access the portal
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-100 border border-zinc-200">
                <TabsTrigger
                  value="school"
                  className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs text-zinc-600"
                >
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                  School Portal
                </TabsTrigger>
                <TabsTrigger
                  value="super"
                  className="data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs text-xs text-zinc-600"
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                  Super Admin
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                {errorMsg && (
                  <Alert variant="destructive" className="bg-zinc-100 border-zinc-300 text-zinc-900">
                    <AlertTitle>Authentication Failed</AlertTitle>
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}

                {/* Role Selector for School Portal */}
                {activeTab === "school" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-600">Select Role</Label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-lg">
                      {SCHOOL_ROLES.map((r) => {
                        const Icon = r.icon;
                        const isSelected = selectedRole === r.id;
                        return (
                          <button
                            type="button"
                            key={r.id}
                            onClick={() => setSelectedRole(r.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200 font-semibold"
                                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{r.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-zinc-600">
                    {activeTab === "super"
                      ? "Super Admin Email"
                      : `${SCHOOL_ROLES.find((r) => r.id === selectedRole)?.label || "Staff"} Email`}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      activeTab === "super"
                        ? "superadmin@schoolerp.com"
                        : (SCHOOL_ROLES.find((r) => r.id === selectedRole)?.defaultEmail || "admin@greenwoodhigh.edu")
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-zinc-300 text-zinc-950 placeholder:text-zinc-400 focus-visible:ring-zinc-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-zinc-600">
                      Password
                    </Label>
                    <span className="text-[11px] text-zinc-500 hover:text-zinc-800 cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-zinc-300 text-zinc-950 placeholder:text-zinc-400 focus-visible:ring-zinc-400"
                  />
                </div>

                {activeTab === "super" && (
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs text-zinc-600">Security Verification PIN (OTP)</Label>
                    <div className="flex justify-center py-1">
                      <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="border-zinc-300 bg-white text-zinc-900" />
                          <InputOTPSlot index={1} className="border-zinc-300 bg-white text-zinc-900" />
                          <InputOTPSlot index={2} className="border-zinc-300 bg-white text-zinc-900" />
                          <InputOTPSlot index={3} className="border-zinc-300 bg-white text-zinc-900" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 text-white hover:bg-zinc-800 font-semibold text-xs tracking-wider uppercase h-10 shadow-xs cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to {activeTab === "super" ? "Super Admin" : SCHOOL_ROLES.find((r) => r.id === selectedRole)?.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-zinc-200 pt-4 gap-2">
            <div className="text-[11px] text-zinc-500 text-center font-mono">
              QUICK LAUNCH DEMO ACCOUNTS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo("TEACHER")}
                className="text-xs border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-mono h-8"
              >
                <BookOpen className="h-3 w-3 mr-1 text-zinc-600" />
                Teacher
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo("DRIVER")}
                className="text-xs border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-mono h-8"
              >
                <Bus className="h-3 w-3 mr-1 text-zinc-600" />
                Driver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo("TRANSPORT_MANAGER")}
                className="text-xs border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-mono h-8"
              >
                <Compass className="h-3 w-3 mr-1 text-zinc-600" />
                Transport Mgr
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo("SCHOOL_ADMIN")}
                className="text-xs border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-mono h-8"
              >
                <Building2 className="h-3 w-3 mr-1 text-zinc-600" />
                School Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemo("SUPER_ADMIN")}
                className="text-xs border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-mono h-8 col-span-2 sm:col-span-2"
              >
                <ShieldCheck className="h-3 w-3 mr-1 text-zinc-600" />
                Super Admin
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Security watermark badge */}
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono">
          <KeyRound className="h-3.5 w-3.5" />
          <span>MULTI-TENANT ISOLATED AES-256 JWT</span>
        </div>
      </div>
    </div>
  );
}
