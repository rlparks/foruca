import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.pbAlive) {
		return new Response(JSON.stringify({ error: "Error: Unable to access the database." }), {
			status: 500,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}

	try {
		const ssoProviders = await locals.pb.collection("users").listAuthMethods();
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
