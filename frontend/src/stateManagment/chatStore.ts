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

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: "http://localhost:3001/api";

const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

type ChatStore = chatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
	// state
	socket: null,
	status: "disconnected",

	friends: [],

	conversations: [],
	activeConversationId: null,
	messages: {},
	hasMessages: {},
	loadingMessages: {},
	isLoading: false,
	typingUsers: {},

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
			path: "/socket.io",
		});

		socket.on("connect_error", (err) => {
			console.log("%c ❌ [Socket] Connection Error:", "color: #ef4444; font-weight: bold;", err);
			set({ status: "disconnected", socket: null });
		});

		socket.on("connect", async () => {
			console.log("%c ⚡ [Socket] Connected", "color: #0ea5e9; font-weight: bold;");
			set({ status: "connected", socket });
			await get().getAllFriends();
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
			console.log("%c 🔌 [Socket] Disconnected", "color: #0ea5e9; font-weight: bold;");
			set({ status: "disconnected", socket: null });
		});

		// User status events
		socket.on(
			"user:statusChanged",
			(data: { userId: string; status: "online" | "offline" | "away" }) => {
				console.log("%c 👤 [Socket] User Status Changed:", "color: #0ea5e9; font-weight: bold;", data);
				set((state) => ({
					friends: state.friends.map((friend) => {
						if (friend._id === data.userId) {
							return { ...friend, status: data.status };
						}
						return friend;
					}),
				}));
			},
		);

		// Conversation events
		socket.on(
			"conversation_created",
			(data: { conversation: Conversation }) => {
				console.log("%c 💬 [Socket] Conversation Created:", "color: #0ea5e9; font-weight: bold;", data);
			},
		);

		socket.on(
			"conversation_typing",
			(data: {
				conversationId: string;
				userId: string;
				isTyping: boolean;
			}) => {
				console.log("%c ⌨️ [Socket] Typing Status:", "color: #0ea5e9; font-weight: bold;", data);
			},
		);

		// Message events
		socket.on("new_message", (message: Message) => {
			console.log("%c 📩 [Socket] New Message:", "color: #0ea5e9; font-weight: bold;", message);
		});

		socket.on(
			"messages_read",
			(data: { conversationId: string; userId: string }) => {
				console.log("%c 👀 [Socket] Messages Read:", "color: #0ea5e9; font-weight: bold;", data);
			},
		);

		// Friendship events
		socket.on(
			"friendship_request_received",
			(data: { friendship: FriendShipRequest }) => {
				console.log("%c 🤝 [Socket] Friend Request Received:", "color: #0ea5e9; font-weight: bold;", data);
			},
		);

		socket.on(
			"friendship_request_accepted",
			(data: { friendship: FriendShipRequest }) => {
				console.log("%c 🤝 [Socket] Friend Request Accepted:", "color: #0ea5e9; font-weight: bold;", data);
			},
		);

		socket.on(
			"friendship_request_declined",
			(data: { friendshipId: string }) => {
				console.log("%c 🤝 [Socket] Friend Request Declined:", "color: #0ea5e9; font-weight: bold;", data);
			},
		);

		// Error handling
		socket.on("error", (error: { event: string; message: string }) => {
			console.log("%c ⚠️ [Socket] Error:", "color: #ef4444; font-weight: bold;", error);
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
		console.log("%c 🌐 [HTTP] Fetching Conversations...", "color: #eab308; font-weight: bold;");
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
				console.log("%c ❌ [HTTP] Fetch Conversations Failed:", "color: #ef4444; font-weight: bold;", result.errorMessage);
				return;
			}

			console.log("%c ✅ [HTTP] Conversations Fetched:", "color: #22c55e; font-weight: bold;", result.data);

			set({ conversations: result.data, isLoading: false });
		} catch (e) {
			console.log("%c ❌ [HTTP] Fetch Conversations Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	createConversation: async (participants, type, groupName) => {
		console.log("%c 🌐 [HTTP] Creating Conversation...", "color: #eab308; font-weight: bold;", { participants, type, groupName });
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
				},
			);
			const response: HttpResponse<Conversation> = await rawResponse.json();
			if (!response.success) {
				console.log("%c ❌ [HTTP] Create Conversation Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}

			console.log("%c ✅ [HTTP] Conversation Created:", "color: #22c55e; font-weight: bold;", response.data);

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
			console.log("%c ❌ [HTTP] Create Conversation Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	setActiveConversation: (conversationId) => {
		set({ activeConversationId: conversationId });
	},

	// message actions
	fetchMessages: async (conversationId, limit = 5) => {
		console.log("%c 🌐 [HTTP] Fetching Messages...", "color: #eab308; font-weight: bold;", { conversationId, limit });
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
				console.log("%c ❌ [HTTP] Fetch Messages Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				set({
					loadingMessages: {
						...get().loadingMessages,
						[conversationId]: false,
					},
				});
				return;
			}
			
			console.log("%c ✅ [HTTP] Messages Fetched:", "color: #22c55e; font-weight: bold;", { count: response.data.messages.length, hasMore: response.data.hasMore });

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
			console.log("%c ❌ [HTTP] Fetch Messages Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},
	sendMessage: async (conversationId, content) => {
		console.log("%c 🌐 [HTTP] Sending Message...", "color: #eab308; font-weight: bold;", { conversationId, content });
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
				console.log("%c ❌ [HTTP] Send Message Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Message Sent:", "color: #22c55e; font-weight: bold;", response.data);
		} catch (e) {
			console.log("%c ❌ [HTTP] Send Message Error:", "color: #ef4444; font-weight: bold;", e);
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
		console.log("%c 🌐 [HTTP] Marking as Read...", "color: #eab308; font-weight: bold;", { conversationId });
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
				console.log("%c ❌ [HTTP] Mark as Read Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Marked as Read:", "color: #22c55e; font-weight: bold;", response.data);
		} catch (e) {
			console.log("%c ❌ [HTTP] Mark as Read Error:", "color: #ef4444; font-weight: bold;", e);
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
	getAllFriends: async () => {
		console.log("%c 🌐 [HTTP] Fetching Friends...", "color: #eab308; font-weight: bold;");
		set({ isLoading: true });
		try {
			const response = await fetch(`${API_BASE_URL}/friendship/friends`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const result: HttpResponse<User[]> = await response.json();
			if (!result.success) {
				console.log("%c ❌ [HTTP] Fetch Friends Failed:", "color: #ef4444; font-weight: bold;", result.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Friends Fetched:", "color: #22c55e; font-weight: bold;", result.data);

			set({ friends: result.data });
		} catch (e) {
			console.log("%c ❌ [HTTP] Fetch Friends Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	searchForPotentialFriends: async (query: string) => {
		console.log("%c 🌐 [HTTP] Searching Potential Friends...", "color: #eab308; font-weight: bold;", { query });
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
				},
			);

			const response: HttpResponse<PotentialFriend[]> =
				await rawResponse.json();
			if (!response.success) {
				console.log("%c ❌ [HTTP] Search Potential Friends Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Potential Friends Found:", "color: #22c55e; font-weight: bold;", response.data);
			set({ potentialFriends: response.data });
		} catch (e) {
			console.log("%c ❌ [HTTP] Search Potential Friends Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	getAllFriendshipRequests: async () => {
		console.log("%c 🌐 [HTTP] Fetching Friendship Requests...", "color: #eab308; font-weight: bold;");
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
				console.log("%c ❌ [HTTP] Fetch Friendship Requests Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Friendship Requests Fetched:", "color: #22c55e; font-weight: bold;", response.data);
			set({ friendshipRequests: response.data });
		} catch (e) {
			console.log("%c ❌ [HTTP] Fetch Friendship Requests Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	sendFriendshipRequest: async (receiverId: string) => {
		console.log("%c 🌐 [HTTP] Sending Friendship Request...", "color: #eab308; font-weight: bold;", { receiverId });
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
				console.log("%c ❌ [HTTP] Send Friendship Request Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Friendship Request Sent:", "color: #22c55e; font-weight: bold;", response.data);
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
			console.log("%c ❌ [HTTP] Send Friendship Request Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	acceptFriendshipRequest: async (FriendshipId: string) => {
		console.log("%c 🌐 [HTTP] Accepting Friendship Request...", "color: #eab308; font-weight: bold;", { FriendshipId });
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
				console.log("%c ❌ [HTTP] Accept Friendship Request Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Friendship Request Accepted:", "color: #22c55e; font-weight: bold;", response.data);

			set({
				friendshipRequests: get().friendshipRequests.map((request) => {
					if (response.data._id == request._id) return response.data;
					return request;
				}),
			});
			get().getAllFriends();
		} catch (e) {
			console.log("%c ❌ [HTTP] Accept Friendship Request Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	declineFriendshipRequest: async (FriendshipId: string) => {
		console.log("%c 🌐 [HTTP] Declining Friendship Request...", "color: #eab308; font-weight: bold;", { FriendshipId });
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
				console.log("%c ❌ [HTTP] Decline Friendship Request Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] Friendship Request Declined:", "color: #22c55e; font-weight: bold;", response.data);

			set({
				friendshipRequests: get().friendshipRequests.filter((request) => {
					if (response.data._id == request._id) return response.data;
				}),
			});
		} catch (e) {
			console.log("%c ❌ [HTTP] Decline Friendship Request Error:", "color: #ef4444; font-weight: bold;", e);
		} finally {
			set({ isLoading: false });
		}
	},

	unfriendUser: async (userId) => {
		console.log("%c 🌐 [HTTP] Unfriending User...", "color: #eab308; font-weight: bold;", { userId });
		set({
			isLoading: true,
		});

		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/user/remove-friend/${userId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				},
			);

			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();
			
			if (!response.success) {
				console.log("%c ❌ [HTTP] Unfriend User Failed:", "color: #ef4444; font-weight: bold;", response.errorMessage);
				return;
			}
			console.log("%c ✅ [HTTP] User Unfriended:", "color: #22c55e; font-weight: bold;", response.data);
		} catch (err) {
			console.log("%c ❌ [HTTP] Unfriend User Error:", "color: #ef4444; font-weight: bold;", err);
		} finally {
			set({
				isLoading: false,
			});
		}
	},
	blockFriend: async (userId) => {},
}));
