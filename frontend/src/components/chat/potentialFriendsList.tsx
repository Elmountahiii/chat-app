"use client";
import { PotentialFriend } from "@/types/potentialFriend";
import { User, UserPlus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  potentialFriends: PotentialFriend[];
  sendFriendRequest: (potentialFriend: PotentialFriend) => void;
};

const PotentialFriendsList = ({
  potentialFriends,
  sendFriendRequest,
}: Props) => {
  return (
    <div className="max-h-96 overflow-y-auto space-y-2">
      <h3 className="text-sm font-medium text-blue-600 flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        People you may know
      </h3>

      {potentialFriends.map((potentialFriend) => {
        const isPending = potentialFriend.friendship.status === "pending";
        const isFriend = potentialFriend.friendship.status === "accepted";

        return (
          <div
            key={potentialFriend._id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={potentialFriend.profilePicture}
                  alt={potentialFriend.firstName}
                />
                <AvatarFallback>
                  {potentialFriend.firstName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {potentialFriend.firstName} {potentialFriend.lastName}
                </p>
              </div>
            </div>

            {isFriend ? (
              <Button
                size="sm"
                aria-disabled="true"
                title="You are already friends"
                className="h-8 px-3 bg-green-600 hover:bg-green-700 cursor-pointer">
                <User className="h-4 w-4" aria-hidden />
                <span>Friends</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant={isPending ? "secondary" : "default"}
                onClick={() => !isPending && sendFriendRequest(potentialFriend)}
                disabled={isPending}
                className="flex items-center gap-2  cursor-pointer">
                <UserPlus className="h-4 w-4" />
                {isPending ? "Requested" : "Add Friend"}
              </Button>
            )}
          </div>
        );
      })}

      {potentialFriends.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No new friends found</p>
          <p className="text-xs">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
};

export default PotentialFriendsList;
