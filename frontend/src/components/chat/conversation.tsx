import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Menu,
  Phone,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import type { User, Message } from "../../types/user";
import MessageBubble from "./message-bubble";
import { useMobile } from "../../hooks/use-mobile";
import "../styles/conversation.css";

interface ConversationProps {
  user: User;
  messages: Message[];
  toggleMobileSidebar: () => void;
}

export default function Conversation({
  user,
  messages,
  toggleMobileSidebar,
}: ConversationProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // In a real app, you would send this message to your backend
    console.log("Sending message:", newMessage);

    // Clear the input
    setNewMessage("");
  };

  return (
    <div className="conversation">
      {/* Header */}
      <div className="conversation-header">
        <div className="header-user-info">
          {isMobile && (
            <button
              className="icon-button menu-button"
              onClick={toggleMobileSidebar}>
              <Menu size={20} />
            </button>
          )}
          <img
            src={user.profilePicture || "/placeholder.svg"}
            alt={user.username}
            className="header-avatar"
          />
          <div className="header-user-details">
            <h3 className="header-user-name">{user.username}</h3>
            <p className="header-user-status">
              {user.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={() => {
              toast.info("Call feature is not implemented yet");
            }}
            className="icon-button">
            <Phone size={20} />
          </button>
          <button
            onClick={() => {
              toast.info("Video call feature is not implemented yet");
            }}
            className="icon-button">
            <Video size={20} />
          </button>
          <button className="icon-button">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <button type="button" className="icon-button">
            <Smile size={20} />
          </button>
          <button type="button" className="icon-button">
            <Paperclip size={20} />
          </button>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="message-input"
          />
          <button type="submit" className="send-button">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
