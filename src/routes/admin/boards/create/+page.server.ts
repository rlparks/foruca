import type { Board } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const body = Object.fromEntries(formData.entries()) as {
			boardName: string;
			boardDescription: string;
			privateBoard?: "on";
		};

		const newBoard: Omit<Board, "id"> = {
			name: body.boardName,
			description: body.boardDescription,
			isPublic: body.privateBoard !== "on",
			createdAt: new Date(),
		};

		const createdBoard = await event.locals.queries.createBoard(newBoard);
		console.log(createdBoard);
	},
};
