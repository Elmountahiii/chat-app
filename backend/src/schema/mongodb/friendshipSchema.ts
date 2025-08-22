import mongoose from "mongoose";
const { Schema } = mongoose;

const friendshipSchema = new Schema(
  {
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
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export const FriendshipModel = mongoose.model("Friendship", friendshipSchema);

export type FriendshipDocumentType = mongoose.InferSchemaType<
  typeof friendshipSchema
> & {
  _id: mongoose.Types.ObjectId;
};
