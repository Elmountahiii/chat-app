import mongoose from "mongoose";
const { Schema } = mongoose;

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string;
};

const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: false,
      default: "",
      unique: false,
    },
    lastName: {
      type: String,
      required: false,
      default: "",
      unique: false,
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
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", userSchema);
