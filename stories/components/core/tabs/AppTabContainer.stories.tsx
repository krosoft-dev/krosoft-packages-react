import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { AppTabContainer } from "@/components/core/tabs/AppTabContainer";

const meta: Meta<typeof AppTabContainer> = {
  title: "Core/Tabs/AppTabContainer",
  component: AppTabContainer,
  args: {
    titleKey: "Informations générales",
    children: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Contenu de l'onglet affiché dans une carte.</p>
        <p>Les enfants sont rendus dans le CardContent.</p>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof AppTabContainer>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    titleKey: "Documents",
    descriptionKey: "Tous les documents liés à ce dossier",
  },
};

export const WithActions: Story = {
  args: {
    titleKey: "Contacts",
    descriptionKey: "Contacts associés",
    actions: [
      {
        labelKey: "Ajouter",
        icon: Plus,
        onClick: () => {},
      },
    ],
  },
};

export const WithRichContent: Story = {
  args: {
    titleKey: "Équipe",
    descriptionKey: "Membres du projet",
    actions: [
      {
        labelKey: "Inviter",
        icon: Plus,
        onClick: () => {},
      },
    ],
    children: (
      <div className="space-y-3">
        {["Alice Martin", "Bob Dupont", "Claire Bernard"].map(name => (
          <div key={name} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
              {name.split(" ").map(n => n[0]).join("")}
            </div>
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>
    ),
  },
};
