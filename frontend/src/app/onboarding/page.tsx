"use client";
import ProfileSettings from "@/components/profile/profileSettings";
import { ProfileSettingsDataType } from "@/schema/profile/profileSettingsSchema";
import React from "react";

function page() {
	const handleSave = (data: ProfileSettingsDataType) => {
		if (data.password != "") {
			console.log("Password changed to : ", data.password);
		}
		console.log("Saved data:", data);
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
			<ProfileSettings onSave={handleSave} />
		</div>
	);
}

export default page;
