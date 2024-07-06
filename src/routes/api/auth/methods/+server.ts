import { TABLE_NAMES } from "$lib";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const ssoProviders = await locals.pb.collection(TABLE_NAMES.users).listAuthMethods();
		return Response.json(ssoProviders);
	} catch (err) {
		return new Response(JSON.stringify({ error: "Error: Error retrieving auth methods" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}
};
