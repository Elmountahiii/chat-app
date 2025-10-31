"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { Calendar, Mail } from "lucide-react";

interface UserProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileDialog({
  user,
  isOpen,
  onClose,
}: UserProfileDialogProps) {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "away":
        return "Away";
      default:
        return "Offline";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log("open state : ", open);
        if (!open) {
          onClose();
        }
      }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Profile Picture and Status */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.profilePicture || ""}
                alt={user.username}
              />
              <AvatarFallback className="bg-blue-600 text-white text-2xl font-medium">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 ${getStatusColor(
                user.status
              )}`}></div>
          </div>

          {/* User Information */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>

            <Badge variant="secondary" className="mt-2">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(
                  user.status
                )}`}></span>
              {getStatusText(user.status)}
            </Badge>
          </div>

          {/* User Details */}
          <div className="w-full space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {user.status !== "online" && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="h-4 w-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  Last seen {new Date(user.lastSeen).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
