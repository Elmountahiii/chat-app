"use client";
import { useAuthStore } from "@/stateManagment/authStore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  profileSettingsSchema,
  type ProfileSettingsDataType,
} from "@/schema/profile/profileSettingsSchema";
import { Input } from "@/components/ui/input";

import { PROFILE_PICTURES } from "@/types/utils";
import ProfileImagePicker from "./profileImagePicker";
import { Button } from "../ui/button";
import Image from "next/image";

type profileSettingsProps = {
  cardTitle: string;
  cardDescription: string;
  onSave: (data: ProfileSettingsDataType) => void;
};

function ProfileSettings({
  cardTitle,
  cardDescription,
  onSave,
}: profileSettingsProps) {
  const { user } = useAuthStore();
  const [selectedPicture, setSelectedPicture] = useState(
    user?.profilePicture || PROFILE_PICTURES[0]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ProfileSettingsDataType>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      profilePicture: user?.profilePicture || PROFILE_PICTURES[0],
    },
  });

  const onSubmit = (data: ProfileSettingsDataType) => {
    console.log("Form submitted:", data);
    onSave(data);
  };

  const handlePictureSelect = (picture: string) => {
    setSelectedPicture(picture);
    form.setValue("profilePicture", picture);
    setIsDialogOpen(false);
  };

  return (
    <Card
      className={`w-full max-w-md animate-in fade-in duration-500 backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {cardTitle}
        </CardTitle>
        <CardDescription className="text-center">
          {cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                 width={40}
                  height={40}
                  src={selectedPicture}
                  alt="Profile picture"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
                <ProfileImagePicker
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  selectedPicture={selectedPicture}
                  setSelectedPicture={handlePictureSelect}
                />
              </div>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ProfileSettings;
