export type User = {
  id: string;
  email: string;
  username: string;
  profilePicture: string;
  online: boolean;
  lastMessageTime: string;
  lastMessage: string;
  unreadCount: number;
};

export type Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

