import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
	_id: string;
	participantOne: User;
	participantTwo: User;
	lastMessage?: Message;
	unreadCount: number;
	createdAt: Date;
	updatedAt: Date;
};
