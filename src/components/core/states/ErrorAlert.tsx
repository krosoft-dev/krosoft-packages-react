import { useKrosoftTranslation } from "@/i18n";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorHttp } from "@krosoft/core/types";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: ErrorHttp | null;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const { t } = useKrosoftTranslation();
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertDescription>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{t("states.errorPrefix")}</span>
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
