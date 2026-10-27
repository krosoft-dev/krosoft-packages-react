import { isHalloweenSeason, isSnowSeason } from "./seasons";
import { useStoredToggle } from "./useStoredToggle";

export interface UseSnowEffectResult {
  isSnowSeason: boolean;
  isSnowEnabled: boolean;
  setSnowEnabled: (enabled: boolean) => void;
}

export interface UseHalloweenEffectResult {
  isHalloweenSeason: boolean;
  isHalloweenEnabled: boolean;
  setHalloweenEnabled: (enabled: boolean) => void;
}

/**
 * Préférence utilisateur de l'effet neige.
 *
 * @param storagePrefix préfixe des clés localStorage de l'application (ex. `VITE_LOCALSTORAGE_KEY`) ;
 * la clé finale est `{storagePrefix}snow-effect-enabled`.
 */
export const useSnowEffect = (storagePrefix = ""): UseSnowEffectResult => {
  const [isSnowEnabled, setSnowEnabled] = useStoredToggle(`${storagePrefix}snow-effect-enabled`);
  return { isSnowSeason: isSnowSeason(), isSnowEnabled, setSnowEnabled };
};

/**
 * Préférence utilisateur de l'effet Halloween.
 *
 * @param storagePrefix préfixe des clés localStorage de l'application ;
 * la clé finale est `{storagePrefix}halloween-effect-enabled`.
 */
export const useHalloweenEffect = (storagePrefix = ""): UseHalloweenEffectResult => {
  const [isHalloweenEnabled, setHalloweenEnabled] = useStoredToggle(`${storagePrefix}halloween-effect-enabled`);
  return { isHalloweenSeason: isHalloweenSeason(), isHalloweenEnabled, setHalloweenEnabled };
};
