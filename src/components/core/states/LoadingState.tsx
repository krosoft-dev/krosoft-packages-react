import { Loader2Icon } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message }: LoadingStateProps): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground animate-fade-in">
      <Loader2Icon className="size-8 animate-spin mb-4 text-primary" />
      {message ? <p className="font-semibold text-sm">{message}</p> : null}
    </div>
  );
};
