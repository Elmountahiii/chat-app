import type { Socket } from "socket.io-client";
import { User } from "../user";
import { Conversation } from "../converstation";
import { Message } from "../message";
import { PotentialFriend } from "../potentialFriend";
import { FriendShipRequest } from "../friendShipRequest";

export type ConnectivityStatus = "connected" | "disconnected" | "connecting";

export type chatState = {
	socket: Socket | null;
	status: ConnectivityStatus;
	friends: User[];
	conversations: Conversation[];
	activeConversationId: string | null;
	messages: Record<string, Message[]>;
	hasMessages: Record<string, boolean>;
	loadingMessages: Record<string, boolean>;
	isLoading: boolean;
	typingUsers: Record<string, string[]>;
	potentialFriends: PotentialFriend[];
	friendshipRequests: FriendShipRequest[];
};
