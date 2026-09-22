"use client";

import { useTicketStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Layers, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function TicketFilters() {
  const { filter, setFilter } = useTicketStore();

  const options = [
    { label: "All Tickets", value: "ALL", icon: Layers },
    { label: "Open", value: "OPEN", icon: AlertCircle },
    { label: "In Progress", value: "IN_PROGRESS", icon: Clock },
    { label: "Resolved", value: "RESOLVED", icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = filter === opt.value;
        return (
          <Button
            key={opt.value}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(opt.value)}
            className={`transition-all rounded-lg text-xs font-medium gap-1.5 ${
              isActive
                ? "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-sm"
                : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Icon className="size-3.5" />
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
