"use client";
import { useConnectivityStore } from "@/stateManagment/connectivityStore";
import React, { useEffect } from "react";

interface SocketProviderProps {
  children: React.ReactNode;
}
const SocketProvider = ({ children }: SocketProviderProps) => {
  const { connect, disconnect, status } = useConnectivityStore();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    console.log("Socket status:", status);
  }, [status]);

  return <div>{children}</div>;
};

export default SocketProvider;
