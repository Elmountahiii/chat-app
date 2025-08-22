import { User } from "./user";

export type FriendshipRequest = {
  id: string;
  requester: User;
  sentAt: Date;
};
