import type { Post } from "$lib/types";

export type PostWithAccountAndReplyCount = {
	accountDisplayName: string;
	replyCount: number;
} & Post;
