"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ticketSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createTicketAction(input: unknown) {
  const session = await getSession();
  if (!session || session.role === "GUEST") return { error: "Not allowed" };

  const parsed = ticketSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid data" };

  const ticket = await db.ticket.create({
    data: { ...parsed.data, userId: session.userId },
  });

  const user = await db.user.findUnique({ where: { id: session.userId } });

  try {
    const emailRes = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user!.email,
      subject: `Ticket Created: ${ticket.title}`,
      html: `<p>Your ticket "${ticket.title}" was created with priority ${ticket.priority}.</p>`,
    });

    await db.emailLog.create({
      data: {
        resendId: emailRes.data?.id,
        status: "SENT",
        recipient: user!.email,
        subject: `Ticket Created: ${ticket.title}`,
        userId: user!.id,
      },
    });
  } catch {
    await db.emailLog.create({
      data: {
        status: "FAILED",
        recipient: user!.email,
        subject: `Ticket Created: ${ticket.title}`,
        userId: user!.id,
      },
    });
  }

  revalidatePath("/dashboard");
  return { success: true };
}