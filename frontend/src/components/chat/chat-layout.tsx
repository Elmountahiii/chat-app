import { useState } from "react";
import Sidebar from "./sidebar";
import Conversation from "./conversation";
import type { User, Message } from "../../types/user";
import "../styles/chat-layout.css";

// Sample data
const users: User[] = [
  {
    id: "1",
    username: "John_Doe",
    email: "",
    profilePicture: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn",
    lastMessage: "Hey, how are you?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    username: "Jane_Smith",
    email: "",
    profilePicture: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maria",
    lastMessage: "Can we meet tomorrow?",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    online: true,
  },
  {
    id: "3",
    username: "Mike_Johnson",
    email: "",
    profilePicture: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mason",
    lastMessage: "I'll send you the documents",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    online: false,
  },
  {
    id: "4",
    username: "Sarah_Williams",
    email: "",
    profilePicture: "https://api.dicebear.com/9.x/avataaars/svg?seed=Leo",
    lastMessage: "Thanks for your help!",
    lastMessageTime: "Monday",
    unreadCount: 0,
    online: false,
  },
  {
    id: "5",
    username: "David_Brown",
    email: "",
    profilePicture: "https://api.dicebear.com/9.x/avataaars/svg?seed=Avery",
    lastMessage: "Let's discuss the project",
    lastMessageTime: "Sunday",
    unreadCount: 0,
    online: true,
  },
];

const conversations: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "Hey there!",
      sender: "1",
      timestamp: "10:25 AM",
      status: "read",
    },
    {
      id: "m2",
      text: "How's it going?",
      sender: "current-user",
      timestamp: "10:26 AM",
      status: "read",
    },
    {
      id: "m3",
      text: "I'm doing well, thanks for asking. How about you?",
      sender: "1",
      timestamp: "10:28 AM",
      status: "read",
    },
    {
      id: "m4",
      text: "Pretty good! Just working on some projects.",
      sender: "current-user",
      timestamp: "10:29 AM",
      status: "read",
    },
    {
      id: "m5",
      text: "Hey, how are you?",
      sender: "1",
      timestamp: "10:30 AM",
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Hi Jane, do you have time to meet?",
      sender: "current-user",
      timestamp: "Yesterday",
      status: "read",
    },
    {
      id: "m2",
      text: "Sure, what time works for you?",
      sender: "2",
      timestamp: "Yesterday",
      status: "read",
    },
    {
      id: "m3",
      text: "How about tomorrow at 2pm?",
      sender: "current-user",
      timestamp: "Yesterday",
      status: "read",
    },
    {
      id: "m4",
      text: "Can we meet tomorrow?",
      sender: "2",
      timestamp: "Yesterday",
      status: "delivered",
    },
  ],
};

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleUserSelect}
        isMobileOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      {selectedUser ? (
        <Conversation
          user={selectedUser}
          messages={conversations[selectedUser.id] || []}
          toggleMobileSidebar={toggleMobileSidebar}
        />
      ) : (
        <div className="empty-conversation">
          <div className="empty-conversation-content">
            <h3 className="empty-conversation-title">
              No conversation selected
            </h3>
            <p className="empty-conversation-subtitle">
              Choose a chat from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
