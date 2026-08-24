import { useKrosoftTranslation } from "@/i18n";
interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message }: ErrorStateProps): React.JSX.Element => {
  const { t } = useKrosoftTranslation();
  return (
    <div className="p-6 border border-destructive bg-destructive/10 text-destructive rounded-surface animate-fade-in">
      <p className="font-semibold mb-2">{t("states.error")}</p>
      {message !== undefined && message !== "" ? <p className="text-sm opacity-80">{message}</p> : null}
    </div>
  );
};
