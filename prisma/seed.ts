import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const admin = await db.role.upsert({ where: { name: "ADMIN" }, update: {}, create: { name: "ADMIN" } });
  const member = await db.role.upsert({ where: { name: "MEMBER" }, update: {}, create: { name: "MEMBER" } });
  await db.role.upsert({ where: { name: "GUEST" }, update: {}, create: { name: "GUEST" } });

  const pass = await bcrypt.hash("password123", 10);

  const u1 = await db.user.upsert({
    where: { email: "admin@helpdesk.dev" },
    update: {},
    create: { email: "admin@helpdesk.dev", password: pass, name: "Admin User", roleId: admin.id },
  });

  const u2 = await db.user.upsert({
    where: { email: "member@helpdesk.dev" },
    update: {},
    create: { email: "member@helpdesk.dev", password: pass, name: "Member User", roleId: member.id },
  });

  await db.ticket.createMany({
    data: [
      { title: "Login issue", description: "Cannot log in", status: "OPEN", priority: "HIGH", userId: u2.id },
      { title: "Feature request", description: "Add dark mode", status: "IN_PROGRESS", priority: "LOW", userId: u1.id },
    ],
  });
}

main().finally(() => db.$disconnect());