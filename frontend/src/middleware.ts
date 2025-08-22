import { NextResponse, NextRequest } from "next/server";
import { HttpResponse } from "./types/httpResponse";
import { User } from "./types/user";

const protectedRoutes = ["/home"];
const authRoutes = ["/auth/login", "/auth/signup"];
const publicRoutes = ["/", "/about", "/contact"];

export async function middleware(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  const redirectResponse = NextResponse.redirect(loginUrl);
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (authToken === undefined) {
    if (isProtectedRoute) {
      return redirectResponse;
    } else if (isAuthRoute) {
      return NextResponse.next();
    }
  }
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
    });
    const validationResponse: HttpResponse<User> = await response.json();
    if (!validationResponse.success) {
      redirectResponse.cookies.delete("authToken");
      return redirectResponse;
    } else {
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/home", request.url));
      } else {
        return NextResponse.next();
      }
    }
  } catch (e) {
    console.log("Error during authentication check:", e);
    redirectResponse.cookies.delete("authToken");
    return redirectResponse;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
