import { User } from "./user";

export type FriendShipRequest = {
  _id: string;
  requester: User;
  recipient: User;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
};
