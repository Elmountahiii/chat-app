import { User } from "../user";

export type ChatActions = {
  // socket actions
  initializeSocket: () => void;
  disconnectSocket: () => void;

  //connectivity actions
  setConnectivityStatus: (status: "online" | "offline" | "away") => void;

  // user actions
  setCurrentUser: (user: User) => void;
  getOnlineFriends: () => Promise<void>;
  searchForPotentialFriends: (query: string) => Promise<void>;
  getAllFriendshipRequests: () => Promise<void>;
  sendFriendshipRequest: (receiverId: string) => Promise<void>;
  acceptFriendshipRequest: (FriendshipId: string) => Promise<void>;
  declineFriendshipRequest: (FriendshipId: string) => Promise<void>;

  // conversation actions
  fetchConversations: () => Promise<void>;
  createConversation: (
    participants: string[],
    type: "individual" | "group",
    groupName?: string
  ) => Promise<void>;
  setActiveConversation: (conversationId: string) => void;

  // message actions
  fetchMessages: (conversationId: string, limit: number) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  markAsRead: (conversationId: string, messageId?: string) => Promise<void>;

  // Real-time actions
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  // Utility actions
  clearError: () => void;
  reset: () => void;
};
