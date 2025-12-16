"use client";
import React from "react";
import { PotentialFriend } from "@/types/potentialFriend";
import { UserPlus, UserMinus, UserCheck, X } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";

type Props = {
	potentialFriends: PotentialFriend[];
};

const PotentialFriendsList = ({ potentialFriends }: Props) => {
	const {
		friends,
		sentFriendshipRequests,
		receivedFriendshipRequests,
		acceptFriendshipRequest,
		unfriendUser,
		sendFriendshipRequest,
		cancelFriendshipRequest,
	} = useFriendshipStore();

	const handleUnfriend = (userId: string) => {
		unfriendUser(userId);
	};

	const handleAddFriend = (userId: string) => {
		sendFriendshipRequest(userId);
	};

	const handleCancelRequest = (friendshipId: string) => {
		cancelFriendshipRequest(friendshipId);
	};

	const handleAcceptRequest = (friendshipId: string) => {
		acceptFriendshipRequest(friendshipId);
	};

	return (
		<div className="max-h-96 overflow-y-auto space-y-2">
			<h3 className="text-sm font-medium text-blue-600 flex items-center gap-2">
				<UserPlus className="h-4 w-4" />
				People you may know
			</h3>

			{potentialFriends.map((potentialFriend) => {
				const isFriend = friends.some(
					(friend) => friend._id === potentialFriend._id,
				);
				const sentRequest = sentFriendshipRequests.find(
					(request) => request.recipient._id === potentialFriend._id,
				);
				const receivedRequest = receivedFriendshipRequests.find(
					(request) => request.requester._id === potentialFriend._id,
				);

				return (
					<div
						key={potentialFriend._id}
						className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
					>
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
								<p className="text-xs text-gray-500">@{potentialFriend.username}</p>
							</div>
						</div>

						{isFriend ? (
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleUnfriend(potentialFriend._id)}
								className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
							>
								<UserMinus className="h-4 w-4 mr-2" />
								Unfriend
							</Button>
						) : sentRequest ? (
							<Button
								size="sm"
								variant="secondary"
								onClick={() => handleCancelRequest(sentRequest._id)}
								className="h-8 px-3 text-gray-600 cursor-pointer"
							>
								<X className="h-4 w-4 mr-2" />
								Cancel
							</Button>
						) : receivedRequest ? (
							<Button
								size="sm"
								variant="default"
								onClick={() => handleAcceptRequest(receivedRequest._id)}
								className="h-8 px-3 bg-green-600 hover:bg-green-700 cursor-pointer"
							>
								<UserCheck className="h-4 w-4 mr-2" />
								Accept
							</Button>
						) : (
							<Button
								size="sm"
								variant="default"
								onClick={() => handleAddFriend(potentialFriend._id)}
								className="h-8 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
							>
								<UserPlus className="h-4 w-4 mr-2" />
								Add Friend
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
