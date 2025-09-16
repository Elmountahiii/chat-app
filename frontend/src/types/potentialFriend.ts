import { FriendShipRequest } from "./friendShipRequest";
import { User } from "./user";

export type PotentialFriend = User & {
  friendship: FriendShipRequest
};
