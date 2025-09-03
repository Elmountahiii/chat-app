import { MessageSchema } from "../schema/message/messageSchema";

export class MessageValidator {
  validateMessage(data: unknown) {
    return MessageSchema.parse(data);
  }
}
