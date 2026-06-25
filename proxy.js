import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { securityHeaders } from "@/lib/security";

const publicRoutes = [
  "/",
  "/about",
  "/services",
  "/pricing",
  "/case-studies",
  "/blog",
  "/resources",
  "/contact",
  "/free-audit",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const authRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isApiRoute) {
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (isAuthRoute && isLoggedIn) {
    const redirectUrl =
      session.user.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect admin away from client dashboard root
  if (isDashboardRoute && isLoggedIn && session.user.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (!isPublicRoute && !isLoggedIn && !isAdminRoute && !isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};