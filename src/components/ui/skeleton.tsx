import { cn } from "../../helpers/tailwind.helper";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("animate-pulse rounded-control bg-muted", className)} {...props} />;
}

export { Skeleton };
