"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, TicketInput } from "@/lib/schema";
import { createTicketAction } from "@/lib/actions/ticket";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function TicketForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  async function onSubmit(data: TicketInput) {
    const res = await createTicketAction(data);
    if (res?.success) {
      reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border p-4 rounded mb-4">
      <div>
        <Label>Title</Label>
        <Input {...register("title")} />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <Label>Description</Label>
        <Input {...register("description")} />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>
      <Button type="submit">Create Ticket</Button>
    </form>
  );
}
