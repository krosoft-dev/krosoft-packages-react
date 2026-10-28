import { GhostIcon, SnowflakeIcon } from "lucide-react";
import React from "react";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { useKrosoftTranslation } from "@/i18n";
import { EffectSwitch } from "./EffectSwitch";
import type { SeasonalEffectProps } from "./SeasonalEffectProps";
import { useHalloweenEffect, useSnowEffect } from "./useSeasonalEffects";

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
