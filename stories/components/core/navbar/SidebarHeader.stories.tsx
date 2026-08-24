import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { SidebarHeader, SidebarHeaderProps } from "../../../../src/components/core/navbar/SidebarHeader";
import { SidebarProvider } from "../../../../src/providers/SidebarProvider";
import { Building2, Shield, Zap } from "lucide-react";

const meta: Meta<typeof SidebarHeader> = {
  title: "Core/Navbar/SidebarHeader",
  component: SidebarHeader,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SidebarHeader>;

// SidebarHeader lit collapsed/isMobile depuis le contexte : on l'enveloppe dans un
// SidebarProvider et un conteneur aux couleurs de la sidebar pour le rendu réel.
const PreviewHeader = ({ collapsed = false, ...args }: SidebarHeaderProps & { collapsed?: boolean }): React.ReactElement => (
  <SidebarProvider collapsed={collapsed} onCollapsedChange={() => undefined}>
    <div className={`bg-sidebar text-sidebar-foreground rounded-xl ${collapsed ? "w-20" : "w-64"}`}>
      <SidebarHeader {...args} />
    </div>
  </SidebarProvider>
);

export const Default: Story = {
  render: args => <PreviewHeader {...args} />,
  args: {
    name: "Appname",
    subName: "Subname",
    icon: Shield,
  },
};

export const Dense: Story = {
  render: args => <PreviewHeader {...args} />,
  args: {
    name: "eva",
    subName: "Espace de gestion",
    icon: Building2,
    dense: true,
  },
};

export const Collapsed: Story = {
  render: args => <PreviewHeader {...args} collapsed />,
  args: {
    name: "Appname",
    subName: "Subname",
    icon: Shield,
  },
};

export const WithoutIcon: Story = {
  render: args => <PreviewHeader {...args} />,
  args: {
    name: "Krosoft Energy",
    subName: "Gestion réseau",
  },
};

export const WithoutSubName: Story = {
  render: args => <PreviewHeader {...args} />,
  args: {
    name: "Krosoft",
    subName: "",
    icon: Zap,
  },
};
