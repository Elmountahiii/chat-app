
export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
  lastActive: Date;
};
