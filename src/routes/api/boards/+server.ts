import { makeBoardSafe, TABLE_NAMES } from "$lib";
import type { RawBoard, SafeBoard } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	try {
		// get boards in alphabetical order
		const boardRes = await locals.pb
			.collection(TABLE_NAMES.boards)
			.getFullList<RawBoard>({ sort: "name" });

		const safeBoards: SafeBoard[] = [];
		for (const boardKey in boardRes) {
			safeBoards[boardKey] = makeBoardSafe(boardRes[boardKey]);
		}

		return json(safeBoards);
	} catch (err) {
		return json({ error: "Error retrieving boards." }, { status: 500 });
	}
};
