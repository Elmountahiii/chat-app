import mongoose from "mongoose";
import { User } from "./userSchema";
const { Schema } = mongoose;

const friendshipSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		requester: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		blockedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "blocked"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	},
);

friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export const FriendshipModel = mongoose.model("Friendship", friendshipSchema);

export type Friendship = mongoose.InferSchemaType<typeof friendshipSchema>;

export type PopulatedFriendship = Omit<
	Friendship,
	"requester" | "recipient" | "blockedBy"
> & {
	requester: User;
	recipient: User;
	blockedBy: User | null;
	createdAt: string;
	updatedAt: string;
};
