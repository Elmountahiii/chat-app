export type ConnectivitySocketActions = {
  connect: () => void;
  disconnect: () => void;
  setUpdateStatus: (status: "online" | "offline" | "away") => void;
};
