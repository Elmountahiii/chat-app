"use client";
import InviteToast from "@/components/chat/inviteToast";
import { useAuthStore } from "@/stateManagment/authStore";
import { useChatStore } from "@/stateManagment/chatStore";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface SocketProviderProps {
	children: React.ReactNode;
}
const SocketProvider = ({ children }: SocketProviderProps) => {
	const { initializeSocket, disconnectSocket } = useChatStore();
	const {
		receivedFriendshipRequests,
		acceptFriendshipRequest,
		declineFriendshipRequest,
	} = useFriendshipStore();

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
		}
	}, [user, initializeSocket]);

	useEffect(() => {
		if (!user) return;

		if (receivedFriendshipRequests.length === 0) {
			for (const inviteId of processedInvites.current) {
				toast.dismiss(inviteId);
			}
			processedInvites.current.clear();
		}

		for (const request of receivedFriendshipRequests) {
			if (request.requester._id === user._id) {
				continue;
			}
			if (!processedInvites.current.has(request._id)) {
				processedInvites.current.add(request._id);
			}
			if (request.status !== "pending") {
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
					dismissible: true,
					closeButton: true,
					id: request._id,
				},
			);
		}
	}, [
		user,
		receivedFriendshipRequests,
		acceptFriendshipRequest,
		declineFriendshipRequest,
	]);

	return <div>{children}</div>;
};

export default SocketProvider;
