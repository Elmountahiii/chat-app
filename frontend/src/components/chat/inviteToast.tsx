"use client";
import { FriendShipRequest } from "@/types/friendShipRequest";
import React from "react";
import { Check, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
	invite: FriendShipRequest;
	onAccept: (inviteId: string) => void;
	onDecline: (inviteId: string) => void;
};

function InviteToast({ invite, onAccept, onDecline }: Props) {
	const handleAccept = () => {
		onAccept(invite._id);
	};

	const handleDecline = () => {
		onDecline(invite._id);
	};

	return (
		<div className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
			{/* Avatar with Badge */}
			<div className="relative">
				<Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
					<AvatarImage
						src={invite.requester.profilePicture}
						alt={invite.requester.firstName}
					/>
					<AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
						{invite.requester.firstName.charAt(0)}
						{invite.requester.lastName.charAt(0)}
					</AvatarFallback>
				</Avatar>
				<div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-gray-900">
					<UserPlus className="w-3 h-3 text-white" />
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
					{invite.requester.firstName} {invite.requester.lastName}
				</h4>
				<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
					Sent you a friend request
				</p>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-2">
				<Button
					type="button"
					onClick={handleDecline}
					size="icon"
					variant="ghost"
					className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
					title="Decline"
				>
					<X className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					onClick={handleAccept}
					size="sm"
					className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
					title="Accept"
				>
					<Check className="h-4 w-4 mr-1.5" />
					Accept
				</Button>
			</div>
		</div>
	);
}

export default InviteToast;
