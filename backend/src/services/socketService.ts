import { Server, Socket } from "socket.io";
import http from "http";
import { JwtService } from "./jwtService";
import { config } from "../config/environment";
import { ConversationService } from "./conversatioService";
import { UserService } from "./userService";
import { FriendshipService } from "./friendsipService";
import { MessageService } from "./messageService";
import { PopulatedFriendship } from "../schema/mongodb/friendshipSchema";

export class SocketService {
	private io: Server;

	constructor(
		server: http.Server,
		private userService: UserService,
		private friendshipService: FriendshipService,
		private conversationService: ConversationService,
		private messageService: MessageService,
	) {
		this.io = new Server(server, {
			cors: {
				origin: [config.NEXT_PUBLIC_FRONTEND_URL, "http://localhost:3000"],
				methods: ["GET", "POST"],
				credentials: true,
			},
		});
		this.io.use(this.authenticateSocket.bind(this));
		this.setupSocketListeners();
	}

	private authenticateSocket(socket: Socket, next: (err?: Error) => void) {
		const cookies = socket.handshake.headers.cookie;
		if (!cookies) {
			return next(new Error("Unauthorized - No cookies provided"));
		}

		// Parse cookies manually to extract authToken
		const token = cookies
			.split(";")
			.find((cookie) => cookie.trim().startsWith("authToken="))
			?.split("=")[1];

		if (!token) {
			return next(new Error("Unauthorized - No auth token in cookies"));
		}

		JwtService.verifyToken(token)
			.then((payload) => {
				socket.data.userId = payload;
				next();
			})
			.catch((e) => {
				console.log("error ", e);
				next(new Error("Authentication error: Invalid token"));
			});
	}

