import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

type Props = {};

function UserCardSkeleton({}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-8 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCardSkeleton;
