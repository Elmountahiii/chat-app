import mongoose from "mongoose";
import { User } from "../../types/User";
const { Schema } = mongoose;

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: false,
      unique: false,
      index: true,
    },
    lastName: {
      type: String,
      required: false,
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
  { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", userSchema);

export type UserDocumentType = mongoose.InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};
