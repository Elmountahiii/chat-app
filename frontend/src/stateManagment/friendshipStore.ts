import { create } from "zustand";
import { User } from "@/types/user";
import { PotentialFriend } from "@/types/potentialFriend";
import { FriendShipRequest } from "@/types/friendShipRequest";
import { HttpResponse } from "@/types/httpResponse";
import { useChatStore } from "./chatStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
	? process.env.NEXT_PUBLIC_BACKEND_URL
	: "http://localhost:3001/api";

interface FriendshipState {
	// State
	friends: User[];
	potentialFriends: PotentialFriend[];
	friendshipRequests: FriendShipRequest[];
	isLoading: boolean;
	error: string | null;

	// Actions
	getAllFriends: () => Promise<void>;
	searchForPotentialFriends: (query: string) => Promise<void>;
	getAllFriendshipRequests: () => Promise<void>;
	sendFriendshipRequest: (receiverId: string) => Promise<void>;
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
	addIncomingFriendshipRequest: (request: FriendShipRequest) => void;
	handleFriendshipRequestAccepted: (request: FriendShipRequest) => void;
	handleFriendshipRequestDeclined: (friendshipId: string) => void;
}

export const useFriendshipStore = create<FriendshipState>((set, get) => ({
	// State
	friends: [],
	potentialFriends: [],
	friendshipRequests: [],
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

			const response: HttpResponse<PotentialFriend[]> =
				await rawResponse.json();
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

	getAllFriendshipRequests: async () => {
		console.log(
			"%c 🌐 [HTTP] Fetching Friendship Requests...",
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
					"%c ❌ [HTTP] Fetch Friendship Requests Failed:",
					"color: #ef4444; font-weight: bold;",
					response.errorMessage,
				);
				set({ error: response.errorMessage });
				return;
			}
			console.log(
				"%c ✅ [HTTP] Friendship Requests Fetched:",
				"color: #22c55e; font-weight: bold;",
				response.data,
			);
			set({ friendshipRequests: response.data });
		} catch (e) {
			console.log(
				"%c ❌ [HTTP] Fetch Friendship Requests Error:",
				"color: #ef4444; font-weight: bold;",
				e,
			);
			set({ error: "Failed to fetch friendship requests" });
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
			useChatStore.getState().notifyFriendshipSent(response.data._id);

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
			useChatStore.getState().notifyFriendshipAccepted(response.data._id);

			set({
				friendshipRequests: get().friendshipRequests.map((request) => {
					if (response.data._id === request._id) return response.data;
					return request;
				}),
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
				friendshipRequests: get().friendshipRequests.filter((request) => {
					if (response.data._id === request._id) return false;
					return true;
				}),
			});
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

			const response: HttpResponse<null> = await rawResponse.json();

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
		const exists = get().friendshipRequests.some((r) => r._id === request._id);
		if (!exists) {
			set((state) => ({
				friendshipRequests: [...state.friendshipRequests, request],
			}));
		}
	},

	handleFriendshipRequestAccepted: (request) => {
		set((state) => ({
			friendshipRequests: state.friendshipRequests.filter(
				(r) => r._id !== request._id,
			),
		}));
		get().getAllFriends();
	},

	handleFriendshipRequestDeclined: (friendshipId) => {
		set((state) => ({
			friendshipRequests: state.friendshipRequests.filter(
				(r) => r._id !== friendshipId,
			),
		}));
	},
}));
