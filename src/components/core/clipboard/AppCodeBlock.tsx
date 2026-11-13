import type { JSX } from "react";
import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/helpers/tailwind.helper";
import { useCopyToClipboard } from "@/hooks/behavior/useCopyToClipboard";
import { useKrosoftTranslation } from "@/i18n";

export interface AppCodeBlockProps {
  content: string;
  /** Classe de hauteur maximale du bloc, au-delà de laquelle il défile. `max-h-80` par défaut. */
  maxHeightClassName?: string;
  /**
   * Remplit toute la hauteur du parent, sans bordure : pour une dialog dont le bloc est le seul contenu.
   * Le parent doit avoir une hauteur définie ; `maxHeightClassName` est alors ignoré.
   */
  fill?: boolean;
  /** Retour à la ligne, coupé n'importe où : pour une commande ou une clé à copier, plutôt qu'un défilement horizontal. */
  wrap?: boolean;
}

/** Bloc de code monospace défilant (JSON, stack trace) avec un bouton de copie. */
export const AppCodeBlock = ({ content, maxHeightClassName = "max-h-80", fill = false, wrap = false }: AppCodeBlockProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { copy } = useCopyToClipboard({ successKey: "codeBlock.copied", errorKey: "codeBlock.copyFailed" });

  return (
    <div className={cn("relative", fill && "h-full")}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute right-2 top-2 size-7"
        title={t("copy.action")}
        aria-label={t("copy.action")}
        onClick={() => void copy(content)}
      >
        <CopyIcon className="size-3.5" />
      </Button>
      <pre
        className={cn(
          "overflow-auto rounded-md border bg-muted/50 p-3 pr-12 font-mono text-xs leading-relaxed",
          wrap && "whitespace-pre-wrap break-all",
          fill ? "h-full rounded-none border-0" : maxHeightClassName,
        )}
      >
        {content}
      </pre>
    </div>
  );
};
