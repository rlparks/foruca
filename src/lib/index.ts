// place files you want to import through the `$lib` alias in this folder.

/**
 * Formats a `Date` into something nice to look at.
 *
 * @param date the Date to format
 * @returns a nicely formatted date/time string
 */
export function getFormattedDateTime(date: Date): string {
	// use user's favorite date flavor
	const dateString = date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	return `${dateString} ${date.toLocaleTimeString()}`;
}

/**
 * @returns a readable date/time string of the current instant
 */
export function getCurrentFormattedDateTime(): string {
	const now = new Date();
	return getFormattedDateTime(now);
}
