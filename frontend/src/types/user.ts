export type User = {
	_id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	createdAt: string;
	updatedAt: string;
	profilePicture: string;
	status: "online" | "offline" | "away";
	lastSeen: string;
	lastActive: string;
};
