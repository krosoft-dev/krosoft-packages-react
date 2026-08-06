import type { TokenFamily } from "./types";

/**
 * Presets de radius.
 *
 * Ces valeurs sont dupliquées dans `src/styles/globals.css` sous forme de blocs
 * `[data-radius="…"]` : l'attribut reste le moyen le plus sûr de fixer la forme
 * dès le premier rendu, sans flash. `tests/tokens/radius.test.ts` vérifie que
 * les deux restent alignés.
 *
 * Les tokens ajoutés par krosoft portent le préfixe --k- ; ceux hérités de
 * shadcn gardent leur nom d'origine.
 *
 * Trois tokens, deux publics :
 *   --k-radius-control : contrôles interactifs — boutons, inputs, selects,
 *                        pastilles de filtre, badges, onglets. `rounded-control`
 *   --k-radius-surface : conteneurs — cards, dialogs, popovers, menus, tableaux.
 *                        `rounded-surface`
 *   --radius           : token shadcn dont dérivent rounded-sm/md/lg, réservé aux
 *                        éléments imbriqués qui ne doivent jamais devenir des
 *                        capsules (items de menu, checkbox, poignées).
 *
 * Les variantes *-dense sont les valeurs plafonnées des blocs denses (DataTable) :
 * elles suivent le preset sans jamais prendre la forme capsule.
 */
export const radiusPresets = {
  square: {
    "--radius": "0rem",
    "--k-radius-control": "0rem",
    "--k-radius-surface": "0rem",
    "--k-radius-control-dense": "0rem",
    "--k-radius-surface-dense": "0rem",
  },
  soft: {
    "--radius": "0.5rem",
    "--k-radius-control": "0.5rem",
    "--k-radius-surface": "0.75rem",
    "--k-radius-control-dense": "0.5rem",
    "--k-radius-surface-dense": "0.75rem",
  },
  round: {
    "--radius": "0.75rem",
    "--k-radius-control": "9999px",
    "--k-radius-surface": "1.25rem",
    "--k-radius-control-dense": "0.5rem",
    "--k-radius-surface-dense": "0.75rem",
  },
} as const satisfies TokenFamily;

export type RadiusPreset = keyof typeof radiusPresets;
