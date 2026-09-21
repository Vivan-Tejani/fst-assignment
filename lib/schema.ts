import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type TicketInput = z.infer<typeof ticketSchema>;
