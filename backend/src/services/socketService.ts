import { Server, Socket } from "socket.io";
import http from "http";
import { JwtService } from "./jwtService";
import { config } from "../config/environment";
import { ConversationService } from "./conversatioService";
import { UserService } from "./userService";
import { FriendshipService } from "./friendsipService";
import { MessageService } from "./messageService";
import { PopulatedFriendship } from "../schema/mongodb/friendshipSchema";
import { PopulatedConversation } from "../schema/mongodb/conversationSchema";
import { AppError, HttpStatus } from "../types/common";
import { logger } from "../config/logger";

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
				origin: [
					config.NEXT_PUBLIC_FRONTEND_URL,
					"http://localhost:3000",
					"http://192.168.1.3:3000",
				],
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
			return next(new AppError("Unauthorized - No cookies provided", HttpStatus.UNAUTHORIZED));
		}

		// Parse cookies manually to extract authToken
		const token = cookies
			.split(";")
			.find((cookie) => cookie.trim().startsWith("authToken="))
			?.split("=")[1];

		if (!token) {
			return next(new AppError("Unauthorized - No auth token in cookies", HttpStatus.UNAUTHORIZED));
		}

		JwtService.verifyToken(token)
			.then((payload) => {
				socket.data.userId = payload;
				next();
			})
			.catch((e) => {
				logger.error("Authentication error:", e);
				next(new AppError("Authentication error: Invalid token", HttpStatus.UNAUTHORIZED));
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
				logger.error("Error updating user status on connect:", error);
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
					logger.error("Error updating user status on disconnect:", error);
				}
			});

			// conversation actions
			socket.on(
				"notify_conversation_created",
				async (data: { conversation: PopulatedConversation }) => {
					try {
						const { conversation } = data;
						if (
							conversation.participantOne._id.toString() !== userId &&
							conversation.participantTwo._id.toString() !== userId
						) {
							throw new AppError("Unauthorized to send this notification", HttpStatus.FORBIDDEN);
						}
						const conversationRoomId = `conversation_${conversation._id.toString()}`;
						const participantOneSockets = await this.io
							.in(conversation.participantOne._id.toString())
							.fetchSockets();
						const participantTwoSockets = await this.io
							.in(conversation.participantTwo._id.toString())
							.fetchSockets();

						participantOneSockets.forEach((s) => s.join(conversationRoomId));
						participantTwoSockets.forEach((s) => s.join(conversationRoomId));

						const otherParticipantId =
							conversation.participantOne._id.toString() === userId
								? conversation.participantTwo._id
								: conversation.participantOne._id;
						this.io
							.to(otherParticipantId.toString())
							.emit("conversation_created", { conversation });
					} catch (error) {
						logger.error("Error creating conversation:", error);
						socket.emit("error", {
							event: "notify_conversation_created",
							message: "Failed to notify created conversation",
						});
					}
				},
			);

			socket.on("join_conversation", (data: { conversationId: string }) => {
				try {
					const { conversationId } = data;
					socket.join(`conversation_${conversationId}`);
				} catch (error) {
					logger.error("Error joining conversation:", error);
					socket.emit("error", {
						event: "join_conversation",
						message: "Failed to join conversation",
					});
				}
			});

			socket.on(
				"notify_conversation_typing",
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
						logger.error("Error handling typing event:", error);
					}
				},
			);

			// messaging actions
			socket.on(
				"send_message",
				async (data: {
					conversationId: string;
					content: string;
					tempId?: string;
				}) => {
					try {
						const { conversationId, content, tempId } = data;
						const message = await this.messageService.sendMessage({
							conversationId,
							senderId: userId,
							content,
						});

						// Include tempId in the response so frontend can match optimistic message
						const messageResponse = tempId ? { ...message, tempId } : message;

						this.io
							.to(`conversation_${conversationId}`)
							.emit("new_message", messageResponse);
					} catch (error) {
						logger.error("Error sending message:", error);

						// Emit specific error with tempId so frontend can mark message as failed
						socket.emit("send_message_error", {
							tempId: data.tempId,
							conversationId: data.conversationId,
							message: "Failed to send message",
						});
					}
				},
			);

			socket.on(
				"notify_messages_read",
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
						logger.error("Error marking messages as read:", error);
						socket.emit("error", {
							event: "notify_messages_read",
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
							throw new AppError("Unauthorized to send this notification", HttpStatus.FORBIDDEN);
						}
						const receiverId = friendship.recipient._id.toString();
						this.io.to(receiverId).emit("friendship_request_received", {
							friendship,
						});
					} catch (error) {
						logger.error("Error sending friendship request:", error);
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
							throw new AppError("Unauthorized to send this notification", HttpStatus.FORBIDDEN);
						}
						const requesterId = friendship.requester._id.toString();
						this.io
							.to(requesterId)
							.emit("friendship_request_accepted", { friendship });
					} catch (error) {
						logger.error("Error accepting friendship request:", error);
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
							throw new AppError("Unauthorized to send this notification", HttpStatus.FORBIDDEN);
						}

						const otherParticipent =
							friendship.requester._id.toString() === userId
								? friendship.recipient._id.toString()
								: friendship.requester._id.toString();

						this.io
							.to(otherParticipent)
							.emit("friendship_request_declined", { friendship });
					} catch (error) {
						logger.error("Error declining friendship request:", error);
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
							throw new AppError("Unauthorized to send this notification", HttpStatus.FORBIDDEN);
						}
						const otherParticipent =
							friendship.requester._id.toString() === userId
								? friendship.recipient._id.toString()
								: friendship.requester._id.toString();
						this.io.to(otherParticipent).emit("friendship_request_cancelled", {
							friendship,
						});
					} catch (error) {
						logger.error("Error canclling friendship request:", error);
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
							throw new AppError("Unauthorized to send this notification", HttpStatus.FORBIDDEN);
						}
						const otherParticipent =
							friendship.requester._id.toString() === userId
								? friendship.recipient._id.toString()
								: friendship.requester._id.toString();
						this.io
							.to(otherParticipent)
							.emit("friendship_unfriended", { friendship });
					} catch (error) {
						logger.error("Error unfriending friendship :", error);
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
