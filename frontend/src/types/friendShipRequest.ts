import { User } from "./user";

export type FriendShipRequest = {
  _id: string;
  requester: User;
  recipient: User;
  status: "pending" | "accepted" | "blocked";
  blockedBy?: User | null;
  createdAt: string;
  updatedAt: string;
};
