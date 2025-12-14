"use client";
import InviteToast from "@/components/chat/inviteToast";
import { useAuthStore } from "@/stateManagment/authStore";
import { useChatStore } from "@/stateManagment/chatStore";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface SocketProviderProps {
	children: React.ReactNode;
}
const SocketProvider = ({ children }: SocketProviderProps) => {
	const {
		initializeSocket,
		disconnectSocket,
		friendshipRequests,
		getAllFriendshipRequests,
		acceptFriendshipRequest,
		declineFriendshipRequest,
	} = useChatStore();
	const { checkAuthStatus, user } = useAuthStore();
	const processedInvites = useRef(new Set<string>());

	useEffect(() => {
		initializeSocket();
		checkAuthStatus();

		return () => {
			disconnectSocket();
		};
	}, [initializeSocket, disconnectSocket, checkAuthStatus]);

	useEffect(() => {
		if (user) {
			initializeSocket();
			getAllFriendshipRequests();
		}
	}, [user, initializeSocket, getAllFriendshipRequests]);

	useEffect(() => {
		if (!user) return;


		for (const request of friendshipRequests) {
			if (request.requester._id === user._id) {
				continue;
			}
			if (!processedInvites.current.has(request._id)) {
				processedInvites.current.add(request._id);
			}
			if (request.status != "pending") {
				toast.dismiss(request._id);
				continue;
			}
			toast.custom(
				() => (
					<InviteToast
						invite={request}
						onAccept={() => {
							acceptFriendshipRequest(request._id);
						}}
						onDecline={() => {
							declineFriendshipRequest(request._id);
						}}
					/>
				),
				{
					duration: Infinity,
					dismissible: false,
					closeButton: false,
					id: request._id,
				},
			);
		}
	}, [user, friendshipRequests]);

	return <div>{children}</div>;
};

export default SocketProvider;
