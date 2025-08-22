"use client";
import { FriendsDialog } from "@/components/chat/FriendsDialog";
import { Button } from "@/components/ui/button";
import { useConnectivityStore } from "@/stateManagment/connectivityStore";
import React, { useEffect } from "react";

function Page() {
  const { connect, setUpdateStatus } = useConnectivityStore();
  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <FriendsDialog />
      <Button
        onClick={() => {
          setUpdateStatus("online");
        }}>
        Be Online
      </Button>
    </div>
  );
}

export default Page;
