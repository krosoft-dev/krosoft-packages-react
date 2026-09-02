import { useKrosoftTranslation } from "@/i18n";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorHttp } from "@krosoft/core/types";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  /** `Error` accepté au même titre qu'`ErrorHttp` : les composants reçoivent aussi bien une erreur d'API qu'une exception JS. */
  error: ErrorHttp | Error | null | undefined;
  className?: string;
}

/** Code HTTP et liste de détails ne sont portés que par `ErrorHttp` : une `Error` n'affiche que son message. */
const readDetails = (error: ErrorHttp | Error): { code?: number; errors?: string[] } =>
  error instanceof Error ? {} : { code: error.code, errors: error.errors ?? undefined };

export const ErrorAlert = ({ error, className }: ErrorAlertProps): React.ReactElement | null => {
  const { t } = useKrosoftTranslation();
  if (!error) return null;

  const { code, errors } = readDetails(error);

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="size-4" />
      <AlertDescription>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{t("states.errorPrefix")}</span>
          {code !== undefined && <span>{code}</span>}
          <span className="break-words [overflow-wrap:anywhere]">{error.message}</span>
        </div>
        {errors && errors.length > 0 && (
          <ul className="mt-2 list-disc list-inside">
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
};
