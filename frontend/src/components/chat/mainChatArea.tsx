"use client";
import { useAuthStore } from "@/stateManagment/authStore";
import { useChatStore } from "@/stateManagment/chatStore";
import React, {
	useRef,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from "react";
import { Button } from "../ui/button";
import {
	ChevronLeft,
	MessageCircle,
	MoreVertical,
	UserRoundMinus,
	Send,
	UserX,
	UserRound,
	Loader2,
	Check,
	CheckCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/types/user";
import { Input } from "../ui/input";
import { EmojiSelector } from "./EmojiSelector";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../ui/dropdown-menu";
import BlockUserDailog from "./blockUserDailog";
import UnfriendUserDialog from "./unfriendUserDialog";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";

type MainChatAreaProps = {
	setShowFriendsList: (show: boolean) => void;
	handleUserProfileClick: (user: User) => void;
};

const formatLastSeen = (lastSeen: string | Date | undefined) => {
	if (!lastSeen) return "Unknown";

	const date = new Date(lastSeen);

	if (isToday(date)) {
		return `Last seen today at ${format(date, "h:mm a")}`;
	} else if (isYesterday(date)) {
		return `Last seen yesterday at ${format(date, "h:mm a")}`;
	} else {
		return `Last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
	}
};

function MainChatArea({
	setShowFriendsList,
	handleUserProfileClick,
}: MainChatAreaProps) {
	const {
		messages,
		sendMessage,
		activeConversationId,
		conversations,
		loadMessages,
		loadInitialMessages,
		loadMoreMessages,
		messagesPagination,
		notifyTyping,
		notifyMessageRead,
		isLoading,
	} = useChatStore();
	const { user } = useAuthStore();
	const { friends, unfriendUser } = useFriendshipStore();
	const [blockUserDialogOpen, setBlockUserDialogOpen] = useState(false);
	const [unfriendUserDialogOpen, setUnfriendUserDialogOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const prevMessagesLengthRef = useRef<number>(0);
	const isLoadingMoreRef = useRef<boolean>(false);

	const conversation =
		conversations.find((conv) => conv._id === activeConversationId) || null;
	const [newMessage, setNewMessage] = useState("");

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const otherParticipant =
		conversation?.participantOne._id === user?._id
			? conversation?.participantTwo
			: conversation?.participantOne;

	const conversationMessages = useMemo(
		() => messages[conversation?._id || ""] || [],
		[messages, conversation?._id],
	);

	// Get pagination state for current conversation
	const pagination = useMemo(
		() => messagesPagination[conversation?._id || ""],
		[messagesPagination, conversation?._id],
	);

	useEffect(() => {
		if (conversation?._id) {
			loadInitialMessages(conversation._id);
			notifyMessageRead(conversation._id);
		}
	}, [conversation?._id, loadInitialMessages, notifyMessageRead]);

	// Scroll to bottom on initial load or new messages, preserve position when loading older messages
	useEffect(() => {
		if (!conversationMessages.length) return;

		const container = messagesContainerRef.current;
		const prevLength = prevMessagesLengthRef.current;
		const currentLength = conversationMessages.length;

		// If we loaded more messages (prepended), preserve scroll position
		if (isLoadingMoreRef.current && currentLength > prevLength && container) {
			const addedCount = currentLength - prevLength;
			// Find the message element that was previously at the top
			const messageElements = container.querySelectorAll("[data-message-id]");
			if (messageElements[addedCount]) {
				messageElements[addedCount].scrollIntoView({ block: "start" });
			}
			isLoadingMoreRef.current = false;
		} else if (currentLength > prevLength || prevLength === 0) {
			// New messages added at the end or initial load - scroll to bottom
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}

		prevMessagesLengthRef.current = currentLength;
	}, [conversationMessages]);

	// Scroll event handler for loading more messages
	const handleScroll = useCallback(() => {
		const container = messagesContainerRef.current;
		if (!container || !conversation?._id) return;

		const { scrollTop } = container;

		// Load more when scrolled within 100px of the top
		if (
			scrollTop < 100 &&
			pagination?.hasMore &&
			!pagination?.isLoadingMore &&
			!pagination.isInitial
		) {
			isLoadingMoreRef.current = true;
			loadMoreMessages(conversation._id);
		}
	}, [
		conversation?._id,
		pagination?.hasMore,
		pagination?.isLoadingMore,
		pagination?.isInitial,
		loadMoreMessages,
	]);

	// Attach scroll event listener
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	const handleEmojiSelect = (emoji: string) => {
		setNewMessage((prev) => prev + emoji);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey && conversation) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleSendMessage = (): void => {
		if (!conversation) {
			console.log("no conversation selected");
			return;
		}

		if (newMessage.trim() === "") {
			console.log("message is empty");
			return;
		}
		notifyTyping(conversation._id, false);
		sendMessage(conversation._id, newMessage);
		setNewMessage("");
	};

	const handleBlockUser = () => {
		setDropdownOpen(false);
		setBlockUserDialogOpen(true);
		console.log("blocking user");
	};

	const handleUnfriendUser = () => {
		setDropdownOpen(false);
		setUnfriendUserDialogOpen(true);
	};

	const handleViewProfile = () => {
		setDropdownOpen(false);
		if (conversation) {
			const otherParticipant =
				conversation.participantOne._id === user?._id
					? conversation.participantTwo
					: conversation.participantOne;
			handleUserProfileClick(otherParticipant);
		}
	};

	return (
		<div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
			{conversation ? (
				<>
					{/* Chat header - with back button on mobile */}
					<div className="sticky top-0 z-10 flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
						<div className="flex items-center min-w-0">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden mr-2 hover:bg-gray-100 dark:hover:bg-gray-800"
								onClick={() => {
									setShowFriendsList(true);
									window.history.back();
								}}
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
							<button
								type="button"
								className="relative shrink-0 cursor-pointer bg-transparent border-none p-0"
								onClick={() => handleViewProfile()}
							>
								<Avatar className="h-12 w-12 lg:h-14 lg:w-14">
									<AvatarImage
										src={otherParticipant?.profilePicture || ""}
										alt={otherParticipant?.username}
									/>
									<AvatarFallback className="bg-blue-600 text-white font-medium">
										{otherParticipant?.firstName?.charAt(0)}
										{otherParticipant?.lastName?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div
									className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
										friends.find(
											(friend) => friend._id === otherParticipant?._id,
										)?.status === "online"
											? "bg-green-500"
											: friends.find(
														(friend) => friend._id === otherParticipant?._id,
												  )?.status === "away"
												? "bg-yellow-500"
												: "bg-gray-400"
									}`}
								></div>
							</button>
							<div className="ml-4 min-w-0">
								<button
									type="button"
									className="font-semibold text-lg text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0"
									onClick={() => handleViewProfile()}
								>
									{otherParticipant?.firstName} {otherParticipant?.lastName}
								</button>
								<p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center">
									{friends.find(
										(friend) => friend._id === otherParticipant?._id,
									)?.status === "online"
										? "Active now"
										: friends.find(
													(friend) => friend._id === otherParticipant?._id,
											  )?.status === "away"
											? "Away"
											: `${formatLastSeen(otherParticipant?.lastSeen)}`}
								</p>
							</div>
						</div>
						<div className="flex space-x-1">
							<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
									>
										<MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={handleViewProfile}
									>
										<UserRound className="mr-2 h-4 w-4" />
										View Profile
									</DropdownMenuItem>

									<DropdownMenuItem
										className="cursor-pointer"
										onClick={handleUnfriendUser}
									>
										<UserRoundMinus className="mr-2 h-4 w-4" />
										unfriend User
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={handleBlockUser}
									>
										<UserX className="mr-2 h-4 w-4" />
										Block User
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Messages area */}
					<div
						ref={messagesContainerRef}
						className="flex-1 p-4 lg:p-6 bg-gray-50 dark:bg-gray-800 overflow-y-auto"
					>
						{isLoading && conversationMessages.length === 0 ? (
							<div className="h-full flex items-center justify-center">
								<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
							</div>
						) : (
							<div className="space-y-4 max-w-4xl mx-auto">
								{/* Loading more spinner */}
								{pagination?.isLoadingMore && (
									<div className="flex items-center justify-center py-4">
										<Loader2 className="h-5 w-5 animate-spin text-blue-500" />
									</div>
								)}

								{/* Date separator */}
								<div className="flex items-center justify-center">
									<div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-600">
										<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
											Today
										</span>
									</div>
								</div>

								{conversationMessages.map((message, index) => {
									const isMe = message.sender._id === user?._id;
									const isPending = message.status === "pending";
									const isFailed = message.status === "failed";
									const showAvatar =
										!isMe &&
										(index === 0 ||
											conversationMessages[index - 1]?.sender._id !==
												message.sender._id);

									return (
										<div
											key={message._id}
											data-message-id={message._id}
											className={`flex ${
												isMe ? "justify-end" : "justify-start"
											} mb-3 ${isPending ? "opacity-50" : ""}`}
										>
											<div
												className={`flex max-w-[80%] md:max-w-[60%] ${
													isMe ? "flex-row-reverse" : "flex-row"
												}`}
											>
												{!isMe && (
													<div className="shrink-0 mr-3">
														{showAvatar ? (
															<Avatar
																className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
																onClick={() => handleViewProfile()}
															>
																<AvatarImage
																	src={otherParticipant?.profilePicture || ""}
																	alt={otherParticipant?.username}
																/>
																<AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
																	{otherParticipant?.firstName?.charAt(0)}
																</AvatarFallback>
															</Avatar>
														) : (
															<div className="w-8 h-8"></div>
														)}
													</div>
												)}
												<div
													className={`flex flex-col ${
														isMe ? "items-end" : "items-start"
													}`}
												>
													<div
														className={`px-3 py-2 rounded-lg ${
															isMe
																? isFailed
																	? "bg-red-500 text-white"
																	: "bg-blue-600 text-white"
																: "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
														}`}
													>
														<p className="text-sm wrap-break-word">
															{message.content}
														</p>
													</div>
													<div className="flex items-center mt-1 space-x-1">
														<span
															className={`text-xs ${
																isMe ? "text-gray-500" : "text-gray-400"
															}`}
														>
															{new Date(message.createdAt).toLocaleTimeString(
																[],
																{
																	hour: "2-digit",
																	minute: "2-digit",
																},
															)}
														</span>
														{isMe && (
															<span>
																{isFailed ? (
																	<span className="text-xs text-red-500 font-medium">
																		Failed
																	</span>
																) : isPending ? (
																	<Loader2 className="h-3 w-3 text-gray-400 animate-spin" />
																) : message.readBy.some(
																		(entry) =>
																			entry.user._id === otherParticipant?._id,
																	) ? (
																	<CheckCheck className="h-3 w-3 text-blue-500" />
																) : (
																	<Check className="h-3 w-3 text-gray-400" />
																)}
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									);
								})}
								<div ref={messagesEndRef} />
							</div>
						)}
					</div>

					{/* Message input */}
					<div className="sticky bottom-0 z-10 p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
						<div className="max-w-4xl mx-auto">
							<div className="flex items-end space-x-3">
								<div className="flex-1 relative">
								<Input
									value={newMessage}
									onChange={(e) => {
										notifyTyping(conversation._id, e.target.value.length > 0);
										setNewMessage(e.target.value);
									}}
									onKeyDown={handleKeyPress}
									placeholder="Type a message..."
									className="pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 text-base md:text-sm"
									style={{ minHeight: "44px" }}
								/>
									<div className="absolute right-2 top-1/2 transform -translate-y-1/2">
										<EmojiSelector onEmojiSelect={handleEmojiSelect} />
									</div>
								</div>
								<Button
									onClick={handleSendMessage}
									size="icon"
									disabled={newMessage.trim() === ""}
									className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed h-11 w-11 transition-colors duration-200"
								>
									<Send className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>
				</>
			) : (
				// Welcome screen when no chat is selected
				<div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-6">
					<div className="text-center max-w-md">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-8 w-32 h-32 flex items-center justify-center mx-auto mb-6 border border-blue-200 dark:border-blue-700">
							<MessageCircle className="h-16 w-16 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
							Welcome to Messages
						</h3>
						<p className="text-gray-600 dark:text-gray-300 mb-6">
							Select a conversation to start chatting with your friends and stay
							connected.
						</p>
						<Button
							onClick={() => setShowFriendsList(true)}
							className="md:hidden bg-blue-600 hover:bg-blue-700 px-6 py-2"
						>
							<MessageCircle className="h-4 w-4 mr-2" />
							Start Chatting
						</Button>
					</div>
				</div>
			)}
			<BlockUserDailog
				isOpen={blockUserDialogOpen}
				setIsopen={setBlockUserDialogOpen}
				user={otherParticipant}
				onConfirm={() => {
					console.log("block user :", otherParticipant);
				}}
			/>

			<UnfriendUserDialog
				isOpen={unfriendUserDialogOpen}
				setIsopen={setUnfriendUserDialogOpen}
				user={otherParticipant}
				onConfirm={() => {
					if (otherParticipant) {
						unfriendUser(otherParticipant._id);
					}
				}}
			/>
		</div>
	);
}

export default MainChatArea;
