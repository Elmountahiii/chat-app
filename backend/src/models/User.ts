import mongoose from "mongoose";
const { Schema } = mongoose;

export type UserType = {
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string;
};

const userSchema = new Schema<UserType>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
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

export const UserModel = mongoose.model<UserType>("User", userSchema);
