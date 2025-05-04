import { SESSION_COOKIE_NAME } from "$lib/server/auth";
import type { Cookies } from "@sveltejs/kit";

export function setSessionCookie(cookies: Cookies, sessionToken: string, expiresAt: Date) {
	cookies.set(SESSION_COOKIE_NAME, sessionToken, {
		path: "/",
		sameSite: "strict",
		expires: expiresAt,
		httpOnly: true,
		secure: true,
	});
}
