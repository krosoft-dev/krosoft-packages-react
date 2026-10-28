import React from "react";
import { HalloweenEffect } from "./HalloweenEffect";
import type { SeasonalEffectProps } from "./SeasonalEffectProps";
import { SnowEffect } from "./SnowEffect";

/**
 * Tous les effets saisonniers, à monter une fois à la racine de l'application.
 *
 * ```tsx
 * import { SeasonalEffects } from "@krosoft/react/seasonal";
 *
 * <SeasonalEffects storagePrefix={import.meta.env.VITE_LOCALSTORAGE_KEY} />
 * ```
 */
export const SeasonalEffects = ({ storagePrefix }: SeasonalEffectProps): React.JSX.Element => (
  <>
    <SnowEffect storagePrefix={storagePrefix} />
    <HalloweenEffect storagePrefix={storagePrefix} />
  </>
);
