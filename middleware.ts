import { Role } from "./lib/types/users.types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  // Get the access token from cookies
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;
  const publicRoutes = ["/", "/unauthorized"];

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const decoded = jwt.decode(token) as { role?: Role } | null;

    if (!decoded || typeof decoded === "string" || !decoded.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = decoded.role;
    console.log("Requested path:", pathname);

    if (pathname === "/login" || pathname === "/")
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));

    if (pathname.startsWith("/admin") && role !== Role.ADMIN) {
      console.log(`Role ${role} not admin, redirecting to /${role}/dashboard`);
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }
    if (pathname.startsWith("/teacher") && role !== Role.TEACHER) {
      console.log(
        `Role ${role} not teacher, redirecting to /${role}/dashboard`
      );
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }
    if (pathname.startsWith("/student") && role !== Role.STUDENT) {
      console.log(
        `Role ${role} not student, redirecting to /${role}/dashboard`
      );
      return NextResponse.redirect(
        new URL(`/${role.toLowerCase()}/dashboard`, req.url)
      );
    }

    console.log("Access granted, proceeding to next");
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
