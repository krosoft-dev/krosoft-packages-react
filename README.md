# krosoft-packages-react

[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/badges/made-with-typescript.svg)](https://forthebadge.com)

Krosoft shared React package.

## Radius des composants

La forme des composants est pilotée par des variables CSS, pas par des classes `rounded-*` codées en dur : un input, un bouton et une pastille de filtre posés côte à côte ont toujours la même forme.

Choisir un preset sur `<html>` :

```html
<html lang="fr" data-radius="round"></html>
```

| Preset            | Contrôles<br><small>boutons, inputs, selects, pastilles, badges</small> | Conteneurs<br><small>cards, dialogs, popovers, menus</small> |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `square`          | `0`                                                                     | `0`                                                          |
| `soft` _(défaut)_ | `0.5rem`                                                                | `0.75rem`                                                    |
| `round`           | capsule                                                                 | `1.25rem`                                                    |

Pour des valeurs sur mesure, aucun preset n'est nécessaire — il suffit de redéfinir les variables :

```css
:root {
  --radius-control: 4px; /* contrôles */
  --radius-surface: 16px; /* conteneurs */
  --radius: 4px; /* éléments imbriqués : items de menu, checkbox */
}
```

Story `Démos/Radius` pour comparer les presets, sélecteur **Radius** dans la barre d'outils Storybook pour les appliquer à n'importe quelle story.
