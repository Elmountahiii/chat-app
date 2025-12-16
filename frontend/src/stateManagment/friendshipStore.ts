import { create } from "zustand";
import { User } from "@/types/user";
import { FriendShipRequest } from "@/types/friendShipRequest";
import { HttpResponse } from "@/types/httpResponse";
import { useChatStore } from "./chatStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: "http://localhost:3001/api";

interface FriendshipState {
	// State
	friends: User[];
	potentialFriends: User[];
	receivedFriendshipRequests: FriendShipRequest[];
	sentFriendshipRequests: FriendShipRequest[];
	isLoading: boolean;
	error: string | null;

	// Actions
	getAllFriends: () => Promise<void>;
	searchForPotentialFriends: (query: string) => Promise<void>;
	getReceivedFriendshipRequests: () => Promise<void>;
	getSentFriendshipRequests: () => Promise<void>;
	sendFriendshipRequest: (receiverId: string) => Promise<void>;
	cancelFriendshipRequest: (friendshipId: string) => Promise<void>;
	acceptFriendshipRequest: (FriendshipId: string) => Promise<void>;
	declineFriendshipRequest: (FriendshipId: string) => Promise<void>;
	unfriendUser: (userId: string) => Promise<void>;
	blockFriend: (userId: string) => Promise<void>;
	clearError: () => void;

	// Utility to update friends status from socket
	updateFriendStatus: (
		userId: string,
		status: "online" | "offline" | "away",
	) => void;

	// Socket event handlers
	addIncomingFriendshipRequest: (friendship: FriendShipRequest) => void;
	handleFriendshipRequestAccepted: (friendship: FriendShipRequest) => void;
	handleFriendshipRequestDeclined: (friendship: FriendShipRequest) => void;
	handleFriendshipRequestCancelled: (friendship: FriendShipRequest) => void;
	handleFriendshipUnfriend: () => void;
}

