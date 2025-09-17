import { ChatActions } from "@/types/action/chatActions";
import { chatState } from "@/types/state/chatState";
import { create } from "zustand";
import { io } from "socket.io-client";
import { HttpResponse } from "@/types/httpResponse";
import { Conversation } from "@/types/converstation";
import { Message } from "@/types/message";
import { User } from "@/types/user";
import { PotentialFriend } from "@/types/potentialFriend";
import { FriendShipRequest } from "@/types/friendShipRequest";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

type ChatStore = chatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  // state
  socket: null,
  status: "disconnected",

  conversations: [],
  activeConversationId: null,
  messages: {},
  hasMessages: {},
  loadingMessages: {},
  isLoading: false,
  typingUsers: {},
  onlineFriends: [],
  potentialFriends: [],
  friendshipRequests: [],

  // actions
  initializeSocket: () => {
    if (get().status === "connected" || get().status === "connecting") {
      console.log("Socket is already connected or connecting");
      return;
    }
    set({ status: "connecting" });
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      set({ status: "disconnected", socket: null });
    });

    socket.on("connect", async () => {
      set({ status: "connected", socket });
      await get().fetchConversations();
      const state = get();
      state.conversations.forEach((conversation) => {
        if (state.socket !== null) {
          state.socket.emit("join_conversation", {
            conversationId: conversation._id,
          });
        }
      });
      await state.getOnlineFriends();
    });

    // handle conversation creation
    socket.on(
      "conversation_created",
      (data: { conversation: Conversation }) => {
        const { conversation } = data;
        console.log("New conversation created:", conversation);
        const state = get();
        if (state.socket !== null) {
          state.socket.emit("join_conversation", {
            conversationId: conversation._id,
          });

          set({
            conversations: [conversation, ...state.conversations],
          });
        }
      }
    );

    // Handle incoming messages
    socket.on(
      "new_message",
      (data: { userId: string; message: Message; conversationId: string }) => {
        const { userId, message, conversationId } = data;
        console.log("Received new message via socket:", data);
        const state = get();
        const conversationMessages = state.messages[conversationId] || [];
        set({
          messages: {
            ...state.messages,
            [conversationId]: [...conversationMessages, message],
          },
        });

        const conversation = state.conversations.find(
          (c) => c._id === conversationId
        );
        if (!conversation) return;
        const updatedConversation = {
          ...conversation,

          lastMessage: {
            content: message.content,
            sender: message.sender,
            timeStamp: message.createdAt,
            messageType: message.messageType,
          },
          readStatus: conversation.readStatus.map((status) => {
            if (status.userId !== userId) {
              return {
                ...status,
                unreadCount:
                  get().activeConversationId === conversationId
                    ? 0
                    : status.unreadCount + 1,
              };
            }
            return status;
          }),
        };
        const updatedConversations = [...state.conversations];
        updatedConversations.splice(
          state.conversations.indexOf(conversation),
          1
        );
        updatedConversations.unshift(updatedConversation);
        set({ conversations: updatedConversations });
        if (get().activeConversationId === conversationId)
          get().markAsRead(conversationId);
      }
    );

    // Handle message read receipts
    socket.on(
      "message_read",
      (data: {
        conversationId: string;
        messageId: string;
        totalUnreadMessagesCleared: number;
        user: User;
        lastReadAt: Date;
      }) => {
        const { conversationId, messageId, user } = data;

        const state = get();
        const conversation = state.conversations.map((convo) => {
          if (convo._id === conversationId) {
            return {
              ...convo,
              readStatus: convo.readStatus.map((status) => {
                if (status.userId === user._id) {
                  return {
                    ...status,
                    lastReadMessage: { _id: messageId } as Message,
                    unreadCount: 0,
                  };
                }
                return status;
              }),
            };
          }
          return convo;
        });

        set({ conversations: conversation });
      }
    );

    // Handle message editing
    socket.on(
      "message_edited",
      (data: {
        conversationId: string;
        messageId: string;
        newContent: string;
        editedAt: Date;
      }) => {
        console.log("Message edited event received:", data);
      }
    );

    // Handle message deletion
    socket.on(
      "message_deleted",
      (data: {
        conversationId: string;
        messageId: string;
        deletedAt: Date;
      }) => {
        console.log("Message deleted event received:", data);
      }
    );

    // Handle typing indicators
    socket.on(
      "user_typing",
      (data: { conversationId: string; userId: string; isTyping: boolean }) => {
        const { conversationId, isTyping } = data;
        const state = get();
        const conversations = state.conversations.map((convo) => {
          if (convo._id === conversationId) {
            return { ...convo, isTyping: isTyping };
          }
          return convo;
        });
        set({ conversations });
      }
    );

    // Handle connectivity status changes
    socket.on(
      "user:statusChanged",
      (data: { status: "online" | "offline" | "away"; user: User }) => {
        console.log("Received status change via socket:", data);
        const { status, user } = data;
        const state = get();
        const found = state.onlineFriends.find((f) => f._id === user._id);
        if (!found) {
          const updatedOnlineFriends = [...state.onlineFriends, user];
          set({ onlineFriends: updatedOnlineFriends });
        } else {
          const updatedOnlineFriends = state.onlineFriends.map((friend) => {
            if (friend._id === user._id) {
              return { ...friend, status };
            }
            return friend;
          });
          set({ onlineFriends: updatedOnlineFriends });
        }
      }
    );

    // Handle new friendship requests
    socket.on(
      "friend:requestReceived",
      (data: { senderId: string; friendship: FriendShipRequest }) => {
        const { friendship } = data;
        console.log("Received new friendship request via socket:", data);
        const state = get();
        set({
          friendshipRequests: [friendship, ...state.friendshipRequests],
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      set({ status: "disconnected", socket: null });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, status: "disconnected" });
    }
  },
  setConnectivityStatus: (status) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("user:status", { status });
    }
  },

  // conversation actions
  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(
        `${API_BASE_URL}/messages/conversations`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response: HttpResponse<Conversation[]> = await rawResponse.json();
      if (!response.success) {
        console.warn("Failed to fetch conversations:", response.errorMessage);
        return;
      }

      set({ conversations: response.data, isLoading: false });
    } catch (e) {
      console.warn(`Fetch conversations error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  createConversation: async (participants, type, groupName) => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(
        `${API_BASE_URL}/messages/conversations`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participants, type, groupName }),
        }
      );
      const response: HttpResponse<Conversation> = await rawResponse.json();
      if (!response.success) {
        console.warn("Failed to create conversation:", response.errorMessage);
        return;
      }
      const state = get();
      if (state.socket !== null) {
        state.socket.emit("join_conversation", {
          conversationId: response.data._id,
        });
      }
      set((state) => {
        return {
          conversations: [response.data, ...state.conversations],
          activeConversationId: response.data._id,
        };
      });
    } catch (e) {
      console.warn(`Create conversation error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  // message actions
  fetchMessages: async (conversationId, limit = 5) => {
    set({
      isLoading: true,
      loadingMessages: { ...get().loadingMessages, [conversationId]: true },
    });
    try {
      const cursor = get().messages[conversationId]?.at(0)?._id;
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        ...(cursor && { cursor }),
      });
      const rawResponse = await fetch(
        `${API_BASE_URL}/messages/conversations/${conversationId}/messages?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response: HttpResponse<{
        messages: Message[];
        hasMore: boolean;
      }> = await rawResponse.json();
      if (!response.success) {
        console.warn("Failed to fetch messages:", response.errorMessage);
        set({
          loadingMessages: {
            ...get().loadingMessages,
            [conversationId]: false,
          },
        });
        return;
      }
      const existingMessages = get().messages[conversationId] || [];

      const newMessages = response.data.messages.filter(
        (newM) =>
          !existingMessages.find((existingM) => existingM._id === newM._id)
      );
      const hasMore = response.data.hasMore;

      set((state) => {
        const existingMessages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: [...newMessages, ...existingMessages],
          },
          hasMessages: {
            ...state.hasMessages,
            [conversationId]: hasMore,
          },
          loadingMessages: {
            ...state.loadingMessages,
            [conversationId]: false,
          },
        };
      });
    } catch (e) {
      console.warn(`Fetch messages error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },
  sendMessage: async (conversationId, content) => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(
        `${API_BASE_URL}/messages/conversations/${conversationId}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
            content: content,
            messageType: "text",
          }),
        }
      );
      const response: HttpResponse<Message> = await rawResponse.json();
      if (!response.success) {
        console.warn("Failed to send message:", response.errorMessage);
        return;
      }
    } catch (e) {
      console.warn(`Send message error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },
  editMessage: async (messageId, newContent) => {
    // todo : implement edit message later
    throw new Error(`Method not implemented. ${messageId} - ${newContent}`);
  },
  deleteMessage: async (messageId) => {
    // todo : implement delete message later
    throw new Error(`Method not implemented. ${messageId}`);
  },
  markAsRead: async (conversationId) => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(
        `${API_BASE_URL}/messages/conversations/${conversationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response: HttpResponse<{
        conversationId: string;
        lastReadMessageId: string;
        messagesMarkedAsRead: number;
        totalUnreadMessagesCleared: number;
        lastReadAt: string;
        targetMessage: {
          id: string;
          content: string;
          createdAt: string;
          sender: string;
        };
      }> = await rawResponse.json();
      if (!response.success) {
        console.warn("Failed to mark messages as read:", response.errorMessage);
        return;
      }
    } catch (e) {
      console.warn(`Mark messages as read error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  // real-time actions
  sendTyping: (conversationId, isTyping) => {
    const socket = get().socket;
    if (socket && get().status === "connected") {
      socket.emit("typing", {
        conversationId,
        isTyping,
      });
    }
  },
  // utility actions
  clearError: () => {},

  reset: () =>
    set({
      socket: null,
      status: "disconnected",
      conversations: [],
      activeConversationId: null,
      messages: {},
      isLoading: false,
      typingUsers: {},
    }),

  // friendship actions
  getOnlineFriends: async () => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(`${API_BASE_URL}/user/all-friends`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response: HttpResponse<User[]> = await rawResponse.json();
      if (!response.success) {
        console.warn(
          "Failed to fetch friends for online status:",
          response.errorMessage
        );
        return;
      }
      set({ onlineFriends: response.data });
    } catch (e) {
      console.warn(`Fetch online friends error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  searchForPotentialFriends: async (query: string) => {
    set({ isLoading: true });

    try {
      const rawResponse = await fetch(
        `${API_BASE_URL}/user/search?query=${query}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response: HttpResponse<PotentialFriend[]> =
        await rawResponse.json();
      if (!response.success) {
        console.warn(
          "Failed to search for potential friends:",
          response.errorMessage
        );
        return;
      }
      set({ potentialFriends: response.data });
    } catch (e) {
      console.warn(`Search for potential friends error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllFriendshipRequests: async () => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(`${API_BASE_URL}/user/pending-requests`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response: HttpResponse<FriendShipRequest[]> =
        await rawResponse.json();
      if (!response.success) {
        console.warn(
          "Failed to fetch friendship requests:",
          response.errorMessage
        );
        return;
      }
      set({ friendshipRequests: response.data });
    } catch (e) {
      console.warn(`Fetch friendship requests error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  sendFriendshipRequest: async (receiverId: string) => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(`${API_BASE_URL}/user/send-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId }),
      });

      const response: HttpResponse<FriendShipRequest> =
        await rawResponse.json();
      if (!response.success) {
        console.warn(
          "Failed to send friendship request:",
          response.errorMessage
        );
        return;
      }
      const updatedPotentialFriends = get().potentialFriends.map((pf) => {
        if (pf._id === receiverId) {
          return {
            ...pf,
            friendship: response.data,
          };
        }
        return pf;
      });
      set({ potentialFriends: updatedPotentialFriends });
    } catch (e) {
      console.warn(`Send friendship request error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  acceptFriendshipRequest: async (FriendshipId: string) => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(`${API_BASE_URL}/user/accept-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendshipId: FriendshipId }),
      });
      const response: HttpResponse<FriendShipRequest> =
        await rawResponse.json();
      if (!response.success) {
        console.warn(
          "Failed to accept friendship request:",
          response.errorMessage
        );
        return;
      }
      set({
        friendshipRequests: get().friendshipRequests.filter(
          (request) => request._id !== FriendshipId
        ),
      });
      get().getOnlineFriends();
    } catch (e) {
      console.warn(`Accept friendship request error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },

  declineFriendshipRequest: async (FriendshipId: string) => {
    set({ isLoading: true });
    try {
      const rawResponse = await fetch(`${API_BASE_URL}/user/decline-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendshipId: FriendshipId }),
      });
      const response: HttpResponse<FriendShipRequest> =
        await rawResponse.json();
      if (!response.success) {
        console.warn(
          "Failed to decline friendship request:",
          response.errorMessage
        );
        return;
      }
      set({
        friendshipRequests: get().friendshipRequests.filter(
          (request) => request._id !== FriendshipId
        ),
      });
    } catch (e) {
      console.warn(`Decline friendship request error:`, e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
