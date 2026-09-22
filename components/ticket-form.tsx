"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, TicketInput } from "@/lib/schema";
import { createTicketAction } from "@/lib/actions/ticket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusCircle, Send, AlertTriangle, ShieldX } from "lucide-react";

interface TicketFormProps {
  userRole?: string;
}

export function TicketForm({ userRole }: TicketFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  const selectedPriority = watch("priority");

  const isGuest = userRole === "GUEST";

  function onSubmit(data: TicketInput) {
    if (isGuest) {
      toast.error("Permission denied", {
        description: "GUEST role is not allowed to create tickets.",
      });
      return;
    }

    startTransition(async () => {
      const res = await createTicketAction(data);
      if (res?.success) {
        toast.success("Ticket Created!", {
          description: "A confirmation email has been logged via Resend.",
        });
        reset({ priority: "MEDIUM" });
        setIsOpen(false);
        router.refresh();
      } else if (res?.error) {
        toast.error("Failed to create ticket", {
          description: res.error,
        });
      }
    });
  }

  if (isGuest) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300 flex items-center gap-2 mb-6">
        <ShieldX className="size-4 shrink-0 text-amber-400" />
        <span>You are logged in as <strong>GUEST</strong>. Ticket creation is restricted to Member and Admin roles.</span>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <PlusCircle className="size-4 text-indigo-400" /> Create New Support Ticket
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit an issue ticket to trigger automated notification dispatches
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs"
        >
          {isOpen ? "Cancel" : "New Ticket"}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4 pt-4 border-t border-slate-800/80">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-slate-300">Ticket Title</Label>
              <Input
                {...register("title")}
                placeholder="e.g., Cannot access staging deployment database"
                className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:border-indigo-500"
              />
              {errors.title && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="size-3" /> {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-slate-300">Detailed Description</Label>
              <Input
                {...register("description")}
                placeholder="Provide details about the issue or task requirement..."
                className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:border-indigo-500"
              />
              {errors.description && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="size-3" /> {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-slate-300 block">Priority Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => {
                  const selected = selectedPriority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setValue("priority", p)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                        selected
                          ? p === "HIGH"
                            ? "bg-red-500/20 border-red-500/50 text-red-300"
                            : p === "MEDIUM"
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                            : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium gap-2 shadow-md shadow-indigo-600/20"
            >
              {isPending ? (
                <>
                  <span className="size-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-3.5" /> Submit Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

