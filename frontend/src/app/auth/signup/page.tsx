import { AuthCard } from "@/components/auth/authCard";
import SignUpForm from "@/components/auth/signUpForm";
import React from "react";

function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <AuthCard
        title="Create an account"
        description="Enter your information to create your account">
        <SignUpForm />
      </AuthCard>
    </div>
  );
}

export default page;
