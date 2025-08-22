import type { Socket } from "socket.io-client";

export type ConnectivityStatus = "connected" | "disconnected" | "connecting";

export type ConnectivitySocketState = {
  socket: Socket | null;
  status: ConnectivityStatus;
};
