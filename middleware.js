import { error as logError } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	// Check if the route is protected (admin routes)
	if (pathname.startsWith("/dashboard")) {
		try {
			// Call our internal auth API to check session
			const authUrl = new URL("/api/auth/session", request.url);
			const response = await fetch(authUrl, {
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			});

			if (!response.ok || 401 === response.status) {
				const loginUrl = new URL("/login", request.url);
				loginUrl.searchParams.set("redirect", pathname);
				return NextResponse.redirect(loginUrl);
			}

			// User is authenticated, continue
			return NextResponse.next();
		} catch (error) {
			logError("Middleware auth error:", error);
			// On error, redirect to login
			const loginUrl = new URL("/login", request.url);
			return NextResponse.redirect(loginUrl);
		}
	}

	// For login/signup pages, redirect to dashboard if already authenticated
	if ("/login" === pathname || "/signup" === pathname) {
		try {
			const authUrl = new URL("/api/auth/session", request.url);
			const response = await fetch(authUrl, {
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			});

			if (response.ok && 200 === response.status) {
				const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
				return NextResponse.redirect(new URL(redirectTo, request.url));
			}
		} catch (error) {
			// If there's an error checking auth, continue to login/signup
			logError("Middleware auth check error:", error);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|images|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
