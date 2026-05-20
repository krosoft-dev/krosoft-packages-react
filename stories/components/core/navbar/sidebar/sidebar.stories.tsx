import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Sidebar, SidebarProps } from "../../../../../src/components/core/navbar/sidebar";
import { Calendar, Home, Inbox, FileText, Settings, Users, LayoutDashboard } from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "Core/Navbar/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// 2 groupes de menus distincts comme demandé
const sampleGroups = [
  {
    title: "Application",
    items: [
      {
        label: "Home",
        path: "/home",
        icon: Home,
      },
      {
        label: "Inbox",
        path: "/inbox",
        icon: Inbox,
        badge: 3,
      },
      {
        label: "Calendar",
        path: "/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Utilisateurs",
        path: "/users",
        icon: Users,
      },
      {
        label: "Documents",
        path: "/documents",
        icon: FileText,
      },
      {
        label: "Paramètres",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

const InteractiveSidebar = (args: SidebarProps): React.ReactElement => {
  const [currentPath, setCurrentPath] = React.useState("/home");
  const [collapsed, setCollapsed] = React.useState(args.collapsed);

  // Permet de réagir si on change la prop "collapsed" depuis les contrôles Storybook
  React.useEffect(() => {
    setCollapsed(args.collapsed);
  }, [args.collapsed]);

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      <Sidebar
        {...args}
        currentPath={currentPath}
        collapsed={collapsed}
        onItemClick={path => {
          setCurrentPath(path);
        }}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contenu Principal</h1>
            <p className="text-muted-foreground mt-1">Exemple d&apos;intégration avec la KrosoftSidebar</p>
          </div>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            {collapsed ? "Ouvrir la Sidebar" : "Réduire la Sidebar"}
          </button>
        </div>

        <div className="p-8 border border-border rounded-xl bg-card shadow-sm">
          <p className="text-card-foreground text-lg">
            La route actuellement active est : <strong className="text-primary bg-primary/10 px-2 py-1 rounded">{currentPath}</strong>
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            Essayez de cliquer sur les différents liens du menu. Le composant Sidebar va automatiquement mettre à jour le style actif en fonction de la route
            sélectionnée, et gérer les tooltips si la barre est repliée.
          </p>
        </div>
      </main>
    </div>
  );
};

export const Default: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    groups: sampleGroups,
    appName: "Appname",
    appSubName: "Subname",
    collapsed: false,
    mobileOpen: false,
    isMobile: false,

    onMobileClose: () => {
      // noop
    },
  },
};

export const Collapsed: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    collapsed: true,
  },
};

const sampleGroupsWithSubItems = [
  {
    title: "Application",
    items: [
      {
        label: "Home",
        path: "/home",
        icon: Home,
      },
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        subItems: [
          { label: "Vue Générale", path: "/dashboard/overview" },
          { label: "Statistiques", path: "/dashboard/stats", badge: 3 },
          { label: "Rapports", path: "/dashboard/reports" },
        ]
      },
      {
        label: "Inbox",
        path: "/inbox",
        icon: Inbox,
        badge: 3,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Paramètres",
        icon: Settings,
        subItems: [
          { label: "Général", path: "/settings/general" },
          { label: "Sécurité", path: "/settings/security" },
        ]
      },
      {
        label: "Utilisateurs",
        path: "/users",
        icon: Users,
      },
    ],
  },
];

export const WithSubItems: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    groups: sampleGroupsWithSubItems,
  },
};
