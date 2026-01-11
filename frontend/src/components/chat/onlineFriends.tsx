"use client";
import React, { useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/types/user";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import { useChatStore } from "@/stateManagment/chatStore";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";

const getStatusColor = (status: User["status"]) => {
	switch (status) {
		case "online":
			return "bg-green-500";
		case "away":
			return "bg-yellow-500";
		default:
			return "bg-gray-500";
	}
};

type OnlineFriendsProps = {
	changeDialogOpen: (open: boolean) => void;
};

const OnlineFriends = ({ changeDialogOpen }: OnlineFriendsProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const { setActiveConversation, conversations, createConversation } =
		useChatStore();
	const { friends } = useFriendshipStore();

	const online = friends.filter((friend) => friend.status === "online");
	const otherFriends = friends.filter((friend) => friend.status !== "online");
	const filteredFriends = friends.filter((friend) =>
		friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleStartChat = (friend: User) => {
		createConversation(friend._id);
		// const selectedConversation = conversations.find((conversation) =>
		// 	conversation.participants.some(
		// 		(participant) => participant._id === friend._id,
		// 	),
		// );

		// if (selectedConversation) {
		// 	console.log(
		// 		"Starting chat with conversation ID:",
		// 		selectedConversation._id,
		// 	);
		// 	setActiveConversation(selectedConversation._id);
		// } else {
		// 	createConversation([friend._id], "individual");
		// }
		changeDialogOpen(false);
	};

	return (
		<TabsContent value="online" className="space-y-4 mt-4 flex-1 flex flex-col overflow-hidden">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input
					placeholder="Search friends..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			<div className="flex-1 overflow-y-auto space-y-2 pr-1">
				{online.length > 0 && (
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-green-600 flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							Online ({online.length})
						</h3>
						{online.map((friend) => (
							<div
								key={friend._id}
								className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="relative">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={friend.profilePicture || "/placeholder.svg"}
												alt={friend.username}
											/>
											<AvatarFallback>
												{friend.username
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div
											className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
												friend.status,
											)} rounded-full border-2 border-white`}
										></div>
									</div>
									<div>
										<p className="font-medium text-sm">
											{friend.firstName} {friend.lastName}
										</p>
										<Badge
											variant="secondary"
											className="text-xs bg-green-100 text-green-700"
										>
											Online
										</Badge>
									</div>
								</div>

								<div className="flex items-center gap-1">
									<Button
										size="sm"
										variant="ghost"
										onClick={() => handleStartChat(friend)}
										className="h-8 w-8 p-0 cursor-pointer"
									>
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
								key={friend._id}
								className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors opacity-75"
							>
								<div className="flex items-center gap-3">
									<div className="relative">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={friend.profilePicture || "/placeholder.svg"}
												alt={friend.username}
											/>
											<AvatarFallback>
												{friend.username
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div
											className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
												friend.status,
											)} rounded-full border-2 border-white`}
										></div>
									</div>
									<div>
										<p className="font-medium text-sm">
											{friend.firstName} {friend.lastName}
										</p>

										<Badge
											variant="secondary"
											className={`text-xs ${
												friend.status === "away"
													? "bg-yellow-100 text-yellow-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{friend.status === "away" ? "Away" : "Offline"}
										</Badge>
									</div>
								</div>

								<div className="flex items-center gap-1">
									<Button
										size="sm"
										variant="ghost"
										onClick={() => handleStartChat(friend)}
										className="h-8 w-8 p-0"
									>
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
	);
};

export default OnlineFriends;
