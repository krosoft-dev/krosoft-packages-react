import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorHttp } from "@krosoft/core/types";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: ErrorHttp | null;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Erreur :</span>
          <span>{error.code}</span>
          <span>{error.message}</span>
        </div>
        {error.errors && error.errors.length > 0 && (
          <ul className="mt-2 list-disc list-inside">
            {error.errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
};
