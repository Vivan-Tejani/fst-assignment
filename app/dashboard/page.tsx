import { TicketForm } from "@/components/ticket-form";
import { TicketFilters } from "@/components/ticket-filters";
import { TicketList } from "@/components/ticket-list";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  LifeBuoy,
  LogOut,
  Shield,
  Ticket as TicketIcon,
  AlertCircle,
  Clock,
  CheckCircle2,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const currentUser = await db.user.findUnique({
    where: { id: session.userId },
    include: { role: true },
  });

  const tickets = await db.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const roleColors = {
    ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    MEMBER: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    GUEST: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  }[session.role as string] || "bg-slate-800 text-slate-300";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Helpdesk Dashboard
              </span>
              <p className="text-[11px] text-slate-400">Support Ticket Hub</p>
            </div>
          </div>

          {/* User Info & Logout Form */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="text-right">
                <div className="font-semibold text-slate-200">
                  {currentUser?.name || "Authenticated User"}
                </div>
                <div className="text-[10px] text-slate-400">{currentUser?.email}</div>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${roleColors}`}
              >
                <Shield className="size-3" />
                {session.role}
              </span>
            </div>

            {/* Logout button form (explicit type="submit" fixes Base UI button submission) */}
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-slate-800 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-slate-300 text-xs font-medium gap-1.5 transition-all"
              >
                <LogOut className="size-3.5" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Metrics Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Tickets</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <TicketIcon className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{totalCount}</span>
              <span className="text-xs text-slate-400">submitted</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Open</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <AlertCircle className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-indigo-400">{openCount}</span>
              <span className="text-xs text-slate-400">awaiting action</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400">{inProgressCount}</span>
              <span className="text-xs text-slate-400">active work</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Resolved</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400">{resolvedCount}</span>
              <span className="text-xs text-slate-400">completed</span>
            </div>
          </div>
        </section>

        {/* Ticket Action Panel (Form) */}
        <section>
          <TicketForm userRole={session.role} />
        </section>

        {/* Filter Controls & List */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
            <div>
              <h2 className="text-lg font-bold text-white">Tickets Overview</h2>
              <p className="text-xs text-slate-400">View and manage support tickets</p>
            </div>
            <TicketFilters />
          </div>

          <TicketList tickets={tickets} />
        </section>
      </main>
    </div>
  );
}

