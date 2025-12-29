"use client";

import React, { useState, useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/stateManagment/authStore";
import {
  OnboardingSchema,
  type OnboardingDataType,
} from "@/schema/onboarding/onboardingSchema";
import { PROFILE_PICTURES } from "@/types/utils";
import ProfileImagePicker from "@/components/profile/profileImagePicker";
import { toast } from "sonner";

interface PendingSignup {
  email: string;
  password: string;
}

function OnboardingPage() {
  const router = useRouter();
  const { signUp, login, isLoading, error, clearError } = useAuthStore();
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(true);
  const [selectedPicture, setSelectedPicture] = useState(PROFILE_PICTURES[0]);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingDataType>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePicture: PROFILE_PICTURES[0],
    },
  });

  // Check for pending signup data on mount
  useEffect(() => {
    const storedData = sessionStorage.getItem("pendingSignup");
    if (!storedData) {
      // No pending signup, redirect back to signup page
      router.push("/auth/signup");
      return;
    }

    try {
      const parsed = JSON.parse(storedData) as PendingSignup;
      if (!parsed.email || !parsed.password) {
        throw new Error("Invalid pending signup data");
      }
      setPendingSignup(parsed);
    } catch {
      sessionStorage.removeItem("pendingSignup");
      router.push("/auth/signup");
      return;
    }

    setIsChecking(false);
  }, [router]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
      setIsSubmitting(false);
    }
  }, [error, clearError]);

  const handlePictureSelect = (picture: string) => {
    setSelectedPicture(picture);
    form.setValue("profilePicture", picture);
    setIsImagePickerOpen(false);
  };

  const onSubmit = async (data: OnboardingDataType) => {
    if (!pendingSignup) {
      toast.error("Session expired. Please start over.");
      router.push("/auth/signup");
      return;
    }

    setIsSubmitting(true);

    // Prepare the full signup data
    const signupData = {
      email: pendingSignup.email,
      password: pendingSignup.password,
      firstName: data.firstName,
      lastName: data.lastName,
      profilePicture: data.profilePicture || selectedPicture,
    };

    // Create the account
    const success = await signUp(signupData);

    if (success) {
      // Clear the pending signup data
      sessionStorage.removeItem("pendingSignup");

      // Auto-login with the same credentials
      await login(pendingSignup.email, pendingSignup.password);

      // Redirect to chat
      router.push("/chat");
    } else {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking for pending signup
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Let&apos;s get to know you better
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-gray-200">
                  <Image
                    width={96}
                    height={96}
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsImagePickerOpen(true)}
                disabled={isSubmitting}>
                Choose Avatar
              </Button>
              <p className="text-xs text-muted-foreground">
                Pick a profile picture or use the default
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        disabled={isSubmitting}
                      />
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
                      <Input
                        placeholder="Doe"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("pendingSignup");
              router.push("/auth/signup");
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            disabled={isSubmitting}>
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
