import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Sidebar, SidebarProps } from "../../../../src/components/core/navbar/Sidebar";
import { SidebarHeader } from "../../../../src/components/core/navbar/SidebarHeader";
import { SidebarProvider } from "../../../../src/providers/SidebarProvider";
import { Calendar, Home, Inbox, FileText, Settings, Users, LayoutDashboard, LogOut, Zap, ChevronsUpDown, Building2, Check, Shield } from "lucide-react";
import { cn } from "../../../../src/helpers/tailwind.helper";

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

const InteractiveSidebar = ({ defaultCollapsed = false, ...args }: SidebarProps & { defaultCollapsed?: boolean }): React.ReactElement => {
  const [currentPath, setCurrentPath] = React.useState("/home");
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <div className="flex h-screen w-full bg-background font-sans">
        <Sidebar
          {...args}
          currentPath={currentPath}
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
    </SidebarProvider>
  );
};

export const Default: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    groups: sampleGroups,
    slots: {
      header: <SidebarHeader name="Appname" subName="Subname" icon={Shield} />,
    },
  },
};

export const Collapsed: Story = {
  render: args => <InteractiveSidebar {...args} defaultCollapsed />,
  args: {
    ...Default.args,
  },
};

export const Dense: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    dense: true,
    groups: [
      {
        items: [
          { label: "Dashboard", path: "/home", icon: LayoutDashboard },
          { label: "Achats", path: "/achats", icon: Inbox },
          { label: "Statistiques", path: "/stats", icon: Calendar },
          { label: "Importer", path: "/import", icon: FileText },
          { label: "Annonces", path: "/annonces", icon: Zap },
        ],
      },
    ],
    slots: {
      header: <SidebarHeader name="eva" subName="" icon={Building2} dense />,
      footer: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 text-sidebar-muted hover:text-sidebar-foreground cursor-pointer transition-colors duration-200 px-1 py-1.5 text-sm">
            <Inbox className="size-4 flex-shrink-0" />
            <span className="font-medium">Nouvel achat</span>
          </div>
          <div className="flex items-center gap-2.5 text-sidebar-muted hover:text-sidebar-foreground cursor-pointer transition-colors duration-200 px-1 py-1.5 text-sm">
            <LogOut className="size-4 flex-shrink-0" />
            <span className="font-medium">Déconnexion</span>
          </div>
        </div>
      ),
    },
  },
};

export const DenseWithGroups: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    dense: true,
    groups: sampleGroups,
    slots: {
      header: <SidebarHeader name="eva" subName="Espace de gestion" icon={Building2} dense />,
      footer: Dense.args?.slots?.footer,
    },
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
        ],
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
        ],
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

export const DenseWithSubItems: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    dense: true,
    groups: sampleGroupsWithSubItems,
    slots: {
      header: <SidebarHeader name="eva" subName="Espace de gestion" icon={Building2} dense />,
      footer: Dense.args?.slots?.footer,
    },
  },
};

export const WithFooter: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    slots: {
      ...Default.args?.slots,
      footer: (
        <div
          className="flex items-center gap-3 text-sidebar-muted hover:text-sidebar-foreground cursor-pointer transition-colors duration-200"
          title="Déconnexion"
        >
          <LogOut className="size-5 flex-shrink-0" />
          <span className="font-medium whitespace-nowrap overflow-hidden">Déconnexion</span>
        </div>
      ),
    },
  },
};

export const Searchable: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    search: { enabled: true, placeholder: "Rechercher une page..." },
  },
};

export const Loading: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithCustomIcon: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    slots: {
      header: <SidebarHeader name="Krosoft Energy" subName="Gestion réseau" icon={Zap} />,
    },
  },
};

export const WithCustomHeader: Story = {
  render: args => <InteractiveSidebar {...args} />,
  args: {
    ...Default.args,
    slots: {
      header: (
        <div className="flex items-center justify-center h-16 md:h-20 bg-primary/10 border-b border-sidebar-border mx-4 rounded-xl mt-4 mb-2">
          <span className="font-bold text-primary tracking-widest uppercase">Custom Header</span>
        </div>
      ),
    },
  },
};

const instances = [
  { id: "1", name: "Krosoft Corp.", subName: "Instance de production" },
  { id: "2", name: "Acme Inc.", subName: "Instance de test" },
  { id: "3", name: "Stark Industries", subName: "Instance de développement" },
];

const InteractiveSidebarWithSelector = ({ defaultCollapsed = false, ...args }: SidebarProps & { defaultCollapsed?: boolean }): React.ReactElement => {
  const [currentPath, setCurrentPath] = React.useState("/home");
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [selectedInstance, setSelectedInstance] = React.useState(instances[0]);

  const InstanceSelector = (
    <div className={cn("relative flex items-center h-16 md:h-20", collapsed ? "justify-center px-0" : "px-4")}>
      <button
        onClick={() => {
          setIsSelectorOpen(!isSelectorOpen);
        }}
        className={cn(
          "flex items-center w-full gap-3 rounded-xl hover:bg-sidebar-accent transition-colors duration-200 group text-left",
          collapsed ? "p-2 justify-center" : "p-2 px-3",
          isSelectorOpen && "bg-sidebar-accent",
        )}
      >
        <div className="flex-shrink-0 bg-primary/20 text-sidebar-primary w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          <Building2 className="size-4" />
        </div>
        {!collapsed && (
          <>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">{selectedInstance.name}</span>
              <span className="text-[11px] text-sidebar-muted truncate">{selectedInstance.subName}</span>
            </div>
            <ChevronsUpDown className="size-4 text-sidebar-muted group-hover:text-sidebar-foreground transition-colors flex-shrink-0" />
          </>
        )}
      </button>

      {/* Popover/Dropdown Menu */}
      {isSelectorOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsSelectorOpen(false);
            }}
          />
          <div
            className={cn(
              "absolute z-50 top-16 md:top-20 bg-card border border-border rounded-xl shadow-lg py-2 min-w-[240px] flex flex-col gap-1",
              collapsed ? "left-full ml-2" : "left-4 right-4",
            )}
          >
            {instances.map(instance => (
              <button
                key={instance.id}
                onClick={() => {
                  setSelectedInstance(instance);
                  setIsSelectorOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 mx-2 hover:bg-accent rounded-lg transition-colors text-left group"
              >
                <div className="flex-shrink-0 bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{instance.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{instance.subName}</span>
                </div>
                {selectedInstance.id === instance.id && <Check className="size-4 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <div className="flex h-screen w-full bg-background font-sans">
        <Sidebar
          {...args}
          currentPath={currentPath}
          slots={{ header: InstanceSelector }}
          onItemClick={path => {
            setCurrentPath(path);
          }}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sélecteur d&apos;instance</h1>
              <p className="text-muted-foreground mt-1">Exemple d&apos;un header personnalisé avec un sélecteur d&apos;organisation.</p>
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export const WithInstanceSelector: Story = {
  render: args => <InteractiveSidebarWithSelector {...args} />,
  args: {
    ...Default.args,
  },
};
