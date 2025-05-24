import { Check, CheckCheck } from "lucide-react";
import type { Message } from "../../types/user";
import "../styles/message-bubble.css";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isCurrentUser = message.sender === "current-user";

  const rowClass = isCurrentUser
    ? "message-row message-row-sent"
    : "message-row message-row-received";
  const bubbleClass = isCurrentUser
    ? "message-bubble message-bubble-sent"
    : "message-bubble message-bubble-received";
  const metaClass = isCurrentUser
    ? "message-meta message-meta-sent"
    : "message-meta message-meta-received";

  return (
    <div className={rowClass}>
      <div className={bubbleClass}>
        <p className="message-text">{message.text}</p>
        <div className={metaClass}>
          <span className="message-time">{message.timestamp}</span>
          {isCurrentUser && (
            <span className="message-status">
              {message.status === "read" ? (
                <CheckCheck size={16} />
              ) : (
                <Check size={16} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
