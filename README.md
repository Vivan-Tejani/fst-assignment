# Helpdesk Ticketing System

A full-stack support ticketing app built with Next.js App Router, demonstrating RSC/Client Component architecture, role-based access control, Zustand client state, Zod-validated forms, Prisma/SQLite, and transactional email via Resend.

## Tech Stack

- **Framework:** Next.js 16 
- **UI:** shadcn/ui 
- **Client State:** Zustand
- **Forms/Validation:** React Hook Form + Zod
- **Database/ORM:** SQLite + Prisma
- **Auth:** Cookie-based session 
- **Email:** Resend + EmailLog tracking

## Features

- Login with hashed passwords, session stored in an HTTP-only cookie
- Role-based access control (ADMIN / MEMBER / GUEST) enforced in `middleware.ts`
- Dashboard listing all tickets 
- Create-ticket form using RHF + Zod validation
- Server Action creates the ticket, re-validates with Zod server-side, and revalidates the dashboard
- Email notification sent via Resend on ticket creation, with delivery status logged to `EmailLog` (SENT/FAILED)

## Data Models

- **Role** — ADMIN, MEMBER, GUEST
- **User** — belongs to a Role
- **Ticket** — belongs to a User (title, description, status, priority)
- **AuditLog** — action history per user
- **EmailLog** — email dispatch history, status tracking

## Setup

```bash
npm install --legacy-peer-deps
```

Create `.env`:
```
DATABASE_URL="file:./dev.db"
RESEND_API_KEY="your_resend_key"
```

Push schema and seed data:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

Run the app:
```bash
npm run dev
```

## Seeded Accounts

| Email | Password | Role |
|---|---|---|
| admin@helpdesk.dev | password123 | ADMIN |
| member@helpdesk.dev | password123 | MEMBER |

## Role Permissions

| Role | View Tickets | Create Ticket | Admin Page |
|---|---|---|---|
| ADMIN | Yes | Yes | Yes |
| MEMBER | Yes | Yes | No |
| GUEST | Yes | No | No |

## Project Structure

```
app/
  page.tsx              
  dashboard/page.tsx     
components/
  ticket-form.tsx        
lib/
  db.ts                  
  session.ts              
  store.ts                
  schema.ts              
  actions/
    auth.ts               
    ticket.ts              
prisma/
  schema.prisma
  seed.ts
middleware.ts            
```