import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, LayoutDashboard, Moon, Settings, Shield, Sun, Users, Plus } from "lucide-react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { AppLayout } from "@/components/core/layouts/AppLayout";
import { Button } from "@/components/ui/button";

const withRouter = (Story: React.ComponentType) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const sampleGroups = [
  {
    title: "Général",
    items: [
      { label: "Tableau de bord", path: "/dashboard", icon: LayoutDashboard },
      { label: "Utilisateurs", path: "/users", icon: Users },
    ],
  },
  {
    title: "Configuration",
    items: [
      { label: "Paramètres", path: "/settings", icon: Settings },
    ],
  },
];

const FakeUserMenu = (): React.ReactElement => (
  <div className="flex items-center gap-2 border-l pl-4">
    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary text-sm">JD</div>
    <div className="hidden md:flex flex-col text-left">
      <span className="text-xs font-semibold text-foreground leading-none">John Doe</span>
      <span className="text-[10px] text-muted-foreground">Administrateur</span>
    </div>
  </div>
);

const FakeActions = (): React.ReactElement => {
  const [isDark, setIsDark] = React.useState(false);
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => {
          setIsDark(!isDark);
          const root = window.document.documentElement;
          if (isDark) {
            root.classList.remove("dark");
          } else {
            root.classList.add("dark");
          }
        }}
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
    </div>
  );
};

const meta: Meta<typeof AppLayout> = {
  title: "Core/Layouts/AppLayout",
  component: AppLayout,
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    groups: sampleGroups,
    appName: "Krosoft",
    appSubName: "CRM",
    appIcon: Shield,
    appTitle: "Krosoft CRM",
  },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const InteractiveAppLayout = (args: any) => {
  const [currentPath, setCurrentPath] = React.useState("/dashboard");

  const getPageConfig = (path: string) => {
    switch (path) {
      case "/dashboard":
        return {
          titleKey: "Tableau de bord",
          descriptionKey: "Vue d'ensemble de vos statistiques et activités récentes.",
          icon: LayoutDashboard,
        };
      case "/users":
        return {
          titleKey: "Utilisateurs",
          descriptionKey: "Gérez les utilisateurs de votre application et leurs rôles.",
          icon: Users,
        };
      case "/settings":
        return {
          titleKey: "Paramètres",
          descriptionKey: "Configurez les options globales du système.",
          icon: Settings,
        };
      default:
        return {
          titleKey: "Page Inconnue",
          descriptionKey: "",
          icon: undefined,
        };
    }
  };

  const pageConfig = getPageConfig(currentPath);

  return (
    <AppLayout
      {...args}
      currentPath={currentPath}
      onItemClick={setCurrentPath}
      titleKey={pageConfig.titleKey}
      descriptionKey={pageConfig.descriptionKey}
      icon={pageConfig.icon}
      actionsNode={<FakeActions />}
      userMenuNode={<FakeUserMenu />}
    >
      <div className="p-6 border border-border rounded-xl bg-card shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-foreground">Contenu de l'onglet {pageConfig.titleKey}</h2>
        <p className="text-muted-foreground text-sm">
          Ceci est un exemple d'intégration de contenu pour la route : <code className="bg-muted px-1.5 py-0.5 rounded text-primary">{currentPath}</code>.
        </p>
        <div className="h-64 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground bg-muted/20">
          Zone de contenu principale
        </div>
      </div>
    </AppLayout>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveAppLayout {...args} />,
};
