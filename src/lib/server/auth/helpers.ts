import { SESSION_COOKIE_NAME } from "$lib/server/auth";
import type { Cookies } from "@sveltejs/kit";

export function setSessionCookie(cookies: Cookies, sessionToken: string, expiresAt: Date) {
	cookies.set(SESSION_COOKIE_NAME, sessionToken, {
		path: "/",
		sameSite: "lax", // if "strict", does not log in after redirect from OIDC provider
		expires: expiresAt,
		httpOnly: true,
		secure: true,
	});
}

export function deleteSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
}
