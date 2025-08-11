"use client";
import { UserCard } from "@/components/home/userCard";
import UserCardSkeleton from "@/components/home/userCardSkeleton";
import { useAuthStore } from "@/stateManagment/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

function page({}: Props) {
  const { user, logout, isLoading, checkAuthStatus, isAuthenticated } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuthStatus();
    }
  }, [isAuthenticated, checkAuthStatus]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {isLoading && <UserCardSkeleton />}
      <UserCard user={user} onLogout={handleLogout} />
    </div>
  );
}

export default page;
