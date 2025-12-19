"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import { User } from "@/types/user";
import { useChatStore } from "@/stateManagment/chatStore";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";

const getStatusColor = (status: User["status"]) => {
	switch (status) {
		case "online":
			return "bg-green-500";
		case "away":
			return "bg-yellow-500";
		default:
			return "bg-red-500";
	}
};

export const ActiveUsersList = () => {
	const { createConversation } = useChatStore();
	const { friends } = useFriendshipStore();

	const sortedFriends = [...friends].sort((a, b) => {
		const statusOrder = { online: 0, away: 1, offline: 2 };
		return statusOrder[a.status] - statusOrder[b.status];
	});

	const handleUserClick = (friend: User) => {
		createConversation(friend._id);
	};

	if (friends.length === 0) return null;

	return (
		<div className="w-full py-4">
			<ScrollArea className="w-full whitespace-nowrap">
				<div className="flex w-max space-x-4">
					{sortedFriends.map((friend) => (
						<button
							key={friend._id}
							type="button"
							className="flex flex-col items-center space-y-1 cursor-pointer w-16 group focus:outline-none"
							onClick={() => handleUserClick(friend)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleUserClick(friend);
								}
							}}
						>
							<div className="relative transition-transform group-hover:scale-105 group-focus:scale-105">
								<Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
									<AvatarImage
										src={friend.profilePicture || "/placeholder.svg"}
										alt={friend.username}
									/>
									<AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
										{friend.firstName[0]}
										{friend.lastName[0]}
									</AvatarFallback>
								</Avatar>
								<div
									className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(
										friend.status,
									)}`}
								/>
							</div>
							<span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate w-full text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
								{friend.firstName}
							</span>
						</button>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="invisible" />
			</ScrollArea>
		</div>
	);
};
