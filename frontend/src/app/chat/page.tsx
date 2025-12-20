"use client";

import { useEffect, useState } from "react";

import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FriendsDialog } from "@/components/chat/FriendsDialog";
import { UserProfileDialog } from "@/components/chat/UserProfileDialog";
import { ConversationsList } from "@/components/chat/conversationsList";
import { Conversation } from "@/types/conversation";
import { useChatStore } from "@/stateManagment/chatStore";
import { useAuthStore } from "@/stateManagment/authStore";
import MainChatArea from "@/components/chat/mainChatArea";
import { ActiveUsersList } from "@/components/chat/ActiveUsersList";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileSettings from "@/components/profile/profileSettings";
import { ProfileSettingsDataType } from "@/schema/profile/profileSettingsSchema";

export default function ChatPage() {
	const { user, updateUserInfo } = useAuthStore();
	const { setActiveConversation, fetchConversations } = useChatStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [showFriendsList, setShowFriendsList] = useState(false);
	const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(
		null,
	);
	const [showUserProfile, setShowUserProfile] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	const handleStartChat = (conversation: Conversation) => {
		setActiveConversation(conversation._id);
	};

	const handleUserProfileClick = (user: User) => {
		setShowUserProfile(true);
		setSelectedUserProfile(user);
	};

	const handleSaveProfile = (data: ProfileSettingsDataType) => {
		updateUserInfo(data);
		setIsSettingsOpen(false);
	};

	return (
		<div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
			{/* Friends list sidebar - hidden on mobile by default */}
			<div
				className={`${
					showFriendsList ? "absolute inset-0 z-50 md:relative" : "hidden"
				} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`}
			>
				{/* Mobile header with back button */}
				<div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowFriendsList(false)}
							className="hover:bg-gray-100 dark:hover:bg-gray-800"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2">
							Messages
						</h1>
					</div>
				</div>

				{/* Header */}
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								Messages
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								conversations
							</p>
						</div>
						<div className="flex items-center space-x-2">
							<FriendsDialog />

							<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:opacity-90 transition-opacity"
									>
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={user?.profilePicture}
												alt={user?.username || "User"}
												className="object-cover"
											/>
											<AvatarFallback className="bg-primary/10 text-primary">
												{user?.firstName?.[0]?.toUpperCase() ||
													user?.username?.[0]?.toUpperCase() ||
													"U"}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DialogTrigger>

								<DialogContent className="sm:max-w-[425px] md:max-w-[900px] h-[80vh] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-950">
									<VisuallyHidden>
										<DialogTitle>Profile Settings</DialogTitle>
									</VisuallyHidden>
									<ProfileSettings onSave={handleSaveProfile} />
								</DialogContent>
							</Dialog>
						</div>
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
						/>
					</div>
					<ActiveUsersList />
				</div>

				{/* Conversations List */}
				<ConversationsList
					handleStartChat={handleStartChat}
					handleUserProfileClick={handleUserProfileClick}
				/>
			</div>

			{/* Main chat area */}
			<MainChatArea
				handleUserProfileClick={handleUserProfileClick}
				setShowFriendsList={setShowFriendsList}
			/>

			{/* User Profile Dialog */}
			<UserProfileDialog
				user={selectedUserProfile}
				isOpen={showUserProfile}
				onClose={() => setShowUserProfile(false)}
			/>
		</div>
	);
}
