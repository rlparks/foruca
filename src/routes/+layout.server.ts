import type { AccountMenuLink } from "$lib/types/bonus";
import type { LayoutServerLoad } from "./$types";

const normalUserLinks: AccountMenuLink[] = [];
const adminUserLinks: AccountMenuLink[] = [{ href: "/admin", label: "Admin" }];

export const load = (async (event) => {
	const { user } = event.locals;

	return {
		user,
		accountLinks: event.locals.security.isAdmin() ? adminUserLinks : normalUserLinks,
	};
}) satisfies LayoutServerLoad;
