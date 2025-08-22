import { User } from "./user";
import { CreatedRequest } from "./createdRequest";

export type PotentialFriend = User & {
  friendship: CreatedRequest & { isRequester: boolean };
};
