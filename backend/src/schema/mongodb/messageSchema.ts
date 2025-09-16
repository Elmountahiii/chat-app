import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
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

    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio"],
      default: "text",
    },

    fileInfo: {
      fileName: String,
      fileSize: Number,
      fileUrl: String,
      mimeType: String,
    },

    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    readBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

export const MessageModel = mongoose.model("Message", messageSchema);

export type MessageDocumentType = mongoose.InferSchemaType<
  typeof messageSchema
> & {
  _id: mongoose.Types.ObjectId;
};
