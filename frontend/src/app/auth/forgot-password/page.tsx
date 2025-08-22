import { AuthCard } from "@/components/auth/authCard";
import ForgetPasswordForm from "@/components/auth/forgetPasswordForm";
import React from "react";

function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <AuthCard
        title="Reset password"
        description="Enter your email address and we'll send you a link to reset
            your password">
        <ForgetPasswordForm />
      </AuthCard>
    </div>
  );
}

export default page;
