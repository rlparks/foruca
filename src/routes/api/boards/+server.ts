import { makeBoardSafe } from "$lib";
import type { RawBoard, SafeBoard } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const boardRes = await locals.pb.collection("boards").getFullList<RawBoard>();

		const safeBoards: SafeBoard[] = [];
		for (const boardKey in boardRes) {
			safeBoards[boardKey] = makeBoardSafe(boardRes[boardKey]);
		}

		return json(safeBoards);
	} catch (err) {
		return json({ error: "Error retrieving boards." }, { status: 500 });
	}
};
