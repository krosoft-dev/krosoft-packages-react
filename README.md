# krosoft-packages-react

[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/badges/made-with-typescript.svg)](https://forthebadge.com)

Krosoft shared React package.

## Libellés du package

Les composants portent leurs propres libellés — « Annuler », « Aucun résultat », placeholders de recherche, messages d'erreur de formulaire. Ils vivent dans `src/locales/{fr,en}.json`, sous le namespace i18next `krosoft`, séparé de celui de l'application pour qu'aucune clé ne se marche dessus.

Une application qui utilise i18next enregistre ces traductions une fois, après son `init` :

```ts
import i18n from "i18next";
import { registerKrosoftLocales } from "@krosoft/react/i18n";

registerKrosoftLocales(i18n);
```

Les libellés suivent alors la langue de l'application, changement à chaud compris.

**Rien à faire pour les applications existantes.** Sans cet appel — ou sans i18next du tout — les composants retombent sur le français embarqué : le rendu est exactement celui d'avant.

### Surcharger un libellé

`registerKrosoftLocales` n'écrase pas ce qui existe déjà. Une application peut donc imposer sa propre formulation, avant ou après l'enregistrement :

```ts
import { KROSOFT_NAMESPACE } from "@krosoft/react/i18n";

i18n.addResourceBundle("fr", KROSOFT_NAMESPACE, { states: { noData: "Rien à afficher" } }, true, true);
```

Passer `{ overwrite: true }` fait l'inverse : les valeurs du package reprennent la main.

Les props de libellé restent prioritaires sur tout le reste : `<ChartCard emptyLabel="…" />` l'emporte sur la traduction, comme avant.

## Preset Tailwind

Le preset partagé apporte le `darkMode`, le `container`, les couleurs shadcn (`--primary`, `--background`, `--border`, `--sidebar-*`…), les couleurs krosoft (`--k-success`, `--k-topbar-*`…), les radius, les keyframes accordéon et le plugin `tailwindcss-animate`. Un projet consommateur qui déclarait tout ça dans son propre `tailwind.config` peut supprimer ces lignes et ne garder que ce qui lui est propre.

```ts
import krosoftPreset, { krosoftContent } from "@krosoft/react/tailwind";

export default {
  presets: [krosoftPreset],
  content: [...krosoftContent, "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // uniquement les tokens propres au projet
    },
  },
} satisfies Config;
```

> **`krosoftContent` n'est pas optionnel.** Tailwind n'additionne pas les `content` : celui du projet écrase purement et simplement celui de ses presets. Le preset ne peut donc pas déclarer les fichiers à scanner pour lui — sans le spread, aucune classe des composants du package n'est générée (`rounded-control`, `bg-topbar`, `animate-in`…) et ils s'affichent sans style.

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

### Appliquer un preset depuis le code

La forme est une décision de design, pas une préférence utilisateur : elle se fixe une fois pour l'application, aux côtés des couleurs du thème. L'override de `:root` ci-dessus est la voie normale — servi avec la feuille de style, il évite tout flash au premier rendu.

Les mêmes presets sont exposés en TypeScript pour les cas où la forme vient du code plutôt que du CSS : configuration chargée au démarrage, application multi-marques, aperçu dans une story.

```ts
import { applyTokenPreset, radiusPresets } from "@krosoft/react/tokens";

// dans main.tsx, avant createRoot().render()
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
