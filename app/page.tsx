"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LifeBuoy, Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Sparkles, UserCheck } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    toast.info(`Filled credentials for ${demoEmail}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        toast.error(res.error, {
          description: "Please check your email and password.",
        });
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-12">
      {/* Background glowing ambient elements */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Header Branding */}
        <div className="mb-8 text-center">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30 backdrop-blur-xl mb-4 shadow-lg shadow-indigo-500/10">
            <LifeBuoy className="size-7 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Helpdesk Portal</h1>
          <p className="mt-2 text-sm text-slate-400">
            Support ticket management with role-based access
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@helpdesk.dev"
                  className="pl-10 h-11 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-500/40 active:scale-[0.99]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo Fill Pills */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-3">
              <Sparkles className="size-3.5 text-amber-400" /> Quick Demo Accounts (One-Click)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@helpdesk.dev")}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-900/40 hover:border-indigo-500/40 transition-all text-left group"
              >
                <span>
                  <strong className="block text-indigo-200">Admin</strong>
                  <span className="text-[10px] text-slate-400">Full Access</span>
                </span>
                <UserCheck className="size-4 text-indigo-400 opacity-60 group-hover:opacity-100" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("member@helpdesk.dev")}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:bg-slate-800/80 transition-all text-left group"
              >
                <span>
                  <strong className="block text-slate-200">Member</strong>
                  <span className="text-[10px] text-slate-400">Standard Access</span>
                </span>
                <UserCheck className="size-4 text-slate-400 opacity-60 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Built with Next.js 16 • Server Actions • Prisma • SQLite
        </p>
      </div>
    </div>
  );
}

