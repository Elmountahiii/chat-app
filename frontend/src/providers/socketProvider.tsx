"use client";
import { useAuthStore } from "@/stateManagment/authStore";
import { useChatStore } from "@/stateManagment/chatStore";
import React, { useEffect } from "react";

interface SocketProviderProps {
  children: React.ReactNode;
}
const SocketProvider = ({ children }: SocketProviderProps) => {
  const { initializeSocket, disconnectSocket } = useChatStore();
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    initializeSocket();
    checkAuthStatus();

    return () => {
      disconnectSocket();
    };
  }, [initializeSocket, disconnectSocket, checkAuthStatus]);

  return <div>{children}</div>;
};

export default SocketProvider;
