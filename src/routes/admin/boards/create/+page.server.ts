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
		console.log(body);
	},
};
