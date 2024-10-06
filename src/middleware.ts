import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/", "/auth/oauth", "/dashboard"];

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (req.nextUrl.pathname.startsWith("/auth/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/auth/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Only apply authMiddleware to protected routes

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // redirect to the dashboard (absolute url) if the user is authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  const authMiddleware = withAuth({
    pages: {
      signIn: "/auth/login",
      newUser: `/auth/register`,
    },
  });

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    return authMiddleware(req as NextRequestWithAuth, event);
  }

  // For all other routes, continue without authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/register", "/auth/oauth", "/dashboard"],
};
