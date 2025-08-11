import { NextResponse, NextRequest } from "next/server";

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
    const validationResponse = await fetch(
      `${process.env.BACKEND_URL}/api/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );
    if (!validationResponse.ok) {
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
    redirectResponse.cookies.delete("authToken");
    return redirectResponse;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
