/**
 * Un jeu de variables CSS applicable à un élément.
 *
 * Les clés sont des noms de custom properties (`--k-radius-control`), les valeurs
 * sont brutes côté CSS (`"0.5rem"`, `"9999px"`, `"222.2 47.4% 11.2%"`).
 */
export type TokenSet = Record<`--${string}`, string>;

/**
 * Une famille de tokens : plusieurs presets nommés pilotant le même groupe de
 * variables (radius, densité, élévation…).
 *
 * Tous les presets d'une famille doivent déclarer les mêmes clés : c'est ce qui
 * permet à `applyTokenPreset` de nettoyer la famille avant d'appliquer un
 * preset, sans laisser de variable orpheline.
 */
export type TokenFamily<TPreset extends string = string> = Record<TPreset, TokenSet>;
