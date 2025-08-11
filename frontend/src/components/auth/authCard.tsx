"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  className = "",
}: AuthCardProps) {
  return (
    <Card
      className={`w-full max-w-md animate-in fade-in duration-500 backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
