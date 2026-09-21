import { TicketForm } from "@/components/ticket-form";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const session = await getSession();
  const tickets = await db.ticket.findMany({ include: { user: true } });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Tickets (Role: {session?.role})</h1>
        <form action={logoutAction}><Button variant="outline">Logout</Button></form>
      </div>
      <TicketForm />
      <ul className="space-y-2">
        {tickets.map(t => (
          <li key={t.id} className="border p-3 rounded">
            <b>{t.title}</b> — {t.status} — {t.priority} (by {t.user.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
