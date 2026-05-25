import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { FileText, Settings, Users } from "lucide-react";
import { AppTabs } from "@/components/core/tabs/AppTabs";
import type { AppTab } from "@/components/core/tabs/AppTabs";

const withRouter = (Story: React.ComponentType) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const makeContent = (label: string) => (_id: string) => (
  <div className="p-4 rounded-lg border bg-muted/30 text-sm text-muted-foreground">
    Contenu de l'onglet <strong>{label}</strong>
  </div>
);

const basicTabs: AppTab[] = [
  { value: "informations", titleKey: "Informations", component: makeContent("Informations") },
  { value: "contacts", titleKey: "Contacts", component: makeContent("Contacts") },
  { value: "documents", titleKey: "Documents", component: makeContent("Documents") },
];

const tabsWithIcons: AppTab[] = [
  { value: "informations", titleKey: "Informations", icon: FileText, component: makeContent("Informations") },
  { value: "equipe", titleKey: "Équipe", icon: Users, component: makeContent("Équipe") },
  { value: "parametres", titleKey: "Paramètres", icon: Settings, component: makeContent("Paramètres") },
];

type SampleItem = { contacts: number; documents: number };

const tabsWithCount: AppTab<SampleItem>[] = [
  {
    value: "contacts",
    titleKey: "Contacts",
    icon: Users,
    component: makeContent("Contacts"),
    count: (item) => item?.contacts ?? 0,
  },
  {
    value: "documents",
    titleKey: "Documents",
    icon: FileText,
    component: makeContent("Documents"),
    count: (item) => item?.documents ?? 0,
  },
  {
    value: "parametres",
    titleKey: "Paramètres",
    icon: Settings,
    component: makeContent("Paramètres"),
  },
];

const meta: Meta<typeof AppTabs> = {
  title: "Core/Tabs/AppTabs",
  component: AppTabs,
  decorators: [withRouter],
  args: {
    tabs: basicTabs,
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AppTabs>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
  },
};

export const WithCount: Story = {
  args: {
    tabs: tabsWithCount,
    item: { contacts: 12, documents: 4 },
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      ...basicTabs.slice(0, 2),
      { ...basicTabs[2], disabled: true },
    ],
  },
};

export const FitWidth: Story = {
  args: {
    tabs: tabsWithIcons,
    fit: true,
  },
};
