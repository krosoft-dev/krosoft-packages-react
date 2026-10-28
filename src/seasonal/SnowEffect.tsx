import React from "react";
import Snowfall from "react-snowfall";
import { OVERLAY_STYLE } from "./overlayStyle";
import type { SeasonalEffectProps } from "./SeasonalEffectProps";
import { useSnowEffect } from "./useSeasonalEffects";

/** Flocons de neige en décembre, sauf si l'utilisateur les a désactivés. */
export const SnowEffect = ({ storagePrefix }: SeasonalEffectProps): React.JSX.Element | null => {
  const { isSnowSeason, isSnowEnabled } = useSnowEffect(storagePrefix);

  if (!isSnowSeason || !isSnowEnabled) {
    return null;
  }

  return <Snowfall style={OVERLAY_STYLE} />;
};
