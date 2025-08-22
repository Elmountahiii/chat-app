import { Server } from "socket.io";
import http from "http";
import { UserService } from "./userService";
import { JwtService } from "./jwtService";

function getCookieValue(
  cookieString: string,
  name: string
): string | undefined {
  const match = cookieString.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : undefined;
}

export class SocketService {
  private io: Server;
  private userService: UserService;
  private jwtService: JwtService;

  constructor(
    server: http.Server,
    userService: UserService,
    jwtService: JwtService
  ) {
    this.userService = userService;
    this.jwtService = jwtService;
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.use(async (socket, next) => {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("Unauthorized"));
      }
      const token = getCookieValue(cookieHeader, "authToken");
      if (!token) {
        return next(new Error("Unauthorized"));
      }
      try {
        const payload = await jwtService.verifyToken(token);
        socket.data.userId = payload;
        next();
      } catch (e) {
        console.log("error ", e);
        return next(new Error("Authentication error: Invalid token"));
      }
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.io.on("connection", (socket) => {
      const userId = socket.data.userId as string;
      this.userService.updateUser(userId, {
        status: "online",
      });

      socket.on("user:status", (data) => {
        const { status } = data as {
          status: "online" | "offline" | "away";
        };
        console.log(`User ${socket.data.userId} data:`, data);
        this.userService.updateUser(userId, {
          status,
        });
      });
      socket.on("disconnect", () => {
        console.log("disconnect");
        this.userService.updateUser(socket.data.userId as string, {
          status: "offline",
        });
      });
    });
  }
}
