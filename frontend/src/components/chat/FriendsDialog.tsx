"use client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, UserCheck } from "lucide-react";
import FriendsRequests from "./friendsRequests";
import FindFriends from "./findFriends";
import OnlineFriends from "./onlineFriends";
import { useFriendshipStore } from "@/stateManagment/friendshipStore";
import { useState } from "react";

export function FriendsDialog() {
	const [open, setOpen] = useState(false);
	const { friendshipRequests, friends } = useFriendshipStore();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
				>
					<Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md h-[600px] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Friends
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="online" className="w-full cursor-pointer">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger
							value="online"
							className="flex items-center gap-2 cursor-pointer"
						>
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							Online (
							{friends.filter((friend) => friend.status === "online").length})
						</TabsTrigger>
						<TabsTrigger
							value="requests"
							className="flex items-center gap-2 cursor-pointer"
						>
							<UserCheck className="h-4 w-4" />
							Requests ({friendshipRequests.length})
						</TabsTrigger>
						<TabsTrigger
							value="find"
							className="flex items-center gap-2 cursor-pointer"
						>
							<UserPlus className="h-4 w-4" />
							Find Friends
						</TabsTrigger>
					</TabsList>
					<OnlineFriends changeDialogOpen={setOpen} />
					<FriendsRequests />
					<FindFriends />
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
