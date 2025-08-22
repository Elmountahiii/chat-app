import { AuthCard } from "@/components/auth/authCard";
import LoginForm from "@/components/auth/loginForm";
import React from "react";

function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      <AuthCard
        title="Welcome back"
        description="Please sign in to your account.">
        <LoginForm />
      </AuthCard>
    </div>
  );
}

export default page;
