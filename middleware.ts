import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith("/dashboard");
};

const isAuthRoute = (pathname: string) => {
  return pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/auth-error");
};

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not set in environment variables");
    return NextResponse.next();
  }

  const token = await getToken({ 
    req, 
    secret,
  });
  
  const pathname = req.nextUrl.pathname;

  // If user is authenticated and tries to access auth routes, redirect to dashboard
  if (token && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!token && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
