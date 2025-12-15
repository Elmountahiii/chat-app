// ...existing code...

import { User } from "./user";

export interface Message {
	_id: string;
	conversationId: string;
	sender: User;
	content: string;
	readBy: {
		user: User;
		readAt: Date;
	}[];
	createdAt: Date;
	updatedAt: Date;
}
