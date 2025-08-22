"use client";

import { User } from "@/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  user: User | null;
  onLogout?: () => void;
}

export function UserCard({ user, onLogout }: UserCardProps) {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName}'s profile`}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                <span className="text-2xl font-semibold text-muted-foreground">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Online status indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <CardTitle className="text-xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <CardAction>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                User ID:
              </span>
              <p className="font-mono text-xs mt-1 p-2 bg-muted rounded break-all">
                {user._id}
              </p>
            </div>
          </div>

          {/* Activity Status */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Active now</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
