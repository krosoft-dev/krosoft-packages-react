import React, { useMemo } from "react";
import Snowfall from "react-snowfall";
import { OVERLAY_STYLE } from "./overlayStyle";

const EMOJI_SIZE = 64;

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

interface EmojiSnowfallProps {
  /** Tableau stable (constante de module) : il sert de dépendance au `useMemo` des canvas. */
  emojis: readonly string[];
}

/** Pluie d'emojis plein écran. Les canvas ne sont créés qu'au montage, donc seulement quand l'effet s'affiche. */
export const EmojiSnowfall = ({ emojis }: EmojiSnowfallProps): React.JSX.Element => {
  const images = useMemo(() => emojis.map(emojiToImage), [emojis]);

  return <Snowfall images={images} snowflakeCount={25} radius={[10, 18]} speed={[0.5, 1.5]} wind={[-0.5, 1]} rotationSpeed={[-1, 1]} style={OVERLAY_STYLE} />;
};
