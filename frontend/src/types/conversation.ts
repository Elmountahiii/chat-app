import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
	_id: string;
	participantOne: User;
	participantTwo: User;
	lastMessage?: Message;
	unreadCount: number;
	isBlocked?: boolean;
	blockedByMe?: boolean;
	createdAt: string;
	updatedAt: string;
};
