import { NextResponse, NextRequest } from "next/server";
import { HttpResponse } from "./types/httpResponse";
import { User } from "./types/user";
import { logger } from "./utils/logger";

const protectedRoutes = ["/chat"];
const authRoutes = ["/auth/login", "/auth/signup", "/onboarding"];
const publicRoutes = ["/", "/about", "/contact"];

const API_BASE_URL = `${
	process.env.BACKEND_ENDPOINT || "http://localhost:3001/api"
}`;

export async function middleware(request: NextRequest) {
	const loginUrl = new URL("/auth/login", request.url);
	const redirectResponse = NextResponse.redirect(loginUrl);
	const { pathname } = request.nextUrl;
	const authToken = request.cookies.get("authToken")?.value;

	const isPublicRoute = publicRoutes.includes(pathname);
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
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
		logger.log("BACKEND_ENDPOINT ", process.env.BACKEND_ENDPOINT);
		logger.log("API_BASE_URL:", API_BASE_URL);
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: request.headers.get("cookie") || "",
			},
		});
		const validationResponse: HttpResponse<User> = await response.json();
		if (!validationResponse.success) {
			redirectResponse.cookies.delete("authToken");
			logger.log("unauth request ", validationResponse.errorMessage);
			return redirectResponse;
		} else {
			if (isAuthRoute) {
				return NextResponse.redirect(new URL("/chat", request.url));
			} else {
				return NextResponse.next();
			}
		}
	} catch (e) {
		logger.log("Error during authentication check:", e);
		redirectResponse.cookies.delete("authToken");
		return redirectResponse;
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
