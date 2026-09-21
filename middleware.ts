import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const raw = req.cookies.get("fst_session")?.value;
  const session = raw ? JSON.parse(raw) : null;

  const path = req.nextUrl.pathname;

  if (path.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/dashboard/admin") && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
