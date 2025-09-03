import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model("Message", messageSchema);

export type MessageDocumentType = mongoose.InferSchemaType<
  typeof messageSchema
> & {
  _id: mongoose.Types.ObjectId;
};
