import * as React from "react";
import { SkeletonCard } from "./SkeletonCard";

interface SkeletonCardsProps {
  count?: number;
}

export const SkeletonCards = ({ count = 1 }: SkeletonCardsProps): React.JSX.Element => {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
