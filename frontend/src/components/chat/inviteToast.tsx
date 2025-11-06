"use client";
import { FriendShipRequest } from "@/types/friendShipRequest";
import React, { useState } from "react";
import { Check, X } from "lucide-react";

type Props = {
	invite: FriendShipRequest;
	onAccept: (inviteId: string) => void;
	onDecline: (inviteId: string) => void;
};

function InviteToast({ invite, onAccept, onDecline }: Props) {
	const [isHovered, setIsHovered] = useState(false);

	const handleAccept = () => {
		onAccept(invite._id);
	};

	const handleDecline = () => {
		onDecline(invite._id);
	};

	return (
		<div
			className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md border border-blue-200 dark:border-gray-600 min-w-[340px] max-w-[450px] transition-all duration-200 hover:shadow-lg"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Avatar with Badge */}
			<div className="relative flex-shrink-0">
				<img
					src={invite.requester.profilePicture}
					alt={`${invite.requester.firstName} ${invite.requester.lastName}`}
					className="w-14 h-14 rounded-full object-cover border-3 border-white dark:border-gray-600 shadow-md transition-transform duration-200 hover:scale-105"
				/>
				<div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
					<span className="text-white text-xs">+</span>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
					{invite.requester.firstName + " " + invite.requester.lastName ||
						"Unknown User"}
				</p>
				<p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
					Sent you a friend request
				</p>
			</div>

			{/* Actions */}
			<div className="flex gap-2 flex-shrink-0">
				<button
					onClick={handleAccept}
					className="p-2 text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
					aria-label="Accept invite"
					title="Accept friend request"
				>
					<Check size={18} strokeWidth={2.5} />
				</button>
				<button
					onClick={handleDecline}
					className="p-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
					aria-label="Decline invite"
					title="Decline friend request"
				>
					<X size={18} strokeWidth={2.5} />
				</button>
			</div>
		</div>
	);
}

export default InviteToast;
