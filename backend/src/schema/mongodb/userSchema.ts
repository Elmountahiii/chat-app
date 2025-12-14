import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		firstName: {
			type: String,
			required: true,
			unique: false,
			index: true,
		},
		lastName: {
			type: String,
			required: true,
			unique: false,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		profilePicture: {
			type: String,
		},
		status: {
			type: String,
			enum: ["online", "offline", "away"],
			default: "offline",
		},
		lastSeen: {
			type: Date,
			default: Date.now,
		},
		lastActive: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);

export type User = mongoose.InferSchemaType<typeof userSchema>;
