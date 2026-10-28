import React from "react";
import { EmojiSnowfall } from "./EmojiSnowfall";
import type { SeasonalEffectProps } from "./SeasonalEffectProps";
import { useHalloweenEffect } from "./useSeasonalEffects";

const HALLOWEEN_EMOJIS = ["🎃", "🦇", "👻", "🕷️", "🍬"] as const;

/** Citrouilles et chauves-souris du 25 octobre au 2 novembre, sauf si l'utilisateur les a désactivées. */
export const HalloweenEffect = ({ storagePrefix }: SeasonalEffectProps): React.JSX.Element | null => {
  const { isHalloweenSeason, isHalloweenEnabled } = useHalloweenEffect(storagePrefix);

  if (!isHalloweenSeason || !isHalloweenEnabled) {
    return null;
  }

  return <EmojiSnowfall emojis={HALLOWEEN_EMOJIS} />;
};
