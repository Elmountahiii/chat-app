import mongoose from "mongoose";
import { User } from "./userSchema";
import { PopulatedMessage } from "./messageSchema";

const { Schema } = mongoose;

const conversationSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		participantOne: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		participantTwo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			required: false,
		},
	},
	{
		timestamps: true,
	},
);

conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ participantOne: 1, participantTwo: 1 });

export const ConversationModel = mongoose.model(
	"Conversation",
	conversationSchema,
);

export type Conversation = mongoose.InferSchemaType<typeof conversationSchema>;

export type PopulatedConversation = Omit<
	Conversation,
	"participantOne" | "participantTwo" | "lastMessage"
> & {
	participantOne: User;
	participantTwo: User;
	lastMessage: PopulatedMessage | undefined;
	unreadCount: number;
	createdAt: string;
	updatedAt: string;
};
