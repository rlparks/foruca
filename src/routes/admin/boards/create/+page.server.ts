import type { Board } from "$lib/types";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceAdmin();
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		event.locals.security.enforceAdmin();
		const formData = await event.request.formData();
		const { boardName, boardDescription, privateBoard } = Object.fromEntries(
			formData.entries(),
		) as {
			boardName: string;
			boardDescription: string;
			privateBoard?: "on";
		};

		const trimmedBoardName = boardName.trim();
		const trimmedBoardDescription = boardDescription.trim();

		if (!trimmedBoardName || !trimmedBoardDescription) {
			return fail(400, { message: "Please fill out all fields" });
		}

		if (trimmedBoardName.length > 50) {
			return fail(400, { message: "Board name cannot exceed 50 characters" });
		}

		const newBoard: Omit<Board, "id"> = {
			name: trimmedBoardName,
			description: trimmedBoardDescription,
			isPublic: privateBoard !== "on",
			createdAt: new Date(),
		};

		const createdBoard = await event.locals.queries.createBoard(newBoard);
		if (!createdBoard) {
			return fail(400, { message: "borked" });
		}

		return redirect(303, "/admin/boards");
	},
};
