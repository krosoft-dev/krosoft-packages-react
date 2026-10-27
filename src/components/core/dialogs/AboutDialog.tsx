import { format, isValid, type Locale } from "date-fns";
import type { ReactElement, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/helpers/tailwind.helper";
import { useDateFnsLocale, useKrosoftTranslation } from "@/i18n";

/** Informations de build affichées par `AboutDialog`. */
export interface AboutInfo {
  version: string;
  environment?: string;
  /** Date ISO (ou `Date`) formatée dans la langue courante ; une chaîne non parsable est affichée telle quelle. */
  buildDate?: string | Date;
}

export interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  info: AboutInfo;
  /** Logo ou image affiché au-dessus des informations. */
  logo?: ReactNode;
  /** Clé i18n ou libellé déjà résolu. `about.title` (« À propos ») par défaut. */
  title?: string;
  className?: string;
}

const formatBuildDate = (value: string | Date, locale: Locale): string => {
  const date = value instanceof Date ? value : new Date(value);

  return isValid(date) ? format(date, "Pp", { locale }) : String(value);
};

/**
 * Popup « À propos » : logo optionnel, version, environnement et date de build.
 *
 * Les valeurs viennent de l'application (en général des constantes injectées par
 * le `define` de Vite) ; les libellés `about.*` sont fournis par le package.
 *
 * À monter hors du `DropdownMenuContent` qui l'ouvre, sinon il est démonté à la
 * fermeture du menu :
 *
 * ```tsx
 * import { AboutDialog } from "@krosoft/react/components/core/dialogs";
 *
 * <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} info={appInfo} logo={<img src={logo} alt="" className="h-12" />} />
 * ```
 */
export const AboutDialog = ({ open, onOpenChange, info, logo, title = "about.title", className }: AboutDialogProps): ReactElement => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();

  const rows = [
    { label: t("about.version"), value: info.version },
    { label: t("about.environment"), value: info.environment },
    { label: t("about.buildDate"), value: info.buildDate ? formatBuildDate(info.buildDate, locale) : undefined },
  ].filter(row => row.value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-sm", className)} aria-describedby={undefined}>
        <DialogHeader className="mb-6">
          <DialogTitle>{t(title)}</DialogTitle>
        </DialogHeader>
        {logo && <div className="flex justify-center">{logo}</div>}
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {rows.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-mono">{value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
};
