import type { Post, Reply } from "$lib/types";

export type PostListPost = {
	userName: string;
	replyCount: number;
	boardName: string;
} & Post;

export type PrettyReply = Reply & {
	userName: string;
};

export type ReplyTree = PrettyReply & { children: ReplyTree[] };

export type AccountMenuLink = {
	href: string;
	label: string;
};
