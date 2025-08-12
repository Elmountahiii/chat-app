"use client";
import { FriendsDialog } from "@/components/chat/FriendsDialog";
import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <FriendsDialog  />
    </div>
  );
}

export default page;
