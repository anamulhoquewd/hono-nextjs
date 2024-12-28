import { NextRequest, NextResponse } from "next/server";
// import { jwtDecode } from "jwt-decode";
import { decode } from "hono/jwt";

const PUBLIC_ROUTES = [
  "/",
  "/auth/log-in",
  "/auth/forgot-password",
  "/auth/register",
];

const MANAGER_ROUTES = [
  "/dashboard/orders",
  "/dashboard/customers",
  "/profile",
];

const DELIVERY_MAN_ROUTES = ["/dashboard/orders", "/profile"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("auth_token");
  const token = cookie?.value;

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/auth/reset-password");

  try {
    if (token) {
      const { payload }: any = decode(token);
      if (payload.exp * 1000 < Date.now()) {
        // Delete expired token cookie

        const response = NextResponse.redirect(
          new URL("/auth/log-in", req.url)
        );
        response.cookies.set("auth_token", "", {
          maxAge: -1, // Expire immediately
          path: "/",
        });
        return response;
      }

      // Redirect logged-in users from login page to dashboard
      if (pathname === "/auth/log-in") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Role-based route restrictions
      const { role } = payload;

      if (role === "admin") {
        if (pathname === "/") {
          return NextResponse.rewrite(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
      } else if (role === "manager" && !MANAGER_ROUTES.includes(pathname)) {
        if (pathname === "/") {
          return NextResponse.rewrite(new URL("/dashboard/orders", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard/orders", req.url));
      } else if (
        role === "delivery_man" &&
        !DELIVERY_MAN_ROUTES.includes(pathname)
      ) {
        if (pathname === "/") {
          return NextResponse.rewrite(new URL("/dashboard/orders", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard/orders", req.url));
      }
    }

    if (!token) {
      // Redirect unauthenticated users
      if (!isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/log-in", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/log-in", req.url));
  }
}

export const config = {
  matcher: [
    // Matches all routes except API and static files (e.g., .css, .js)
    "/((?!api|_next|.*\\.[\\w]+$).*)",
    "/", // Match the root route
  ],
};
