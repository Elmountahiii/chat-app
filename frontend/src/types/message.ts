import { User } from "./user";

export type MessageStatus = "pending" | "sent" | "failed";

export interface Message {
	_id: string;
	conversationId: string;
	sender: User;
	content: string;
	readBy: {
		user: User;
		readAt: string;
	}[];
	createdAt: string;
	updatedAt: string;
	// Optimistic UI fields
	tempId?: string;
	status?: MessageStatus;
}

export interface PaginatedMessages {
	messages: Message[];
	hasMore: boolean;
	nextCursor: string | null;
}
