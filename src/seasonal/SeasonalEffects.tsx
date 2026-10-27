import React, { useMemo } from "react";
import Snowfall from "react-snowfall";
import { useHalloweenEffect, useSnowEffect } from "./useSeasonalEffects";

const HALLOWEEN_EMOJIS = ["🎃", "🦇", "👻", "🕷️", "🍬"];
const EMOJI_SIZE = 64;

// Calque plein écran au-dessus de tout, qui laisse passer les clics.
const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: 0,
  left: 0,
  zIndex: 9999,
  pointerEvents: "none",
};

/** Dessine un emoji sur un canvas pour que react-snowfall puisse l'utiliser comme flocon. */
const emojiToImage = (emoji: string): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = EMOJI_SIZE;
  canvas.height = EMOJI_SIZE;
  const context = canvas.getContext("2d");
  if (context) {
    context.font = `${String(EMOJI_SIZE * 0.8)}px serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(emoji, EMOJI_SIZE / 2, EMOJI_SIZE / 2);
  }
  return canvas;
};

export interface SeasonalEffectProps {
  /** Préfixe des clés localStorage de l'application, identique à celui de `SeasonalEffectsSettings`. */
  storagePrefix?: string;
}

/** Flocons de neige en décembre, sauf si l'utilisateur les a désactivés. */
export const SnowEffect = ({ storagePrefix }: SeasonalEffectProps): React.JSX.Element | null => {
  const { isSnowSeason, isSnowEnabled } = useSnowEffect(storagePrefix);

  if (!isSnowSeason || !isSnowEnabled) {
    return null;
  }

  return <Snowfall style={OVERLAY_STYLE} />;
};

const HalloweenSnowfall = (): React.JSX.Element => {
  // Canvas créés seulement quand l'effet s'affiche réellement.
  const images = useMemo(() => HALLOWEEN_EMOJIS.map(emojiToImage), []);

  return <Snowfall images={images} snowflakeCount={25} radius={[10, 18]} speed={[0.5, 1.5]} wind={[-0.5, 1]} rotationSpeed={[-1, 1]} style={OVERLAY_STYLE} />;
};

/** Citrouilles et chauves-souris du 25 octobre au 2 novembre, sauf si l'utilisateur les a désactivées. */
export const HalloweenEffect = ({ storagePrefix }: SeasonalEffectProps): React.JSX.Element | null => {
  const { isHalloweenSeason, isHalloweenEnabled } = useHalloweenEffect(storagePrefix);

  if (!isHalloweenSeason || !isHalloweenEnabled) {
    return null;
  }

  return <HalloweenSnowfall />;
};

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
