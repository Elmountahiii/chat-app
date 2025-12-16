import { create } from "zustand";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

import { HttpResponse } from "@/types/httpResponse";
import { Conversation } from "@/types/conversation";
import { Message } from "@/types/message";
import { FriendShipRequest } from "@/types/friendShipRequest";
import { useFriendshipStore } from "./friendshipStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: "http://localhost:3001/api";

const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

interface ChatState {
	// state
	socket: Socket | null;
	status: "connected" | "disconnected" | "connecting";
	conversations: Conversation[];
	activeConversationId: string | null;
	messages: Record<string, Message[]>;
	hasMessages: Record<string, boolean>;
	loadingMessages: Record<string, boolean>;
	isLoading: boolean;
	typingUsers: Record<string, string[]>;

	// actions
	initializeSocket: () => void;
	disconnectSocket: () => void;
	setConnectivityStatus: (status: "online" | "offline" | "away") => void;
	fetchConversations: () => Promise<void>;
	createConversation: (userId: string) => Promise<void>;
	setActiveConversation: (conversationId: string) => void;
	fetchMessages: (conversationId: string, limit: number) => Promise<void>;
	sendMessage: (conversationId: string, content: string) => Promise<void>;
	editMessage: (messageId: string, newContent: string) => Promise<void>;
	deleteMessage: (messageId: string) => Promise<void>;
	markAsRead: (conversationId: string) => Promise<void>;
	sendTyping: (conversationId: string, isTyping: boolean) => void;
	clearError: () => void;
	reset: () => void;

