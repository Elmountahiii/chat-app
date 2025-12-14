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

type BlockUserDailogPropos = {
	isOpen: boolean;
	setIsopen: (open: boolean) => void;
	user: User | null;
	onConfirm: () => void;
};

function BlockUserDailog({
	isOpen,
	setIsopen,
	user,
	onConfirm,
}: BlockUserDailogPropos) {
	const handleBlock = () => {
		onConfirm();
		setIsopen(false);
	};

	if (!user) return null;

	return (
		<Dialog open={isOpen} onOpenChange={setIsopen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Block User</DialogTitle>
					<DialogDescription>
						Are you sure you want to block{" "}
						<span className="font-semibold">{user.username}</span>?
						<br />
						You will no longer receive messages from this user and they
						won&apos;t be able to contact you.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button variant="destructive" onClick={handleBlock}>
						Block User
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default BlockUserDailog;
