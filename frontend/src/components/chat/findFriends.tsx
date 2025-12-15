"use client";
import React, { useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import PotentialFriendsList from "./potentialFriendsList";
import { PotentialFriend } from "@/types/potentialFriend";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";

function FindFriends() {
  const [newFriendSearch, setNewFriendSearch] = useState("");

  const { potentialFriends, searchForPotentialFriends, sendFriendshipRequest } =
    useFriendshipStore();
  const sendFriendRequest = (potentialFriend: PotentialFriend) => {
    sendFriendshipRequest(potentialFriend._id);
  };

  const search = async (query: string) => {
    console.log("searching for : ", query);
    setNewFriendSearch(query);
    searchForPotentialFriends(query);
  };
  return (
    <TabsContent value="find" className="space-y-4 mt-4">
      {/* Search Bar for New Friends */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for new friends..."
          value={newFriendSearch}
          onChange={(e) => search(e.target.value)}
          className="pl-10"
        />
      </div>

      <PotentialFriendsList
        potentialFriends={potentialFriends}
        sendFriendRequest={sendFriendRequest}
      />
    </TabsContent>
  );
}

export default FindFriends;
