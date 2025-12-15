"use client";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type UnfriendUserDialogPropos = {
	isOpen: boolean;
	setIsopen: (open: boolean) => void;
	user: User | undefined;
	onConfirm: () => void;
};

function UnfriendUserDialog({
	isOpen,
	setIsopen,
	user,
	onConfirm,
}: UnfriendUserDialogPropos) {
	const handleUnfriend = () => {
		onConfirm();
		setIsopen(false);
	};
	if (!user) return null;

	return (
		<Dialog open={isOpen} onOpenChange={setIsopen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Unfriend User</DialogTitle>
					<DialogDescription>
						Are you sure you want to unfriend{" "}
						<span className="font-semibold">{user.username}</span>?
						<br />
						This will remove them from your friends list. You can add them back
						later if you change your mind.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button variant="destructive" onClick={handleUnfriend}>
						Unfriend
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default UnfriendUserDialog;
