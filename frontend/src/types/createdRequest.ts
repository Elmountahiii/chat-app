export type CreatedRequest = {
  _id: string;
  requester: string;
  recipient: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
};
