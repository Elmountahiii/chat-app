import {
  createConversationSchema,
  fetchConversationsSchema,
  fetchMessagesSchema,
  markConversationMessagesAsReadSchema,
  sendMessageSchema,
} from "../schema/message/messageSchema";

export class MessageValidator {
  validateConversationCreationData(data: unknown) {
    return createConversationSchema.parse(data);
  }
  validateConversationFetchParams(data: unknown) {
    return fetchConversationsSchema.parse(data);
  }
  validateConversationMessagesFetchParams(data: unknown) {
    return fetchMessagesSchema.parse(data);
  }
  validateReadMessagesData(data: unknown) {
    return markConversationMessagesAsReadSchema.parse(data);
  }
  validateMessageSendingData(data: unknown) {
    return sendMessageSchema.parse(data);
  }
}
