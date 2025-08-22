import { FriendshipActions } from "@/types/action/friendshipActions";
import { friendshipState } from "@/types/state/friendshipState";
import { create } from "zustand";
import { HttpResponse } from "@/types/httpResponse";
import { FriendshipRequest } from "@/types/FriendshipRequest";
import { CreatedRequest } from "@/types/createdRequest";
import { PotentialFriend } from "@/types/potentialFriend";
import { User } from "@/types/user";

type FriendshipStore = friendshipState & FriendshipActions;
const apiUrl = "http://localhost:3001/api";

export const useFriendshipStore = create<FriendshipStore>((set, get) => ({
  friends: [],
  potentialFriends: [],
  friendshipRequests: [],
  isLoading: false,
  error: null,
  successMessage: null,
  getAllFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/friends/all-friends`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: HttpResponse<User[]> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      console.log("Fetched all friends:", data.data);
      set({
        friends: data.data,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: "Failed to get all friends.",
      });
      console.warn(`error in getting all friends: ${e}`);
    }
  },
  searchForPotentialFriends: async (query: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${apiUrl}/friends/search?query=${query}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: HttpResponse<PotentialFriend[]> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }

      set({
        potentialFriends: data.data,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: "Failed to search for potential friends.",
      });
      console.warn(`error in searching for potential friends: ${e}`);
    }
  },
  getAllFriendshipRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/friends/pending-requests`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: HttpResponse<FriendshipRequest[]> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      set({
        isLoading: false,
        friendshipRequests: data.data,
        error: null,
      });
    } catch (e) {
      console.warn(`error in fetching friendship requests: ${e}`);
      set({
        isLoading: false,
        error: "Failed to fetch friendship requests.",
      });
    }
  },
  sendFriendshipRequest: async (receiverId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/friends/send-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId }),
      });
      const data: HttpResponse<CreatedRequest> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      set({
        potentialFriends: get().potentialFriends.map((friend) => {
          if (friend._id === receiverId) {
            return {
              ...friend,
              friendship: { ...friend.friendship, status: "pending" },
            };
          }
          return friend;
        }),
        isLoading: false,
        error: null,
      });
    } catch (e) {
      console.warn(`error in sending friendship request: ${e}`);
      set({
        isLoading: false,
        error: "Failed to send friendship request.",
      });
    }
  },
  acceptFriendshipRequest: async (FriendshipId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/friends/accept-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendshipId: FriendshipId }),
      });
      const data: HttpResponse<CreatedRequest> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      set({
        friendshipRequests: get().friendshipRequests.filter(
          (request) => request.id !== FriendshipId
        ),
        isLoading: false,
        successMessage: data.successMessage,
        error: null,
      });
    } catch (e) {
      console.warn(`error in accepting friendship request: ${e}`);
      set({
        isLoading: false,
        error: "Failed to accept friendship request.",
      });
    }
  },
  declineFriendshipRequest: async (FriendshipId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${apiUrl}/friends/decline-request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendshipId: FriendshipId }),
      });
      const data: HttpResponse<CreatedRequest> = await response.json();
      if (!data.success) {
        set({
          isLoading: false,
          error: data.errorMessage,
        });
        return;
      }
      set({
        friendshipRequests: get().friendshipRequests.filter(
          (request) => request.id !== FriendshipId
        ),
        isLoading: false,
        successMessage: data.successMessage,
        error: null,
      });
    } catch (e) {
      console.warn(`error in declining friendship request: ${e}`);
      set({
        isLoading: false,
        error: "Failed to decline friendship request.",
      });
    }
  },
  setError: (error: string) => {
    set({ error });
  },
  clearError: () => {
    set({ error: null });
  },
  setSuccessMessage: (message: string) => {
    set({ successMessage: message });
  },
  clearSuccessMessage: () => {
    set({ successMessage: null });
  },
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
