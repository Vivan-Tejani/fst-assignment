"use client";

import { useTicketStore } from "@/lib/store";
import { Ticket, User } from "@prisma/client";
import { Ticket as TicketIcon, Clock, CheckCircle2, AlertCircle, User as UserIcon, Calendar, MessageSquare } from "lucide-react";

type TicketWithUser = Ticket & { user: User };

interface TicketListProps {
  tickets: TicketWithUser[];
}

export function TicketList({ tickets }: TicketListProps) {
  const { filter } = useTicketStore();

  const filteredTickets = tickets.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  if (filteredTickets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400 mb-3">
          <TicketIcon className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">No tickets found</h3>
        <p className="mt-1 text-xs text-slate-400">
          {filter === "ALL"
            ? "There are currently no tickets in the system."
            : `No tickets with status "${filter}".`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredTickets.map((ticket) => {
        const priorityColors = {
          HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
          MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        }[ticket.priority] || "bg-slate-800 text-slate-300 border-slate-700";

        const statusBadges = {
          OPEN: { label: "Open", icon: AlertCircle, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
          IN_PROGRESS: { label: "In Progress", icon: Clock, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
          RESOLVED: { label: "Resolved", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        }[ticket.status] || { label: ticket.status, icon: AlertCircle, color: "bg-slate-800 text-slate-300" };

        const StatusIcon = statusBadges.icon;

        return (
          <div
            key={ticket.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadges.color}`}
                >
                  <StatusIcon className="size-3" />
                  {statusBadges.label}
                </span>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityColors}`}
                >
                  {ticket.priority}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {ticket.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                {ticket.description}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <div className="size-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                  {ticket.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[120px]">{ticket.user.name}</span>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="size-3" />
                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