export const useFriendshipStore = create<FriendshipState>((set, get) => ({
	// State
	friends: [],
	potentialFriends: [],
	receivedFriendshipRequests: [],
	sentFriendshipRequests: [],
	isLoading: false,
	error: null,

	// Actions
	getAllFriends: async () => {
		console.log(
			"%c 🌐 [HTTP] Fetching Friends...",
			"color: #eab308; font-weight: bold;",
		);
		set({ isLoading: true, error: null });
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
				console.log(
					"%c ❌ [HTTP] Fetch Friends Failed:",
					"color: #ef4444; font-weight: bold;",
					result.errorMessage,
				);
				set({ error: result.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Friends Fetched:",
				"color: #22c55e; font-weight: bold;",
				result.data,
			);

			set({ friends: result.data });
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Friends Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to fetch friends" });
		} finally {
			set({ isLoading: false });
		}
	},

	searchForPotentialFriends: async (query: string) => {
		console.log(
			"%c 🌐 [HTTP] Searching Potential Friends...",
			"color: #eab308; font-weight: bold;",
			{ query },
		);
		set({ isLoading: true, error: null });

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

			const response: HttpResponse<User[]> = await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Search Potential Friends Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Potential Friends Found:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
			set({ potentialFriends: response.data });
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Search Potential Friends Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to search for friends" });
		} finally {
			set({ isLoading: false });
		}
	},

	getReceivedFriendshipRequests: async () => {
		console.log(
			"%c 🌐 [HTTP] Fetching Received Friendship Requests...",
			"color: #eab308; font-weight: bold;",
		);
		set({ isLoading: true, error: null });
		try {
			const rawResponse = await fetch(`${API_BASE_URL}/friendship/pending`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const response: HttpResponse<FriendShipRequest[]> =
				await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Fetch Received Friendship Requests Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Received Friendship Requests Fetched:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
			set({ receivedFriendshipRequests: response.data });
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Received Friendship Requests Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to fetch received friendship requests" });
		} finally {
			set({ isLoading: false });
		}
	},

	getSentFriendshipRequests: async () => {
		console.log(
			"%c 🌐 [HTTP] Fetching Sent Friendship Requests...",
			"color: #eab308; font-weight: bold;",
		);
		set({ isLoading: true, error: null });
		try {
			const rawResponse = await fetch(`${API_BASE_URL}/friendship/sent`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const response: HttpResponse<FriendShipRequest[]> =
				await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Fetch Sent Friendship Requests Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Sent Friendship Requests Fetched:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
			set({ sentFriendshipRequests: response.data });
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Sent Friendship Requests Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to fetch sent friendship requests" });
		} finally {
			set({ isLoading: false });
		}
	},

	sendFriendshipRequest: async (receiverId: string) => {
		console.log(
			"%c 🌐 [HTTP] Sending Friendship Request...",
			"color: #eab308; font-weight: bold;",
			{ receiverId },
		);
		set({ isLoading: true, error: null });
		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/friendship/request/${receiverId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Send Friendship Request Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Friendship Request Sent:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);

			// Notify via socket
			useChatStore.getState().notifyFriendshipSent(response.data);

			const updatedPotentialFriends = get().potentialFriends.map((pf) => {
				if (pf._id === receiverId) {
					return {
						...pf,
						friendship: response.data,
					};
				}
				return pf;
			});
			set((state) => ({
				potentialFriends: updatedPotentialFriends,
				sentFriendshipRequests: [
					...state.sentFriendshipRequests,
					response.data,
				],
			}));
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Send Friendship Request Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to send friendship request" });
		} finally {
			set({ isLoading: false });
		}
	},

	cancelFriendshipRequest: async (friendshipId: string) => {
		console.log(
			"%c 🌐 [HTTP] Canceling Friendship Request...",
			"color: #eab308; font-weight: bold;",
			{ friendshipId },
		);
		set({ isLoading: true, error: null });
		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/friendship/cancel/${friendshipId}`,
				{
					method: "DELETE",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Cancel Friendship Request Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Friendship Request Canceled:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);

			set((state) => ({
				sentFriendshipRequests: state.sentFriendshipRequests.filter(
					(r) => r._id !== friendshipId,
				),
			}));

			useChatStore.getState().notifyFriendshipCancelled(response.data);
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Cancel Friendship Request Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to cancel friendship request" });
		} finally {
			set({ isLoading: false });
		}
	},

	acceptFriendshipRequest: async (FriendshipId: string) => {
		console.log(
			"%c 🌐 [HTTP] Accepting Friendship Request...",
			"color: #eab308; font-weight: bold;",
			{ FriendshipId },
		);
		set({ isLoading: true, error: null });
		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/friendship/accept/${FriendshipId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Accept Friendship Request Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Friendship Request Accepted:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);

			// Notify via socket
			useChatStore.getState().notifyFriendshipAccepted(response.data);

			set({
				receivedFriendshipRequests: get().receivedFriendshipRequests.filter(
					(request) => request._id !== response.data._id,
				),
			});

			get().getAllFriends();
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Accept Friendship Request Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to accept friendship request" });
		} finally {
			set({ isLoading: false });
		}
	},

	declineFriendshipRequest: async (FriendshipId: string) => {
		console.log(
			"%c 🌐 [HTTP] Declining Friendship Request...",
			"color: #eab308; font-weight: bold;",
			{ FriendshipId },
		);
		set({ isLoading: true, error: null });
		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/friendship/decline/${FriendshipId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();
			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Decline Friendship Request Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Friendship Request Declined:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);

			set({
				receivedFriendshipRequests: get().receivedFriendshipRequests.filter(
					(request) => {
						if (response.data._id === request._id) return false;
						return true;
					},
				),
			});
			useChatStore.getState().notifyFriendshipDeclined(response.data);
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Decline Friendship Request Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to decline friendship request" });
		} finally {
			set({ isLoading: false });
		}
	},

	unfriendUser: async (userId) => {
		console.log(
			"%c 🌐 [HTTP] Unfriending User...",
			"color: #eab308; font-weight: bold;",
			{ userId },
		);
		set({
			isLoading: true,
			error: null,
		});

		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/friendship/remove/${userId}`,
				{
					method: "DELETE",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();

			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Unfriend User Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] User Unfriended:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
			set((state) => ({
				friends: state.friends.filter((friend) => friend._id !== userId),
				receivedFriendshipRequests: state.receivedFriendshipRequests.filter(
					(request) =>
						request.requester._id !== userId &&
						request.recipient._id !== userId,
				),
				sentFriendshipRequests: state.sentFriendshipRequests.filter(
					(request) =>
						request.requester._id !== userId &&
						request.recipient._id !== userId,
				),
			}));

			useChatStore.getState().notifyUnfriend(response.data);
		} catch (err) {
			console.log(
				"%c ❌ [HTTP] Unfriend User Error:",
				"color: #ef4444; font-weight: bold;",
				err,
			);
			set({ error: "Failed to unfriend user" });
		} finally {
			set({
				isLoading: false,
			});
		}
	},
	blockFriend: async (userId) => {
		console.log(
			"%c 🌐 [HTTP] Blocking User...",
			"color: #eab308; font-weight: bold;",
			{ userId },
		);
		set({
			isLoading: true,
			error: null,
		});

		try {
			const rawResponse = await fetch(
				`${API_BASE_URL}/friendship/block/${userId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const response: HttpResponse<FriendShipRequest> =
				await rawResponse.json();

			if (!response.success) {
				console.log(
					"%c ❌ [HTTP] Block User Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] User Blocked:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
			set((state) => ({
				friends: state.friends.filter((friend) => friend._id !== userId),
				receivedFriendshipRequests: state.receivedFriendshipRequests.filter(
					(request) =>
						request.requester._id !== userId &&
						request.recipient._id !== userId,
				),
				sentFriendshipRequests: state.sentFriendshipRequests.filter(
					(request) =>
						request.requester._id !== userId &&
						request.recipient._id !== userId,
				),
			}));

			useChatStore.getState().notifyUnfriend(response.data);
		} catch (err) {
			console.log(
				"%c ❌ [HTTP] Block User Error:",
				"color: #ef4444; font-weight: bold;",
				err,
			);
			set({ error: "Failed to block user" });
		} finally {
			set({
				isLoading: false,
			});
		}
	},

	clearError: () => set({ error: null }),

	updateFriendStatus: (userId, status) => {
		set((state) => ({
			friends: state.friends.map((friend) => {
				if (friend._id === userId) {
					return { ...friend, status: status };
				}
				return friend;
			}),
		}));
	},

	addIncomingFriendshipRequest: (request) => {
		const exists = get().receivedFriendshipRequests.some(
			(r) => r._id === request._id,
		);
		if (!exists) {
			set((state) => ({
				receivedFriendshipRequests: [
					...state.receivedFriendshipRequests,
					request,
				],
			}));
		}
	},

	handleFriendshipRequestAccepted: (request) => {
		set((state) => ({
			sentFriendshipRequests: state.sentFriendshipRequests.filter(
				(r) => r._id !== request._id,
			),
		}));
		get().getAllFriends();
	},

	handleFriendshipRequestDeclined: (friendship) => {
		set((state) => ({
			sentFriendshipRequests: state.sentFriendshipRequests.filter(
				(r) => r._id !== friendship._id,
			),
		}));
	},

	handleFriendshipRequestCancelled: (friendship) => {
		set((state) => ({
			receivedFriendshipRequests: state.receivedFriendshipRequests.filter(
				(r) => r._id !== friendship._id,
			),
		}));
	},

	handleFriendshipUnfriend: () => {
		get().getAllFriends();
	},
}));
