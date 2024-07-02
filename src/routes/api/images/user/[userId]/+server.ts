import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { RawUser } from "$lib/types";

export const GET: RequestHandler = async ({ locals, params }) => {
	const { userId } = params;

	if (!locals.user) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const userRecord = await locals.pb.collection<RawUser>("users").getOne(userId);
		// console.log("userRecord:", userRecord);

		const fileUrl = locals.pb.files.getUrl(userRecord, userRecord.avatar);
		// console.log("fileUrl:", fileUrl);
		if (!fileUrl) {
			return json({ error: "Error: User has no avatar." }, { status: 404 });
		}

		const imgResponse = await fetch(fileUrl);
		const imgBlob = await imgResponse.blob();

		const contentType = imgResponse.headers.get("content-type") ?? "";

		return new Response(imgBlob, {
			status: 200,
			headers: {
				"Content-Type": contentType
			}
		});
	} catch (err) {
		// commenting out, as PB returns an error when not authenticated
		// console.error("Error retrieving user:", err);
		return new Response(JSON.stringify({ error: "Error: User not found." }), {
			status: 404,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}
};
