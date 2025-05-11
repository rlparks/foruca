import type { Post } from "$lib/types";

export type PostListPost = {
	accountDisplayName: string;
	replyCount: number;
	boardName: string;
} & Post;
