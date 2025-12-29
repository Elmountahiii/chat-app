"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Lock, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/stateManagment/authStore";
import {
	profileSettingsSchema,
	type ProfileSettingsDataType,
} from "@/schema/profile/profileSettingsSchema";
import { PROFILE_PICTURES } from "@/types/utils";
import ProfileImagePicker from "./profileImagePicker";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ProfileSettingsProps = {
	onSave: (data: ProfileSettingsDataType) => void;
};

type SettingsSection = "general" | "security";

const NavItem = ({
	sectionId,
	icon: Icon,
	label,
	activeSection,
	setActiveSection,
}: {
	sectionId: SettingsSection;
	icon: React.ElementType;
	label: string;
	activeSection: SettingsSection;
	setActiveSection: (section: SettingsSection) => void;
}) => (
	<button
		type="button"
		onClick={() => setActiveSection(sectionId)}
		className={cn(
			"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
			activeSection === sectionId
				? "bg-primary/10 text-primary"
				: "text-muted-foreground hover:bg-muted hover:text-foreground",
			"md:w-full md:gap-3 md:px-3",
		)}
	>
		<Icon className="h-4 w-4" />
		{label}
	</button>
);

export default function ProfileSettings({ onSave }: ProfileSettingsProps) {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [activeSection, setActiveSection] =
		useState<SettingsSection>("general");
	const [selectedPicture, setSelectedPicture] = useState(
		user?.profilePicture || PROFILE_PICTURES[0],
	);
	const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ProfileSettingsDataType>({
		resolver: zodResolver(profileSettingsSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			profilePicture: user?.profilePicture || PROFILE_PICTURES[0],
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: ProfileSettingsDataType) => {
		setIsLoading(true);
		// Simulate network request for UX feel
		await new Promise((resolve) => setTimeout(resolve, 800));
		onSave(data);
		setIsLoading(false);
	};

	const handlePictureSelect = (picture: string) => {
		setSelectedPicture(picture);
		form.setValue("profilePicture", picture);
		setIsImagePickerOpen(false);
	};

	const handleLogout = async () => {
		await logout();
		router.push("/auth/login");
	};

	return (
		<div className="flex flex-col md:flex-row h-full w-full bg-white dark:bg-gray-950 overflow-hidden">
			{/* Sidebar / Tabs */}
			<aside className="w-full md:w-[240px] flex-shrink-0 border-b md:border-b-0 md:border-r bg-gray-50/50 dark:bg-gray-900/50 flex flex-col">
				<div className="p-4 md:p-6 pb-2 md:pb-4 hidden md:block">
					<h2 className="text-lg font-semibold tracking-tight">Settings</h2>
					<p className="text-xs text-muted-foreground mt-1">
						Manage your account
					</p>
				</div>

				<nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible px-4 py-2 md:py-0 md:px-4 space-x-2 md:space-x-0 md:space-y-1 no-scrollbar">
					<NavItem
						sectionId="general"
						icon={UserIcon}
						label="General"
						activeSection={activeSection}
						setActiveSection={setActiveSection}
					/>
					<NavItem
						sectionId="security"
						icon={Lock}
						label="Security"
						activeSection={activeSection}
						setActiveSection={setActiveSection}
					/>
				</nav>

				<div className="p-4 border-t mt-auto hidden md:block">
					<Button
						variant="ghost"
						className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-3"
						onClick={handleLogout}
					>
						<LogOut className="h-4 w-4" />
						Sign out
					</Button>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 overflow-hidden">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex-1 flex flex-col h-full"
					>
						{/* Scrollable Content */}
						<div className="flex-1 overflow-y-auto">
							<div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-10">
								{/* Header */}
								<div className="space-y-1 sm:mb-8">
									<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
										{activeSection === "general"
											? "General Information"
											: "Security Settings"}
									</h1>
									<p className="text-sm sm:text-base text-muted-foreground">
										{activeSection === "general"
											? "Update your profile details and public information."
											: "Manage your password and account security."}
									</p>
								</div>

								<Separator className="my-4 sm:my-6" />

								{activeSection === "general" && (
									<div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300 slide-in-from-left-2">
										{/* Profile Picture Section */}
										<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
											<div className="relative group shrink-0">
												<div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-950 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
													<Image
														width={112}
														height={112}
														src={selectedPicture}
														alt="Profile picture"
														className="object-cover w-full h-full"
													/>
												</div>
												<ProfileImagePicker
													isDialogOpen={isImagePickerOpen}
													setIsDialogOpen={setIsImagePickerOpen}
													selectedPicture={selectedPicture}
													setSelectedPicture={handlePictureSelect}
												/>
											</div>
											<div className="space-y-2">
												<h3 className="font-medium text-lg">Profile Photo</h3>
												<p className="text-sm text-muted-foreground max-w-[240px] sm:max-w-none">
													This will be displayed on your profile and in
													conversations.
												</p>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => setIsImagePickerOpen(true)}
													className="mt-2"
												>
													Change Photo
												</Button>
											</div>
										</div>

										<div className="grid gap-6 sm:gap-8 md:grid-cols-2">
											<FormField
												control={form.control}
												name="firstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm sm:text-base">
															First Name
														</FormLabel>
														<FormControl>
															<Input {...field} className="h-10 sm:h-11" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="lastName"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm sm:text-base">
															Last Name
														</FormLabel>
														<FormControl>
															<Input {...field} className="h-10 sm:h-11" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid gap-6 sm:gap-8">
											<div className="space-y-2 sm:space-y-3">
												<FormLabel className="text-sm sm:text-base">Email</FormLabel>
												<Input
													value={user?.email || ""}
													disabled
													className="bg-muted/50 h-10 sm:h-11"
												/>
												<p className="text-[0.75rem] sm:text-[0.8rem] text-muted-foreground">
													Email address cannot be changed.
												</p>
											</div>
										</div>
									</div>
								)}

								{activeSection === "security" && (
									<div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300 slide-in-from-right-2">
										<div className="space-y-6 max-w-2xl">
											<FormField
												control={form.control}
												name="password"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm sm:text-base">
															New Password
														</FormLabel>
														<FormControl>
															<Input
																type="password"
																placeholder="Min. 8 characters"
																{...field}
																className="h-10 sm:h-11"
															/>
														</FormControl>
														<FormDescription className="text-xs sm:text-sm">
															Leave blank to keep your current password.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="confirmPassword"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm sm:text-base">
															Confirm Password
														</FormLabel>
														<FormControl>
															<Input
																type="password"
																placeholder="Confirm new password"
																{...field}
																className="h-10 sm:h-11"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Sticky Footer */}
						<div className="p-4 sm:p-6 border-t bg-white dark:bg-gray-950 flex justify-end items-center gap-3 sm:gap-4">
							<div className="text-xs sm:text-sm text-muted-foreground mr-auto hidden sm:block">
								{form.formState.isDirty ? "You have unsaved changes" : ""}
							</div>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => form.reset()}
								disabled={!form.formState.isDirty || isLoading}
								className="h-10 px-4 sm:h-11 sm:px-8"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								size="sm"
								disabled={!form.formState.isDirty || isLoading}
								className="min-w-[100px] sm:min-w-[120px] h-10 sm:h-11"
							>
								{isLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Check className="mr-2 h-4 w-4" />
								)}
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			</main>
		</div>
	);
}
