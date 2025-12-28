import { create } from "zustand";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

import { HttpResponse } from "@/types/httpResponse";
import { Conversation } from "@/types/conversation";
import { Message, PaginatedMessages } from "@/types/message";
import { FriendShipRequest } from "@/types/friendShipRequest";
import { useFriendshipStore } from "./friendshipStore";
import { useAuthStore } from "./authStore";
import { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: "http://192.168.1.3:3001/api";

const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://192.168.1.3:3001";

interface ChatState {
	// state
	socket: Socket | null;
	status: "connected" | "disconnected" | "connecting";
	conversations: Conversation[];
	activeConversationId: string | null;
	messages: Record<string, Message[]>;
	messagesPagination: Record<
		string,
		{
			hasMore: boolean;
			nextCursor: string | null;
			isLoadingMore: boolean;
			isInitial: boolean;
		}
	>;

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
	loadInitialMessages: (conversationId: string) => Promise<void>;
	loadMoreMessages: (conversationId: string) => Promise<void>;
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
	messagesPagination: {},
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

				// Check if this is a confirmation for our optimistic message (has tempId)
				if (message.tempId) {
					const hasPendingMessage = currentMessages.some(
						(m) => m.tempId === message.tempId,
					);

					if (hasPendingMessage) {
						// Replace the pending message with the confirmed one
						const updatedMessages = currentMessages.map((m) =>
							m.tempId === message.tempId
								? { ...message, status: "sent" as const }
								: m,
						);

						return {
							messages: {
								...state.messages,
								[message.conversationId]: updatedMessages,
							},
							conversations: state.conversations.map((conv) =>
								conv._id === message.conversationId
									? { ...conv, lastMessage: message }
									: conv,
							),
						};
					}
				}

				// Check if message already exists to prevent duplicates
				if (currentMessages.some((m) => m._id === message._id)) {
					return state;
				}

				// Mark as read if active conversation
				if (get().activeConversationId === message.conversationId) {
					get().notifyMessageRead(message.conversationId);
				}

				return {
					messages: {
						...state.messages,
						[message.conversationId]: [
							...currentMessages,
							{ ...message, status: "sent" as const },
						],
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
				set((state) => {
					const conversationMessages =
						state.messages[data.conversationId] || [];
					const updatedMessages = conversationMessages.map((msg) => {
						if (msg.readBy.some((reader) => reader.user._id === data.userId)) {
							return msg;
						}
						return {
							...msg,
							readBy: [
								...msg.readBy,
								{
									user: { _id: data.userId } as User,
									readAt: new Date().toISOString(),
								},
							],
						};
					});

					return {
						messages: {
							...state.messages,
							[data.conversationId]: updatedMessages,
						},
					};
				});
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

		// Message send error handling - marks optimistic message as failed
		socket.on(
			"send_message_error",
			(data: { tempId: string; conversationId: string; message: string }) => {
				console.log(
					"%c ❌ [Socket] Message Send Failed:",
					"color: #ef4444; font-weight: bold;",
					data,
				);

				// Mark the pending message as failed
				set((state) => {
					const currentMessages = state.messages[data.conversationId] || [];
					return {
						messages: {
							...state.messages,
							[data.conversationId]: currentMessages.map((m) =>
								m.tempId === data.tempId
									? { ...m, status: "failed" as const }
									: m,
							),
						},
					};
				});
			},
		);
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
	loadInitialMessages: async (conversationId) => {
		console.log(
			"%c 🌐 [HTTP] Fetching Initial Messages...",
			"color: #eab308; font-weight: bold;",
			{ conversationId },
		);
		set({ isLoading: true });
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/conversations/${conversationId}/initaialMessages`,
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
					"%c ❌ [HTTP] Fetch Initial Messages Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				return;
			}

			console.log(
				"%c ✅ [HTTP] Initial Messages Fetched:",
				"color: #22c55e; font-weight: bold;",
				{ count: result.data.length },
			);

			set((state) => ({
				messages: {
					...state.messages,
					[conversationId]: result.data,
				},
				messagesPagination: {
					...state.messagesPagination,
					[conversationId]: {
						isInitial: true,
						hasMore: true,
						nextCursor: result.data.length > 1 ? result.data[0]._id : null,
						isLoadingMore: false,
					},
				},
				isLoading: false,
			}));
			setTimeout(() => {
				set((state) => ({
					messagesPagination: {
						...state.messagesPagination,
						[conversationId]: {
							isInitial: false,
							hasMore: true,
							nextCursor: result.data.length > 1 ? result.data[0]._id : null,
							isLoadingMore: false,
						},
					},
					isLoading: false,
				}));
			}, 500);
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Initail Messages Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ isLoading: false });
		}
	},
	loadMessages: async (conversationId) => {
		console.log(
			"%c 🌐 [HTTP] Fetching Messages...",
			"color: #eab308; font-weight: bold;",
			{ conversationId },
		);
		set({ isLoading: true });
		try {
			const response = await fetch(
				`${API_BASE_URL}/messages/conversations/${conversationId}/messages?limit=30`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const result: HttpResponse<PaginatedMessages> = await response.json();

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
				{
					count: result.data.messages.length,
					hasMore: result.data.hasMore,
					nextCursor: result.data.nextCursor,
				},
			);

			set((state) => ({
				messages: {
					...state.messages,
					[conversationId]: result.data.messages,
				},
				messagesPagination: {
					...state.messagesPagination,
					[conversationId]: {
						isInitial: false,
						hasMore: result.data.hasMore,
						nextCursor: result.data.nextCursor,
						isLoadingMore: false,
					},
				},
				isLoading: false,
			}));
			get().notifyMessageRead(conversationId);
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Messages Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ isLoading: false });
		}
	},

	loadMoreMessages: async (conversationId) => {
		const pagination = get().messagesPagination[conversationId];

		// Don't load if already loading or no more messages
		if (!pagination || pagination.isLoadingMore || !pagination.hasMore) {
			return;
		}

		console.log(
			"%c 🌐 [HTTP] Fetching More Messages...",
			"color: #eab308; font-weight: bold;",
			{ conversationId, cursor: pagination.nextCursor },
		);

		// Set loading state
		set((state) => ({
			messagesPagination: {
				...state.messagesPagination,
				[conversationId]: {
					...state.messagesPagination[conversationId],
					isLoadingMore: true,
				},
			},
		}));

		try {
			const url = new URL(
				`${API_BASE_URL}/messages/conversations/${conversationId}/messages`,
			);
			url.searchParams.set("limit", "30");
			if (pagination.nextCursor) {
				url.searchParams.set("cursor", pagination.nextCursor);
			}

			const response = await fetch(url.toString(), {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const result: HttpResponse<PaginatedMessages> = await response.json();

			if (!result.success) {
				console.log(
					"%c ❌ [HTTP] Fetch More Messages Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				set((state) => ({
					messagesPagination: {
						...state.messagesPagination,
						[conversationId]: {
							...state.messagesPagination[conversationId],
							isLoadingMore: false,
						},
					},
				}));
				return;
			}

			console.log(
				"%c ✅ [HTTP] More Messages Fetched:",
				"color: #22c55e; font-weight: bold;",
				{
					count: result.data.messages.length,
					hasMore: result.data.hasMore,
					nextCursor: result.data.nextCursor,
				},
			);

			set((state) => {
				const currentMessages = state.messages[conversationId] || [];
				return {
					messages: {
						...state.messages,
						// Prepend older messages to the beginning
						[conversationId]: [...result.data.messages, ...currentMessages],
					},
					messagesPagination: {
						...state.messagesPagination,
						[conversationId]: {
							isInitial: false,
							hasMore: result.data.hasMore,
							nextCursor: result.data.nextCursor,
							isLoadingMore: false,
						},
					},
				};
			});
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch More Messages Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set((state) => ({
				messagesPagination: {
					...state.messagesPagination,
					[conversationId]: {
						...state.messagesPagination[conversationId],
						isLoadingMore: false,
					},
				},
			}));
		}
	},
	sendMessage: async (conversationId, content) => {
		console.log(
			"%c 📤 [Socket] Sending Message...",
			"color: #eab308; font-weight: bold;",
			{ conversationId, content },
		);
		const socket = get().socket;
		const user = useAuthStore.getState().user;

		if (!socket || !user) {
			console.log(
				"%c ❌ [Socket] Cannot send message - no socket or user",
				"color: #ef4444; font-weight: bold;",
			);
			return;
		}

		// Generate temporary ID for tracking
		const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// Create optimistic message
		const optimisticMessage: Message = {
			_id: tempId,
			conversationId,
			sender: user,
			content,
			readBy: [{ user, readAt: new Date().toISOString() }],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tempId,
			status: "pending",
		};

		// Add message to state immediately (optimistic update)
		set((state) => ({
			messages: {
				...state.messages,
				[conversationId]: [
					...(state.messages[conversationId] || []),
					optimisticMessage,
				],
			},
		}));

		// Emit to server with tempId for tracking
		socket.emit("send_message", {
			conversationId,
			content,
			tempId,
		});
	},

	notifyMessageRead: async (conversationId) => {
		console.log(
			"%c 🌐 [HTTP] Marking as Read...",
			"color: #eab308; font-weight: bold;",
			{ conversationId },
		);
		const socket = get().socket;
		if (socket) {
			socket.emit("notify_messages_read", {
				conversationId,
			});
			set((state) => ({
				conversations: state.conversations.map((conv) => {
					if (conv._id === conversationId) {
						return {
							...conv,
							unreadCount: 0,
						};
					}
					return conv;
				}),
			}));
		}
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
			messagesPagination: {},
			isLoading: false,
			typingUsers: {},
		}),
	// utility actions
	clearError: () => {},
}));
