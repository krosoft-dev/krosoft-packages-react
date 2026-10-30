import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppChangelog } from "@/components/core/changelog/AppChangelog";

const meta: Meta<typeof AppChangelog> = {
  title: "Core/Changelog/AppChangelog",
  component: AppChangelog,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AppChangelog>;

const RELEASE_NOTES = `## 2026-10-30 14:41

**Nouveautés** : page des dernières évolutions, accessible depuis le menu utilisateur.

## 2026-10-29 17:22

**Maintenance** : les filtres version et statut sont propres à chaque onglet.

**Tableau de bord** : total de la période dans l'en-tête du graphe.

## 2026-10-27 09:44

**Factures** : export CSV de la liste filtrée, voir \`Exporter\` dans la barre d'outils.

- Colonnes visibles respectées
- Encodage UTF-8

## 2026-09-04 10:13

**Connexion** : « Se connecter avec Microsoft » passe par l'application Entra dédiée.
`;

export const Default: Story = {
  args: {
    content: RELEASE_NOTES,
  },
};

export const WithoutNav: Story = {
  args: {
    content: RELEASE_NOTES,
    showNav: false,
  },
};

export const Empty: Story = {
  args: {
    content: "",
  },
};
