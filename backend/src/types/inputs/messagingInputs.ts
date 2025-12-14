export type CreateConversationInput = {
	participants: string[];
	type: "individual" | "group";
	groupName?: string;
	groupAdmin?: string;
};

export type CreateMessageInput = {
	conversationId: string;
	senderId: string;
	content: string;
};
