import * as React from "react";
import { CardSkeleton } from "./CardSkeleton";

interface CardsSkeletonProps {
  count?: number;
}

export const CardsSkeleton = ({ count = 1 }: CardsSkeletonProps): React.JSX.Element => {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};
