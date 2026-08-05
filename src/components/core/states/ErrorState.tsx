interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message }: ErrorStateProps): React.JSX.Element => {
  return (
    <div className="p-6 border border-destructive bg-destructive/10 text-destructive rounded-surface animate-fade-in">
      <p className="font-semibold mb-2">Une erreur est survenue.</p>
      {message !== undefined && message !== "" ? <p className="text-sm opacity-80">{message}</p> : null}
    </div>
  );
};