	notifyFriendshipSent: (friendship: FriendShipRequest) => void;
	notifyFriendshipAccepted: (friendship: FriendShipRequest) => void;
	notifyFriendshipDeclined: (friendship: FriendShipRequest) => void;
	notifyFriendshipCancelled: (friendship: FriendShipRequest) => void;
	notifyUnfriend: (friendship: FriendShipRequest) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
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
			path: "/socket.io",
		});

		socket.on("connect_error", (err) => {
			console.log(
				"%c ❌ [Socket] Connection Error:",
				"color: #ef4444; font-weight: bold;",
				err,
			);
			set({ status: "disconnected", socket: null });
		});

		socket.on("connect", async () => {
			console.log(
				"%c ⚡ [Socket] Connected",
				"color: #0ea5e9; font-weight: bold;",
			);
			set({ status: "connected", socket });
			await useFriendshipStore.getState().getAllFriends();
			await useFriendshipStore.getState().getSentFriendshipRequests();
			await useFriendshipStore.getState().getReceivedFriendshipRequests();
			await get().fetchConversations();
			const state = get();
			state.conversations.forEach((conversation) => {
				if (state.socket !== null) {
					state.socket.emit("join_conversation", {
						conversationId: conversation._id,
					});
				}
			});
		});

		socket.on("disconnect", () => {
			console.log(
				"%c 🔌 [Socket] Disconnected",
				"color: #0ea5e9; font-weight: bold;",
			);
			set({ status: "disconnected", socket: null });
		});

		// User status events
		socket.on(
			"user:statusChanged",
			(data: { userId: string; status: "online" | "offline" | "away" }) => {
				console.log(
					"%c 👤 [Socket] User Status Changed:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				useFriendshipStore
					.getState()
					.updateFriendStatus(data.userId, data.status);
			},
		);

		// Conversation events
		socket.on(
			"conversation_created",
			(data: { conversation: Conversation }) => {
				console.log(
					"%c 💬 [Socket] Conversation Created:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				set((state) => ({
					conversations: [data.conversation, ...state.conversations],
				}));
			},
		);

		socket.on(
			"conversation_typing",
			(data: { conversationId: string; userId: string; isTyping: boolean }) => {
				console.log(
					"%c ⌨️ [Socket] Typing Status:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
			},
		);

		// Message events
		socket.on("new_message", (message: Message) => {
			console.log(
				"%c 📩 [Socket] New Message:",
				"color: #0ea5e9; font-weight: bold;",
				message,
			);
		});

		socket.on(
			"messages_read",
			(data: { conversationId: string; userId: string }) => {
				console.log(
					"%c 👀 [Socket] Messages Read:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
			},
		);

		// Friendship events
		socket.on(
			"friendship_request_received",
			(data: { friendship: FriendShipRequest }) => {
				console.log(
					"%c 🤝 [Socket] Friend Request Received:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				useFriendshipStore
					.getState()
					.addIncomingFriendshipRequest(data.friendship);
			},
		);

		socket.on(
			"friendship_request_accepted",
			(data: { friendship: FriendShipRequest }) => {
				console.log(
					"%c 🤝 [Socket] Friend Request Accepted:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				useFriendshipStore
					.getState()
					.handleFriendshipRequestAccepted(data.friendship);
			},
		);

		socket.on(
			"friendship_request_declined",
			(data: { friendship: FriendShipRequest }) => {
				console.log(
					"%c 🤝 [Socket] Friend Request Declined:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				useFriendshipStore
					.getState()
					.handleFriendshipRequestDeclined(data.friendship);
			},
		);

		socket.on(
			"friendship_request_cancelled",
			(data: { friendship: FriendShipRequest }) => {
				console.log(
					"%c 🤝 [Socket] Friend Request Cancelled:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				useFriendshipStore
					.getState()
					.handleFriendshipRequestCancelled(data.friendship);
			},
		);

		socket.on(
			"friendship_unfriended",
			(data: { friendship: FriendShipRequest }) => {
				console.log(
					"%c 🤝 [Socket] Unfriended:",
					"color: #0ea5e9; font-weight: bold;",
					data,
				);
				useFriendshipStore.getState().handleFriendshipUnfriend();
			},
		);

		// Error handling
		socket.on("error", (error: { event: string; message: string }) => {
			console.log(
				"%c ⚠️ [Socket] Error:",
				"color: #ef4444; font-weight: bold;",
				error,
			);
			// You can add toast notifications here
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
		console.log(
			"%c 🌐 [HTTP] Fetching Conversations...",
			"color: #eab308; font-weight: bold;",
		);
		set({ isLoading: true });
		try {
			const response = await fetch(`${API_BASE_URL}/conversations`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const result: HttpResponse<Conversation[]> = await response.json();
			if (!result.success) {
				console.log(
					"%c ❌ [HTTP] Fetch Conversations Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				return;
			}

			console.log(
				"%c ✅ [HTTP] Conversations Fetched:",
				"color: #22c55e; font-weight: bold;",
				result.data,
			);

			set({ conversations: result.data, isLoading: false });
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Conversations Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
		} finally {
			set({ isLoading: false });
		}
	},

	createConversation: async (userId) => {
		console.log(
			"%c 🌐 [HTTP] Creating Conversation...",
			"color: #eab308; font-weight: bold;",
			{ userId },
		);
		set({ isLoading: true });
		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/conversations/${userId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const response: HttpResponse<Conversation> = await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Create Conversation Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				return;
			}

			console.log(
				"%c ✅ [HTTP] Conversation Created:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);

			const socket = get().socket;
			if (socket) {
				socket.emit("notify_conversation_created", {
					conversation: response.data,
				});
			}
			set((state) => {
				return {
					conversations: [response.data, ...state.conversations],
					activeConversationId: response.data._id,
				};
			});
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Create Conversation Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
		} finally {
			set({ isLoading: false });
		}
	},

	setActiveConversation: (conversationId) => {
		set({ activeConversationId: conversationId });
	},

	// message actions
	fetchMessages: async (conversationId, limit = 5) => {
		console.log(
			"%c 🌐 [HTTP] Fetching Messages...",
			"color: #eab308; font-weight: bold;",
			{ conversationId, limit },
		);
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
				},
			);
			const response: HttpResponse<{
				messages: Message[];
				hasMore: boolean;
			}> = await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Fetch Messages Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({
					loadingMessages: {
						...get().loadingMessages,
						[conversationId]: false,
					},
				});
				return;
			}

			console.log(
				"%c ✅ [HTTP] Messages Fetched:",
				"color: #22c55e; font-weight: bold;",
				{
					count: response.data.messages.length,
					hasMore: response.data.hasMore,
				},
			);

			const existingMessages = get().messages[conversationId] || [];

			const newMessages = response.data.messages.filter(
				(newM) =>
					!existingMessages.find((existingM) => existingM._id === newM._id),
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
			console.log(
				"%c ❌ [HTTP] Fetch Messages Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
		} finally {
			set({ isLoading: false });
		}
	},
	sendMessage: async (conversationId, content) => {
		console.log(
			"%c 🌐 [HTTP] Sending Message...",
			"color: #eab308; font-weight: bold;",
			{ conversationId, content },
		);
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
				},
			);
			const response: HttpResponse<Message> = await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Send Message Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				return;
			}
			console.log(
				"%c ✅ [HTTP] Message Sent:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Send Message Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
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
		console.log(
			"%c 🌐 [HTTP] Marking as Read...",
			"color: #eab308; font-weight: bold;",
			{ conversationId },
		);
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
				},
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
				console.log(
					"%c ❌ [HTTP] Mark as Read Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				return;
			}
			console.log(
				"%c ✅ [HTTP] Marked as Read:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Mark as Read Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
		} finally {
			set({ isLoading: false });
		}
	},

	// real-time actions
	sendTyping: (conversationId, isTyping) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("typing_conversation", {
				conversationId,
				isTyping,
			});
		}
	},
	// utility actions
	clearError: () => {},

	notifyFriendshipSent: (friendship: FriendShipRequest) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("notify_friendship_request_sent", { friendship });
		}
	},
	notifyFriendshipAccepted: (friendship: FriendShipRequest) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("notify_friendship_request_accepted", { friendship });
		}
	},

	notifyFriendshipDeclined: (friendship: FriendShipRequest) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("notify_friendship_request_declined", { friendship });
		}
	},
	notifyFriendshipCancelled: (friendship: FriendShipRequest) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("notify_friendship_request_cancelled", { friendship });
		}
	},
	notifyUnfriend: (friendship: FriendShipRequest) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("notify_friendship_unfriended", { friendship });
		}
	},

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
}));
