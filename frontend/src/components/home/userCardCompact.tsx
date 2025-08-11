"use client";
import { User } from "@/types/user";
import React from "react";

type UserCardCompactProps = {
  user?: User;
};

function UserCardCompact({ user }: UserCardCompactProps) {
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      {user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={`${user.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-semibold text-muted-foreground">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.username}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>

      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
  );
}

export default UserCardCompact;
