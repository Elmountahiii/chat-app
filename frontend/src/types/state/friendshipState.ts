import { FriendshipRequest } from "../FriendshipRequest";
import { PotentialFriend } from "../potentialFriend";
import { User } from "../user";

export type friendshipState = {
  friends: User[];
  potentialFriends: PotentialFriend[];
  friendshipRequests: FriendshipRequest[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
};
