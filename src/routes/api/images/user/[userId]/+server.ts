import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
	const { userId } = params;

	try {
		const userRecord = await locals.pb.collection("users").getOne(userId);
		// console.log("userRecord:", userRecord);

		const fileUrl = locals.pb.files.getUrl(userRecord, userRecord.avatar);
		// console.log("fileUrl:", fileUrl);

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
