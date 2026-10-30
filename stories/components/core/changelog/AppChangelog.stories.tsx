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

## [1.3.0] - 2026-10-29 17:22 - Maintenance plus lisible

**Maintenance** : les filtres version et statut sont propres à chaque onglet.

**Tableau de bord** : total de la période dans l'en-tête du graphe.

## [1.2.1] - 2026-10-27 09:44

**Factures** : export CSV de la liste filtrée, voir \`Exporter\` dans la barre d'outils.

- Colonnes visibles respectées
- Encodage UTF-8

## 2026-09-04 10:13 - Connexion Microsoft

**Connexion** : « Se connecter avec Microsoft » passe par l'application Entra dédiée.

## 2026-08-28 16:05

**Factures** : rejet d'une facture depuis la liste, avec motif obligatoire.

## 2026-08-20 11:30

**Tableau de bord** : compteurs de factures, erreurs et e-reportings en tête de page.

## 2026-08-12 09:15

**Profil** : choix du thème et de la langue mémorisé par utilisateur.

## 2026-07-30 18:40

**Connexion** : redirection vers le tableau de bord après la connexion.

## 2026-07-21 14:00

**Maintenance** : historique des opérations de maintenance consultable par onglet.
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
