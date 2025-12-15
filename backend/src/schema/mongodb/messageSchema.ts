import mongoose from "mongoose";
import { User } from "./userSchema";

const { Schema } = mongoose;

const messageSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: { type: String, required: true },
		readBy: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				readAt: { type: Date, required: true },
			},
		],
	},
	{ timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, "readBy.user": 1 });

export const MessageModel = mongoose.model("Message", messageSchema);

export type Message = mongoose.InferSchemaType<typeof messageSchema>;

export type PopulatedMessage = Omit<Message, "sender" | "readBy"> & {
	sender: User;
	readBy: { user: User; readAt: Date }[];
	createdAt: string;
	updatedAt: string;
};
