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

	isLoading: boolean;
	typingUsers: Record<string, string[]>;

	// actions
	initializeSocket: () => void;
	disconnectSocket: () => void;
	setConnectivityStatus: (status: "online" | "offline" | "away") => void;
	fetchConversations: () => Promise<void>;
	createConversation: (userId: string) => Promise<void>;
	setActiveConversation: (conversationId: string) => void;
	loadMessages: (conversationId: string) => Promise<void>;
	sendMessage: (conversationId: string, content: string) => Promise<void>;
	clearError: () => void;
	reset: () => void;

	// notifecations
	notifyFriendshipSent: (friendship: FriendShipRequest) => void;
	notifyFriendshipAccepted: (friendship: FriendShipRequest) => void;
	notifyFriendshipDeclined: (friendship: FriendShipRequest) => void;
	notifyFriendshipCancelled: (friendship: FriendShipRequest) => void;
	notifyUnfriend: (friendship: FriendShipRequest) => void;

	notifyTyping: (conversationId: string, isTyping: boolean) => void;
	notifyMessageRead: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
	// state
	socket: null,
	status: "disconnected",

	conversations: [],
	activeConversationId: null,
	messages: {},
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
			set((state) => {
				const currentMessages = state.messages[message.conversationId] || [];
				// Check if message already exists to prevent duplicates
				if (currentMessages.some((m) => m._id === message._id)) {
					return state;
				}

				return {
					messages: {
						...state.messages,
						[message.conversationId]: [...currentMessages, message],
					},
					// Update last message in conversation list
					conversations: state.conversations.map((conv) => {
						if (conv._id === message.conversationId) {
							return {
								...conv,
								lastMessage: message,
								// Increment unread count if the message is not from the current user
								// and the active conversation is not this one
								// Note: Logic for unread count might need refinement based on user ID availability
								unreadCount:
									state.activeConversationId !== message.conversationId
										? conv.unreadCount + 1
										: conv.unreadCount,
							};
						}
						return conv;
					}),
				};
			});
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
	loadMessages: async (conversationId) => {
		console.log(
			"%c 🌐 [HTTP] Fetching Messages...",
			"color: #eab308; font-weight: bold;",
			{ conversationId },
		);
		set({ isLoading: true });
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/conversations/${conversationId}/messages`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const result: HttpResponse<Message[]> = await response.json();

			if (!result.success) {
				console.log(
					"%c ❌ [HTTP] Fetch Messages Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				return;
			}

			console.log(
				"%c ✅ [HTTP] Messages Fetched:",
				"color: #22c55e; font-weight: bold;",
				{ count: result.data.length, messages: result.data },
			);

			set((state) => ({
				messages: {
					...state.messages,
					[conversationId]: result.data,
				},
				isLoading: false,
			}));
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Messages Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ isLoading: false });
		}
	},
	sendMessage: async (conversationId, content) => {
		console.log(
			"%c 🌐 [HTTP] Sending Message...",
			"color: #eab308; font-weight: bold;",
			{ conversationId, content },
		);
		const socket = get().socket;
		if (socket) {
			socket.emit("send_message", {
				conversationId,
				content,
			});
		}
	},

	notifyMessageRead: async (conversationId) => {
		console.log(
			"%c 🌐 [HTTP] Marking as Read...",
			"color: #eab308; font-weight: bold;",
			{ conversationId },
		);
	},

	// real-time actions

	notifyTyping: (conversationId, isTyping) => {
		const socket = get().socket;
		if (socket && get().status === "connected") {
			socket.emit("notify_conversation_typing", {
				conversationId,
				isTyping,
			});
		}
	},
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
	// utility actions
	clearError: () => {},
}));
