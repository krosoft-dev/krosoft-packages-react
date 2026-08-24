import { useKrosoftTranslation } from "@/i18n";
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage, type LanguageOption } from "@/hooks/ui/useLanguage";
import { LanguagesIcon } from "lucide-react";

interface LanguageSelectorProps {
  languageOptions: readonly LanguageOption[];
  variant?: "select" | "mini";
  /** Posé sur le déclencheur, pour qu'un `<Label htmlFor>` de l'application puisse s'y associer. */
  id?: string;
  /** Classes du bouton de la variante `mini`, pour l'accorder à la surface qui l'accueille. */
  className?: string;
}

export function LanguageSelector({ languageOptions, variant = "select", id, className }: LanguageSelectorProps): React.JSX.Element {
  const { t } = useKrosoftTranslation();
  const { currentLanguageOption, nextLanguageOption, changeLanguage, cycleLanguage } = useLanguage(languageOptions);

  if (variant === "mini") {
    const CurrentIcon = currentLanguageOption?.icon ?? LanguagesIcon;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button id={id} variant="ghost" size="icon" onClick={cycleLanguage} className={className}>
              <CurrentIcon className="size-4" />
              <span className="sr-only">{t("language.current", { language: currentLanguageOption?.label ?? "" })}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            {t("language.switchTo", { language: nextLanguageOption?.label ?? "" })}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      <Select value={currentLanguageOption?.value} onValueChange={changeLanguage}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={t("select.language")} />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map(option => {
            const Icon = option.icon ?? LanguagesIcon;

            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">{t("language.description")}</p>
    </div>
  );
}
