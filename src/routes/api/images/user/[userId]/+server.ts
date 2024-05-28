import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
	try {
		const userRecord = await locals.pb.collection("users").getOne(params.userId);
		console.log("userRecord:", userRecord);
	} catch (err) {
		console.error("Error retrieving user:", err);
		return new Response(JSON.stringify({ error: "Error: User not found." }), {
			status: 404,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}

	return new Response();
};
