# krosoft-packages-react

[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/badges/made-with-typescript.svg)](https://forthebadge.com)

Krosoft shared React package.

## Radius des composants

La forme des composants est pilotée par des variables CSS, pas par des classes `rounded-*` codées en dur : un input, un bouton et une pastille de filtre posés côte à côte ont toujours la même forme.

Trois presets existent :

| Preset            | Contrôles<br><small>boutons, inputs, selects, pastilles, badges</small> | Conteneurs<br><small>cards, dialogs, popovers, menus</small> |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `square`          | `0`                                                                     | `0`                                                          |
| `soft` _(défaut)_ | `0.5rem`                                                                | `0.75rem`                                                    |
| `round`           | capsule                                                                 | `1.25rem`                                                    |

Un projet consommateur choisit sa forme dans son propre thème, en redéfinissant les variables. Le preset `soft` :

```css
:root {
  --radius: 0.5rem; /* éléments imbriqués : items de menu, checkbox */
  --k-radius-control: 0.5rem; /* contrôles */
  --k-radius-surface: 0.75rem; /* conteneurs */
  --k-radius-control-dense: 0.5rem; /* mêmes valeurs, plafonnées pour le DataTable */
  --k-radius-surface-dense: 0.75rem;
}
```

Rien n'oblige à suivre un preset : n'importe quelle valeur convient (`--k-radius-control: 4px`). Sans redéfinition, les composants tombent sur `--radius`, donc un thème shadcn existant reste cohérent sans rien déclarer.

> **Nommage** — les tokens ajoutés par krosoft portent le préfixe `--k-`, ce qui les rend repérables d'un coup d'œil. Les tokens hérités de shadcn (`--radius`, `--primary`, `--background`, `--border`, `--sidebar-*`…) gardent leur nom d'origine : un thème généré par un outil shadcn ou un composant copié depuis la doc continuent de fonctionner tels quels.

## Tokens krosoft

| Variables                                                  | Classes Tailwind générées par le preset                          |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `--k-success`, `--k-warning`, `--k-info` (+ `-foreground`) | `bg-success`, `text-warning-foreground`, `border-info`…          |
| `--k-topbar-*`                                             | `bg-topbar`, `text-topbar-foreground`, `bg-topbar-accent`…       |
| `--k-sidebar-muted`                                        | `text-sidebar-muted`                                             |
| `--k-radius-control`, `--k-radius-surface` (+ `-dense`)    | `rounded-control`, `rounded-surface`                             |
| `--k-font-heading`, `--k-font-body`                        | appliquées directement par `globals.css` sur `body` et `h1`–`h6` |

Ces couleurs sont désormais mappées par le preset partagé : un projet consommateur qui les déclarait dans son propre `tailwind.config` peut supprimer ces lignes.

Story `Démos/Radius` pour comparer les presets, sélecteur **Radius** dans la barre d'outils Storybook pour les appliquer à n'importe quelle story.

### Changer de preset au runtime

Quand la forme est figée pour toute l'application, l'override de `:root` ci-dessus reste le bon choix : servi avec la feuille de style, il évite tout flash au premier rendu.

Pour un changement à chaud (sélecteur utilisateur, Storybook), les mêmes presets sont exposés en TypeScript — un preset n'est rien d'autre qu'un jeu de variables CSS :

```ts
import { applyTokenPreset, radiusPresets } from "@krosoft/react/tokens";

applyTokenPreset(radiusPresets, "round"); // pose les variables sur <html>
```

| Export             | Rôle                                                       |
| ------------------ | ---------------------------------------------------------- |
| `radiusPresets`    | Les trois presets, en objets `{ "--k-radius-control": … }` |
| `applyTokenPreset` | Applique un preset, après nettoyage de toute la famille    |
| `applyTokens`      | Pose un jeu de variables sur un élément (`<html>` défaut)  |
| `clearTokens`      | Retire ces variables et rend la main au CSS                |
| `tokensToStyle`    | Les mêmes variables en `style` React, pour un sous-arbre   |

C'est aussi ce qui rend la suite extensible : une nouvelle famille de tokens (densité, élévation…) ne demande ni attribut dédié ni preset CSS, seulement un objet à côté de `radiusPresets` et ses variables dans `:root`.
