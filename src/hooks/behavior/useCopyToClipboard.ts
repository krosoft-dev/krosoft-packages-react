import { useNotifications } from "@/hooks/ui/useNotifications";
import { useKrosoftTranslation } from "@/i18n";

export interface UseCopyToClipboardOptions {
  /** Clé i18n du message de succès. */
  successKey?: string;
  /** Clé i18n du message d'échec. */
  errorKey?: string;
}

export interface UseCopyToClipboardResult {
  /** Copie le texte et notifie le résultat ; renvoie vrai si la copie a réussi. */
  copy: (text: string) => Promise<boolean>;
}

/** Copie un texte dans le presse-papiers et affiche une notification de succès ou d'échec. */
export const useCopyToClipboard = ({ successKey = "copy.copied", errorKey = "copy.copyFailed" }: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult => {
  const { t } = useKrosoftTranslation();
  const { showSuccess, showError } = useNotifications();

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess(t(successKey));
      return true;
    } catch (error: unknown) {
      showError(t(errorKey), undefined, error instanceof Error ? error : null);
      return false;
    }
  };

  return { copy };
};
