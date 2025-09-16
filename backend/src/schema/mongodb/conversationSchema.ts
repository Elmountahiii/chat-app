import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ["individual", "group"],
      required: true,
    },
    groupName: {
      type: String,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timeStamp: {
        type: Date,
        default: Date.now,
      },
      messageType: {
        type: String,
        enum: ["text", "image", "file", "audio"],
        required: true,
        default: "text",
      },
    },

    readStatus: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        lastReadMessage: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
        lastReadAt: { type: Date },
        unreadCount: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

export const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema
);

export type ConversationDocumentType = mongoose.InferSchemaType<
  typeof conversationSchema
> & {
  _id: mongoose.Types.ObjectId;
};
