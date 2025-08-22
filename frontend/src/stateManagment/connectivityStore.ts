import { ConnectivitySocketActions } from "@/types/action/ConnectivitySocketActions";
import { ConnectivitySocketState } from "@/types/state/connectivitySocketState";
import { io } from "socket.io-client";
import { create } from "zustand";

type ConnectivityStore = ConnectivitySocketState & ConnectivitySocketActions;
const SOCKET_URL = "http://localhost:3001";

export const useConnectivityStore = create<ConnectivityStore>((set, get) => ({
  socket: null,
  status: "disconnected",

  connect: () => {
    if (get().status === "connected" || get().status === "connecting") {
      console.log("Socket is already connected or connecting");
      return;
    }

    set({ status: "connecting" });

    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
      set({ socket, status: "connected" });
      socket.emit("user:status", {
        status: "online",
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      set({ socket: null, status: "disconnected" });
    });
  },

  setUpdateStatus: (status: "online" | "offline" | "away") => {
    const socket = get().socket;

    if (!socket) return;

    socket.emit("user:status", {
      status,
    });
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, status: "disconnected" });
    }
  },
}));
