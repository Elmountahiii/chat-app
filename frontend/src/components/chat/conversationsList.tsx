"use client";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useChatStore } from "@/stateManagment/chatStore";
import { Conversation } from "@/types/converstation";
import { useAuthStore } from "@/stateManagment/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Users } from "lucide-react";

type ConversationsListProps = {
  handleStartChat: (conversation: Conversation) => void;
  handleUserProfileClick: (conversation: Conversation) => void;
};

export const ConversationsList = ({
  handleStartChat,
  handleUserProfileClick,
}: ConversationsListProps) => {
  const { conversations, activeConversationId, onlineFriends } = useChatStore();
  const { user } = useAuthStore();
  if (!user) return null;
  return (
    <ScrollArea className="flex-1">
      <div className="p-3">
        {conversations.length > 0 ? (
          conversations.map((convo) => {
            const userReadStatus = convo.readStatus.find(
              (status) => status.userId === user._id
            );
            const unreadCount = userReadStatus ? userReadStatus.unreadCount : 0;
            const isOnline = onlineFriends.find(
              (friend) =>
                friend._id ===
                convo.participants.find((p) => p._id !== user?._id)?._id
            )?.status;

            return (
              <div
                key={convo._id}
                className={`flex items-start p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  activeConversationId === convo._id
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => handleStartChat(convo)}>
                <div
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserProfileClick(convo);
                  }}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        convo.participants.find((p) => p._id !== user?._id)
                          ?.profilePicture || ""
                      }
                      alt={
                        convo.participants.find((p) => p._id !== user?._id)
                          ?.username || ""
                      }
                    />
                    <AvatarFallback className="bg-blue-600 text-white font-medium">
                      {convo.participants
                        .find((p) => p._id !== user?._id)
                        ?.firstName?.charAt(0)}
                      {convo.participants
                        .find((p) => p._id !== user?._id)
                        ?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      isOnline === "online"
                        ? "bg-green-500"
                        : isOnline === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}></div>
                </div>
                <div className="ml-3 flex-1 min-w-0 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <div className="min-w-0 flex-1 mr-2">
                      <p
                        className="font-medium text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserProfileClick(convo);
                        }}>
                        {
                          convo.participants.find((p) => p._id !== user?._id)
                            ?.firstName
                        }{" "}
                        {
                          convo.participants.find((p) => p._id !== user?._id)
                            ?.lastName
                        }
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @
                        {
                          convo.participants.find((p) => p._id !== user?._id)
                            ?.username
                        }
                      </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(
                          convo.lastMessage?.timeStamp || ""
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {unreadCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white mt-1">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {(() => {
                        const lastMessage =
                          convo.lastMessage?.content ||
                          "Start a conversation...";
                        if (lastMessage.length > 40) {
                          return lastMessage.substring(0, 40) + "...";
                        }
                        return lastMessage;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No conversations found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
