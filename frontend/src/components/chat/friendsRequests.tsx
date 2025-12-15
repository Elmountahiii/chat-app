"use client";
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";
import { FriendShipRequest } from "@/types/friendShipRequest";

function FriendsRequests() {
	const {
		friendshipRequests,
		acceptFriendshipRequest,
		declineFriendshipRequest,
	} = useFriendshipStore();

	const requestList = friendshipRequests.filter((request) => {
		return request.status === "pending";
	});

	const handleAcceptRequest = (request: FriendShipRequest) => {
		acceptFriendshipRequest(request._id);
	};

	const handleDeclineRequest = (request: FriendShipRequest) => {
		declineFriendshipRequest(request._id);
	};

	return (
		<TabsContent
			value="requests"
			className="space-y-4 mt-4 flex-1 overflow-hidden flex flex-col"
		>
			<div className="flex-1 overflow-y-auto space-y-2">
				<h3 className="text-sm font-medium text-blue-600 flex items-center gap-2">
					<UserCheck className="h-4 w-4" />
					Friend Requests ({requestList.length})
				</h3>

				{requestList.map((request) => (
					<div
						key={request._id}
						className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
					>
						<div className="flex items-center gap-3">
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={request.requester.profilePicture || "/placeholder.svg"}
									alt={request.requester.firstName}
								/>
								<AvatarFallback>
									{request.requester.firstName
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium text-sm">
									{request.requester.firstName} {request.requester.lastName}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="default"
								onClick={() => handleAcceptRequest(request)}
								className="h-8 px-3 bg-green-600 hover:bg-green-700 cursor-pointer"
							>
								<UserCheck className="h-4 w-4 mr-1" />
								Accept
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleDeclineRequest(request)}
								className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
							>
								<UserX className="h-4 w-4 mr-1" />
								Decline
							</Button>
						</div>
					</div>
				))}

				{friendshipRequests.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						<UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
						<p>No pending friend requests</p>
						<p className="text-xs">New requests will appear here</p>
					</div>
				)}
			</div>
		</TabsContent>
	);
}

export default FriendsRequests;
