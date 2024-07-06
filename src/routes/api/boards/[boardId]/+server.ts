import { makeBoardSafe, TABLE_NAMES } from "$lib";
import type { RawBoard } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, locals }) => {
	const boardId = params.boardId;
	try {
		const boardRes = await locals.pb.collection(TABLE_NAMES.boards).getOne<RawBoard>(boardId, {});

		return json(makeBoardSafe(boardRes));
	} catch (err) {
		return json({ error: "Board not found." }, { status: 404 });
	}
};
