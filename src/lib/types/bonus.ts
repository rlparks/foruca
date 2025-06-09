import type { Post } from "$lib/types";

export type PostListPost = {
	userName: string;
	replyCount: number;
	boardName: string;
} & Post;