	private setupSocketListeners() {
		this.io.on("connection", async (socket) => {
			const userId = socket.data.userId as string;
			socket.join(userId);

			// User connected actions
			try {
				await this.userService.updateUserStatus(userId, "online");
				const friends = await this.friendshipService.getFriendsList(userId);
				friends.forEach((friend) => {
					this.io.to(friend._id.toString()).emit("user:statusChanged", {
						userId,
						status: "online",
					});
				});
			} catch (error) {
				console.error("Error updating user status on connect:", error);
			}

			socket.on("disconnect", async () => {
				try {
					await this.userService.updateUserStatus(userId, "offline");
					const friends = await this.friendshipService.getFriendsList(userId);
					friends.forEach((friend) => {
						this.io.to(friend._id.toString()).emit("user:statusChanged", {
							userId,
							status: "offline",
						});
					});
					socket.leave(userId);
					const rooms = Array.from(socket.rooms);
					rooms.forEach((room) => {
						if (room.startsWith("conversation_")) {
							socket.leave(room);
						}
					});
				} catch (error) {
					console.error("Error updating user status on disconnect:", error);
				}
			});

			// conversation actions
			socket.on(
				"create_conversation",
				async (data: {
					participantOneId: string;
					participantTwoId: string;
				}) => {
					try {
						const { participantOneId, participantTwoId } = data;
						const conversation =
							await this.conversationService.createConversation(
								participantOneId,
								participantTwoId,
							);

						const conversationRoomId = `conversation_${conversation._id.toString()}`;
						const participantOneSockets = await this.io
							.in(participantOneId)
							.fetchSockets();
						const participantTwoSockets = await this.io
							.in(participantTwoId)
							.fetchSockets();

						participantOneSockets.forEach((s) => s.join(conversationRoomId));
						participantTwoSockets.forEach((s) => s.join(conversationRoomId));

						this.io
							.to(participantOneId)
							.to(participantTwoId)
							.emit("conversation_created", { conversation });
					} catch (error) {
						console.error("Error creating conversation:", error);
						socket.emit("error", {
							event: "create_conversation",
							message: "Failed to create conversation",
						});
					}
				},
			);

			socket.on("join_conversation", (data: { conversationId: string }) => {
				try {
					const { conversationId } = data;
					socket.join(`conversation_${conversationId}`);
				} catch (error) {
					console.error("Error joining conversation:", error);
					socket.emit("error", {
						event: "join_conversation",
						message: "Failed to join conversation",
					});
				}
			});

			socket.on(
				"typing_conversation",
				(data: { conversationId: string; isTyping: boolean }) => {
					try {
						const { conversationId, isTyping } = data;

						socket
							.to(`conversation_${conversationId}`)
							.emit("conversation_typing", {
								conversationId,
								userId,
								isTyping,
							});
					} catch (error) {
						console.error("Error handling typing event:", error);
					}
				},
			);

			// messaging actions
			socket.on(
				"send_message",
				async (data: { conversationId: string; content: string }) => {
					try {
						const { conversationId, content } = data;
						const message = await this.messageService.sendMessage({
							conversationId,
							senderId: userId,
							content,
						});
						this.io
							.to(`conversation_${conversationId}`)
							.emit("new_message", message);
					} catch (error) {
						console.error("Error sending message:", error);
						socket.emit("error", {
							event: "send_message",
							message: "Failed to send message",
						});
					}
				},
			);

			socket.on(
				"read_all_messages",
				async (data: { conversationId: string }) => {
					try {
						const { conversationId } = data;
						await this.messageService.markConversationMessagesAsRead(
							conversationId,
							userId,
						);
						this.io.to(`conversation_${conversationId}`).emit("messages_read", {
							conversationId,
							userId,
						});
					} catch (error) {
						console.error("Error marking messages as read:", error);
						socket.emit("error", {
							event: "read_all_messages",
							message: "Failed to mark messages as read",
						});
					}
				},
			);

			// friendShip actions
			socket.on(
				"notify_friendship_request_sent",
				async (data: { friendship: PopulatedFriendship }) => {
					try {
						const { friendship } = data;
						if (
							friendship.recipient._id.toString() !== userId &&
							friendship.requester._id.toString() !== userId
						) {
							throw new Error("Unauthorized to send this notification");
						}
						const receiverId = friendship.recipient._id.toString();
						this.io.to(receiverId).emit("friendship_request_received", {
							friendship,
						});
					} catch (error) {
						console.error("Error sending friendship request:", error);
						socket.emit("error", {
							event: "notify_friendship_request_sent",
							message: "Failed to notify friendship request",
						});
					}
				},
			);

			socket.on(
				"notify_friendship_request_accepted",
				async (data: { friendship: PopulatedFriendship }) => {
					try {
						const { friendship } = data;
						if (
							friendship.recipient._id.toString() !== userId &&
							friendship.requester._id.toString() !== userId
						) {
							throw new Error("Unauthorized to send this notification");
						}
						const requesterId = friendship.requester._id.toString();
						this.io
							.to(requesterId)
							.emit("friendship_request_accepted", { friendship });
					} catch (error) {
						console.error("Error accepting friendship request:", error);
						socket.emit("error", {
							event: "notify_friendship_request_accepted",
							message: "Failed to accept friendship request",
						});
					}
				},
			);

			socket.on(
				"notify_friendship_request_declined",
				async (data: { friendship: PopulatedFriendship }) => {
					try {
						const { friendship } = data;
						if (
							friendship.recipient._id.toString() !== userId &&
							friendship.requester._id.toString() !== userId
						) {
							throw new Error("Unauthorized to send this notification");
						}

						const otherParticipent =
							friendship.requester._id.toString() === userId
								? friendship.recipient._id.toString()
								: friendship.requester._id.toString();

						this.io
							.to(otherParticipent)
							.emit("friendship_request_declined", { friendship });
					} catch (error) {
						console.error("Error declining friendship request:", error);
						socket.emit("error", {
							event: "notify_friendship_request_declined",
							message: "Failed to decline friendship request",
						});
					}
				},
			);

			socket.on(
				"notify_friendship_request_cancelled",
				async (data: { friendship: PopulatedFriendship }) => {
					try {
						const { friendship } = data;

						if (
							friendship.recipient._id.toString() !== userId &&
							friendship.requester._id.toString() !== userId
						) {
							throw new Error("Unauthorized to send this notification");
						}
						const otherParticipent =
							friendship.requester._id.toString() === userId
								? friendship.recipient._id.toString()
								: friendship.requester._id.toString();
						this.io.to(otherParticipent).emit("friendship_request_cancelled", {
							friendship,
						});
					} catch (error) {
						console.error("Error canclling friendship request:", error);
						socket.emit("error", {
							event: "notify_friendship_request_cancelled",
							message: "Failed to cancell friendship request",
						});
					}
				},
			);

			socket.on(
				"notify_friendship_unfriended",
				async (data: { friendship: PopulatedFriendship }) => {
					try {
						const { friendship } = data;

						if (
							friendship.recipient._id.toString() !== userId &&
							friendship.requester._id.toString() !== userId
						) {
							throw new Error("Unauthorized to send this notification");
						}
						const otherParticipent =
							friendship.requester._id.toString() === userId
								? friendship.recipient._id.toString()
								: friendship.requester._id.toString();
						this.io
							.to(otherParticipent)
							.emit("friendship_unfriended", { friendship });
					} catch (error) {
						console.error("Error unfriending friendship :", error);
						socket.emit("error", {
							event: "notify_friendship_unfriended",
							message: "Failed to unfriend",
						});
					}
				},
			);
		});
	}
}
