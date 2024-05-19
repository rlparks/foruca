import { PB_URL } from "$env/static/private";

// https://www.youtube.com/watch?v=mM5sqLUS4nY
export function getImageUrl(
	collectionId: string,
	recordId: string,
	fileName: string,
	size: string = "0x0"
) {
	return `${PB_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
}
