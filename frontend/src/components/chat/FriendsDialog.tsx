"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MessageCircle,
  Phone,
  Video,
  UserPlus,
  Users,
} from "lucide-react";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "busy";
  lastSeen?: string;
}

interface PotentialFriend {
  id: string;
  name: string;
  avatar?: string;
  mutualFriends?: number;
  isRequested?: boolean;
}

// Mock data for demonstration
const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "5",
    name: "Emma Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "busy",
  },
  {
    id: "6",
    name: "Frank Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
];

const mockPotentialFriends: PotentialFriend[] = [
  {
    id: "7",
    name: "Grace Lee",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Henry Chen",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Ivy Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    name: "Jack Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    isRequested: true,
  },
  {
    id: "11",
    name: "Kate Williams",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

interface OnlineFriendsDialogProps {}

export function FriendsDialog({}: OnlineFriendsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newFriendSearch, setNewFriendSearch] = useState("");
  const [requestedFriends, setRequestedFriends] = useState<Set<string>>(
    new Set()
  );

  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPotentialFriends = mockPotentialFriends.filter((friend) =>
    friend.name.toLowerCase().includes(newFriendSearch.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(
    (friend) => friend.status === "online"
  );
  const otherFriends = filteredFriends.filter(
    (friend) => friend.status !== "online"
  );

  const getStatusColor = (status: Friend["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleStartChat = (friend: Friend) => {
    // Handle starting a chat with the friend
    console.log("Starting chat with:", friend.name);
  };


  const handleSendFriendRequest = (potentialFriend: PotentialFriend) => {
    setRequestedFriends((prev) => new Set(prev).add(potentialFriend.id));
    console.log("Sending friend request to:", potentialFriend.name);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
          <Users className="h-5 w-5" />
          Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Friends
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="online" className="w-full cursor-pointer">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="online"
              className="flex items-center gap-2 cursor-pointer">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online ({onlineFriends.length})
            </TabsTrigger>
            <TabsTrigger
              value="find"
              className="flex items-center gap-2 cursor-pointer">
              <UserPlus className="h-4 w-4" />
              Find Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="space-y-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Friends List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {/* Online Friends */}
              {onlineFriends.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online ({onlineFriends.length})
                  </h3>
                  {onlineFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={friend.avatar || "/placeholder.svg"}
                              alt={friend.name}
                            />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                              friend.status
                            )} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{friend.name}</p>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700">
                            Online
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartChat(friend)}
                          className="h-8 w-8 p-0 cursor-pointer">
                          <MessageCircle className="h-4 w-4 cursor-pointer" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other Friends (Away/Busy) */}
              {otherFriends.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    Other ({otherFriends.length})
                  </h3>
                  {otherFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors opacity-75">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={friend.avatar || "/placeholder.svg"}
                              alt={friend.name}
                            />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                              friend.status
                            )} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{friend.name}</p>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              friend.status === "away"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                            {friend.status === "away" ? "Away" : "Busy"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartChat(friend)}
                          className="h-8 w-8 p-0">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredFriends.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No friends found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="find" className="space-y-4 mt-4">
            {/* Search Bar for New Friends */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for new friends..."
                value={newFriendSearch}
                onChange={(e) => setNewFriendSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Potential Friends List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              <h3 className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                People you may know
              </h3>

              {filteredPotentialFriends.map((potentialFriend) => {
                const isRequested =
                  requestedFriends.has(potentialFriend.id) ||
                  potentialFriend.isRequested;

                return (
                  <div
                    key={potentialFriend.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={potentialFriend.avatar || "/placeholder.svg"}
                          alt={potentialFriend.name}
                        />
                        <AvatarFallback>
                          {potentialFriend.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {potentialFriend.name}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isRequested ? "secondary" : "default"}
                      onClick={() =>
                        !isRequested && handleSendFriendRequest(potentialFriend)
                      }
                      disabled={isRequested}
                      className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      {isRequested ? "Requested" : "Add Friend"}
                    </Button>
                  </div>
                );
              })}

              {filteredPotentialFriends.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No new friends found</p>
                  <p className="text-xs">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
