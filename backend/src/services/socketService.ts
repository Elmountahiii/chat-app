import { Server, Socket } from "socket.io";
import http from "http";
import { TypedEventEmitter } from "../validators/events";
import { getCookieValue } from "../utils/utils";
import { JwtService } from "./jwtService";

export class SocketService {
  private io: Server;

  constructor(
    server: http.Server,
    private messageEventEmitter: TypedEventEmitter
  ) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.use(this.authenticateSocket.bind(this));
    this.setupSocketListeners();
    this.setupEventListeners();
  }

  private authenticateSocket(socket: Socket, next: (err?: Error) => void) {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Unauthorized"));
    }
    const token = getCookieValue(cookieHeader, "authToken");
    if (!token) {
      return next(new Error("Unauthorized"));
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
    this.io.on("connection", (socket) => {
      const userId = socket.data.userId as string;
      socket.join(userId);

      // ? Update user status
      this.messageEventEmitter.emit("user:statusChanged", {
        userId,
        newStatus: "online",
      });

      // ? react to user status changes
      socket.on("user:status", (data) => {
        const { status } = data as {
          status: "online" | "offline" | "away";
        };
        this.messageEventEmitter.emit("user:statusChanged", {
          userId,
          newStatus: status,
        });
      });

      // ? join conversation
      socket.on("join_conversation", (data) => {
        const { conversationId } = data as { conversationId: string };
        socket.join(`conversation_${conversationId}`);
      });

      // ? leave conversation
      socket.on("leave_conversation", (data) => {
        const { conversationId } = data;
        socket.leave(`conversation_${conversationId}`);
        console.log(`User ${userId} left conversation ${conversationId}`);
      });

      // ? react to typing
      socket.on("typing", (data) => {
        const { conversationId, isTyping } = data as {
          conversationId: string;
          isTyping: boolean;
        };

        socket.to(`conversation_${conversationId}`).emit("user_typing", {
          conversationId,
          userId,
          isTyping,
        });
      });

      // ? react to user status changes
      socket.on("disconnect", () => {
        socket.leave(userId);
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
          if (room.startsWith("conversation_")) {
            socket.leave(room);
          }
        });
        this.messageEventEmitter.emit("user:statusChanged", {
          userId,
          newStatus: "offline",
        });
      });
    });
  }
  private setupEventListeners() {
    this.messageEventEmitter.on("message:created", (data) => {
      this.io
        .to(`conversation_${data.conversationId}`)
        .emit("new_message", data);
    });

    this.messageEventEmitter.on("message:read", (data) => {
      this.io
        .to(`conversation_${data.conversationId}`)
        .emit("message_read", data);
    });

    this.messageEventEmitter.on("message:edited", (data) => {
      this.io
        .to(`conversation_${data.conversationId}`)
        .emit("message_edited", data);
    });
    this.messageEventEmitter.on("message:deleted", (data) => {
      this.io
        .to(`conversation_${data.conversationId}`)
        .emit("message_deleted", data);
    });

    this.messageEventEmitter.on("conversation:created", async (data) => {
      data.participants.forEach((participantId) => {
        if (participantId === data.userId) return;
        this.io
          .to(participantId)
          .emit("conversation_created", { conversation: data.conversation });
      });
    });

    this.messageEventEmitter.on("broadcast:statusChanged", (data) => {
      data.friends.forEach((friend) => {
        this.io.to(friend._id.toString()).emit("user:statusChanged", {
          status: data.status,
          user: data.user,
        });
      });
    });

    this.messageEventEmitter.on("broadcast:requestSent", (data) => {
      this.io.to(data.receiverId).emit("friend:requestReceived", {
        senderId: data.userId,
        friendship: data.friendShipRequest,
      });
    });
  }
}
