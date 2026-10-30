import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppMarkdown } from "@/components/core/markdown/AppMarkdown";

const meta: Meta<typeof AppMarkdown> = {
  title: "Core/Markdown/AppMarkdown",
  component: AppMarkdown,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AppMarkdown>;

const CHANGELOG = `# Journal des versions

## [1.2.0] - 2026-10-30 09:00

### Ajouté
- Export CSV des factures.
- Filtre par statut dans la liste, voir [la section suivante](#v1.1.0).

### Corrigé
- Le tri par date ignorait le fuseau horaire.

## [1.1.0] - 2026-10-15 14:30

> Version de maintenance.

| Domaine | Changement |
| --- | --- |
| Factures | Pagination côté serveur |
| Profil | Avatar modifiable |

\`\`\`bash
npm install @krosoft/react
\`\`\`

Le code inline \`AppMarkdown\` est aussi stylé.
`;

const RELEASE_NOTES = `## Export des factures
_30 octobre 2026_

- Factures : export CSV de la liste filtrée.
- Tableau de bord : nouveau widget des rejets Chorus.

## Thème plus lisible
_15 octobre 2026_

- Contrastes revus en mode sombre.
`;

export const Changelog: Story = {
  args: {
    content: CHANGELOG,
  },
};

export const WithoutHeadingAnchors: Story = {
  args: {
    content: RELEASE_NOTES,
    headingAnchors: false,
  },
};
