import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
	const body = Object.fromEntries(await request.formData()) as {
		username: string;
		password: string;
	};

	try {
		await locals.pb.collection("users").authWithPassword(body.username, body.password);
	} catch (err) {
		// console.log(err);
		return new Response(JSON.stringify({ error: "Error logging in" }), { status: 400 });
	}

	return redirect(303, "/");
};
