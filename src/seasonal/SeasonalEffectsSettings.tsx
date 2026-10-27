import { GhostIcon, SnowflakeIcon, type LucideIcon } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { useKrosoftTranslation } from "@/i18n";
import { useHalloweenEffect, useSnowEffect } from "./useSeasonalEffects";
import type { SeasonalEffectProps } from "./SeasonalEffects";

interface EffectSwitchProps {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const EffectSwitch = ({ id, label, description, icon: Icon, checked, onCheckedChange }: EffectSwitchProps): React.JSX.Element => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        <span>{description}</span>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </div>
);

export interface SeasonalEffectsSettingsProps extends SeasonalEffectProps {
  className?: string;
}

/**
 * Interrupteurs des effets saisonniers, à poser dans la page profil. Chaque changement
 * affiche un toast : l'application doit monter `<Toaster />`.
 *
 * L'effet neige reste réglable toute l'année ; l'effet Halloween n'apparaît que pendant sa période.
 */
export const SeasonalEffectsSettings = ({ storagePrefix, className = "space-y-6" }: SeasonalEffectsSettingsProps): React.JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { showSuccess } = useNotifications();
  const { isSnowEnabled, setSnowEnabled } = useSnowEffect(storagePrefix);
  const { isHalloweenSeason, isHalloweenEnabled, setHalloweenEnabled } = useHalloweenEffect(storagePrefix);

  const handleSnowChange = (enabled: boolean): void => {
    setSnowEnabled(enabled);
    showSuccess(
      t(enabled ? "seasonal.snow.toastEnabled" : "seasonal.snow.toastDisabled"),
      t(enabled ? "seasonal.snow.messageEnabled" : "seasonal.snow.messageDisabled"),
    );
  };

  const handleHalloweenChange = (enabled: boolean): void => {
    setHalloweenEnabled(enabled);
    showSuccess(
      t(enabled ? "seasonal.halloween.toastEnabled" : "seasonal.halloween.toastDisabled"),
      t(enabled ? "seasonal.halloween.messageEnabled" : "seasonal.halloween.messageDisabled"),
    );
  };

  return (
    <div className={className}>
      <EffectSwitch
        id="seasonal-snow"
        label={t("seasonal.snow.label")}
        description={t("seasonal.snow.description")}
        icon={SnowflakeIcon}
        checked={isSnowEnabled}
        onCheckedChange={handleSnowChange}
      />
      {isHalloweenSeason && (
        <EffectSwitch
          id="seasonal-halloween"
          label={t("seasonal.halloween.label")}
          description={t("seasonal.halloween.description")}
          icon={GhostIcon}
          checked={isHalloweenEnabled}
          onCheckedChange={handleHalloweenChange}
        />
      )}
    </div>
  );
};
