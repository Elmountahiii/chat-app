"use client";
import ProfileSettings from "@/components/profile/profileSettings";
import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <ProfileSettings
        cardTitle="Onboarding Profile Settings"
        cardDescription="Manage your onboarding profile settings"
        onSave={(data) => console.log("Saved data:", data)}
      />
    </div>
  );
}

export default page;
