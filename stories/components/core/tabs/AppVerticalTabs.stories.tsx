import type { TabConfig } from "@/types/TabConfig";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Settings, Users } from "lucide-react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { AppVerticalTabs } from "@/components/core/tabs/AppVerticalTabs";

const withRouter = (Story: React.ComponentType) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const makeContent = (label: string) => () => (
  <div className="p-4 rounded-lg border bg-muted/30 text-sm text-muted-foreground">
    Contenu de la section <strong>{label}</strong>
  </div>
);

const basicTabs: TabConfig[] = [
  { value: "profil", titleKey: "Profil", component: makeContent("Profil") },
  { value: "securite", titleKey: "Sécurité", component: makeContent("Sécurité") },
  { value: "notifications", titleKey: "Notifications", component: makeContent("Notifications") },
];

const tabsWithMissing: TabConfig[] = [
  { value: "general", titleKey: "Général", component: makeContent("Général") },
  { value: "facturation", titleKey: "Facturation" },
  { value: "integrations", titleKey: "Intégrations" },
  { value: "avance", titleKey: "Paramètres avancés", component: makeContent("Paramètres avancés") },
];

const meta: Meta<typeof AppVerticalTabs> = {
  title: "Core/Tabs/AppVerticalTabs",
  component: AppVerticalTabs,
  decorators: [withRouter],
  args: {
    tabs: basicTabs,
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AppVerticalTabs>;

const tabsWithIcons: TabConfig[] = [
  { value: "profil", titleKey: "Profil", icon: Users, component: makeContent("Profil") },
  { value: "securite", titleKey: "Sécurité", icon: Settings, component: makeContent("Sécurité") },
  { value: "documents", titleKey: "Documents", icon: FileText, component: makeContent("Documents") },
];

export const Default: Story = {};

export const WithIcons: Story = {
  args: { tabs: tabsWithIcons },
};

type SampleItem = { profil: number; securite: number };

const tabsWithCount: TabConfig<SampleItem>[] = [
  { value: "profil", titleKey: "Profil", icon: Users, component: makeContent("Profil"), count: x => x?.profil ?? 0 },
  { value: "securite", titleKey: "Sécurité", icon: Settings, component: makeContent("Sécurité"), count: x => x?.securite ?? 0 },
  { value: "notifications", titleKey: "Notifications", icon: FileText, component: makeContent("Notifications") },
];

export const WithCount: Story = {
  args: {
    tabs: tabsWithCount,
    item: { profil: 3, securite: 7 },
  },
};

export const WithCountNoItem: Story = {
  args: {
    tabs: tabsWithCount,
  },
};

const tabsWithCountAndMissing: TabConfig<SampleItem>[] = [
  { value: "profil", titleKey: "Profil", icon: Users, component: makeContent("Profil"), count: x => x?.profil ?? 0 },
  { value: "securite", titleKey: "Sécurité", icon: Settings, count: x => x?.securite ?? 0 },
  { value: "notifications", titleKey: "Notifications", icon: FileText },
];

export const WithCountAndMissingComponent: Story = {
  args: {
    tabs: tabsWithCountAndMissing,
    item: { profil: 3, securite: 7 },
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [...basicTabs.slice(0, 2), { ...basicTabs[2], disabled: true }],
  },
};

export const WithInProgressSections: Story = {
  args: {
    tabs: tabsWithMissing,
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { value: "profil", titleKey: "Profil", component: makeContent("Profil") },
      { value: "securite", titleKey: "Sécurité", component: makeContent("Sécurité") },
      { value: "notifications", titleKey: "Notifications", component: makeContent("Notifications") },
      { value: "facturation", titleKey: "Facturation" },
      { value: "integrations", titleKey: "Intégrations" },
      { value: "api", titleKey: "API & Webhooks", component: makeContent("API & Webhooks") },
      { value: "equipe", titleKey: "Équipe", component: makeContent("Équipe") },
      { value: "audit", titleKey: "Journal d'audit" },
    ],
  },
};
