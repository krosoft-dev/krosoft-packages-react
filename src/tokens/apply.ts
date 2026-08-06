import type { CSSProperties } from "react";
import type { TokenFamily, TokenSet } from "./types";

/** `<html>` par défaut, `null` côté serveur — les helpers deviennent alors des no-op. */
const resolveTarget = (target?: HTMLElement | null): HTMLElement | null => {
  if (target) {
    return target;
  }
  return typeof document === "undefined" ? null : document.documentElement;
};

/**
 * Pose des variables CSS en style inline sur un élément (par défaut `<html>`).
 *
 * Le style inline l'emporte sur toute règle CSS ciblant le même élément : c'est
 * volontaire, c'est ce qui permet à un sélecteur runtime de reprendre la main
 * sur les défauts du package. Pour un choix figé à l'échelle d'une app,
 * redéfinir les variables dans `:root` reste préférable — pas de JS, pas de flash.
 */
export const applyTokens = (tokens: TokenSet, target?: HTMLElement | null): void => {
  const element = resolveTarget(target);
  if (!element) {
    return;
  }

  for (const [name, value] of Object.entries(tokens)) {
    element.style.setProperty(name, value);
  }
};

/** Retire les variables posées par `applyTokens` et rend la main au CSS. */
export const clearTokens = (tokens: TokenSet, target?: HTMLElement | null): void => {
  const element = resolveTarget(target);
  if (!element) {
    return;
  }

  for (const name of Object.keys(tokens)) {
    element.style.removeProperty(name);
  }
};

/**
 * Applique un preset d'une famille, après avoir nettoyé toutes les variables de
 * cette famille : basculer vers un preset qui déclare moins de clés qu'un autre
 * ne laisse pas de résidu du précédent.
 */
export const applyTokenPreset = <TPreset extends string>(family: TokenFamily<TPreset>, preset: TPreset, target?: HTMLElement | null): void => {
  const element = resolveTarget(target);
  if (!element) {
    return;
  }

  for (const tokens of Object.values<TokenSet>(family)) {
    clearTokens(tokens, element);
  }
  applyTokens(family[preset], element);
};

/**
 * Variables sous forme de `style` React, pour scoper un sous-arbre plutôt que
 * tout le document : `<div style={tokensToStyle({ "--k-radius-control": "3px" })}>`.
 *
 * Utile surtout pour un objet écrit sur place : `CSSProperties` ne modélise pas
 * les custom properties, un littéral inline se ferait refuser sans cast.
 */
export const tokensToStyle = (tokens: TokenSet): CSSProperties => tokens;
