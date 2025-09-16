import { FriendShipRequest } from "../FriendShipRequest";
import { PotentialFriend } from "../potentialFriend";
import { User } from "../user";

export type friendshipState = {
  friends: User[];
  potentialFriends: PotentialFriend[];
  friendshipRequests: FriendShipRequest[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
};
