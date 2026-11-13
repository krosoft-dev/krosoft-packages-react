import type { JSX, MouseEvent, ReactNode } from "react";
import { CopyIcon } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";
import { useCopyToClipboard } from "@/hooks/behavior/useCopyToClipboard";
import { useKrosoftTranslation } from "@/i18n";

export interface AppCopyableValueProps {
  /** Valeur copiée. */
  value: string;
  /** Contenu affiché (un lien par exemple), la valeur à défaut. */
  children?: ReactNode;
  className?: string;
}

/** Valeur (ID, identifiant...) suivie d'un bouton de copie qui apparaît au survol. */
export const AppCopyableValue = ({ value, children, className }: AppCopyableValueProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { copy } = useCopyToClipboard();

  const handleCopy = (event: MouseEvent<HTMLButtonElement>): void => {
    // Dans un tableau, la copie ne doit pas déclencher le clic de ligne.
    event.stopPropagation();
    void copy(value);
  };

  return (
    <span className={cn("group inline-flex max-w-full items-center gap-1.5", className)}>
      <span className="min-w-0 break-all">{children ?? value}</span>
      <button
        type="button"
        className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
        title={t("copy.action")}
        aria-label={t("copy.action")}
        onClick={handleCopy}
      >
        <CopyIcon className="size-3.5" />
      </button>
    </span>
  );
};
