"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordSchema,
  ForgotPasswordDataType,
} from "@/schema/auth/forgotPasswordSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const ForgetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const form = useForm<ForgotPasswordDataType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: ForgotPasswordDataType) => {
    setIsLoading(true);

    console.log("Forgot password data:", data);
    console.log("message:", message);

    setTimeout(() => {
      setIsLoading(false);
      setMessage(
        `Reset link sent to ${data.email}. Check your inbox and spam folder.`
      );
    }, 2000);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
