import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as React from "react";

export const SkeletonCard = (): React.JSX.Element => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
};
