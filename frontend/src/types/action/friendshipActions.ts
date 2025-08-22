export type FriendshipActions = {
  // friendship requests
  getAllFriends: () => void;
  getAllFriendshipRequests: () => void;
  sendFriendshipRequest: (receiverId: string) => void;
  acceptFriendshipRequest: (FriendshipId: string) => void;
  declineFriendshipRequest: (FriendshipId: string) => void;
  searchForPotentialFriends: (query: string) => void;

  // error handling
  setError: (error: string) => void;
  clearError: () => void;

  // success handling
  setSuccessMessage: (message: string) => void;
  clearSuccessMessage: () => void;

  // loading state
  setLoading: (isLoading: boolean) => void;
};
