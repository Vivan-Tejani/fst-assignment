import { cookies } from "next/headers";

const SESSION_COOKIE = "fst_session";

export async function createSession(userId: string, role: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify({ userId, role }), {
    httpOnly: true,
    path: "/",
  });
}

export async function getSession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  return raw ? JSON.parse(raw) : null;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}