"use client";
import { UserCard } from "@/components/home/userCard";
import UserCardSkeleton from "@/components/home/userCardSkeleton";
import { useAuthStore } from "@/stateManagment/authStore";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

function Page() {
  const { user, logout, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleGoToChat = () => {
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {isLoading && <UserCardSkeleton />}
      <UserCard user={user} onLogout={handleLogout} />
      <div className="absolute top-4 right-4">
        <Button onClick={handleGoToChat} variant="default">
          Go to Chat
        </Button>
      </div>
    </div>
  );
}

export default Page;
