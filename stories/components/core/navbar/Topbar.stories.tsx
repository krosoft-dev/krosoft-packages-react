import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Topbar, TopbarProps } from "../../../../src/components/core/navbar/Topbar";
import { Sidebar } from "../../../../src/components/core/navbar/Sidebar";
import { SidebarHeader } from "../../../../src/components/core/navbar/SidebarHeader";
import { SidebarProvider } from "../../../../src/providers/SidebarProvider";
import { Home, Settings, Users, SearchIcon, SunIcon, MoonIcon, BellIcon, Shield } from "lucide-react";
import { Button } from "../../../../src/components/ui/button";

type TopbarStoryProps = TopbarProps & { collapsed?: boolean };

const meta: Meta<TopbarStoryProps> = {
  title: "Core/Navbar/Topbar",
  component: Topbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<TopbarStoryProps>;

// Un avatar factice pour simuler le menu utilisateur injecté depuis l'application
const FakeUserMenu = (): React.ReactElement => (
  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer shadow-sm">
    GB
  </div>
);

const FakeActions = ({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }): React.ReactElement => (
  <>
    <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
      <SearchIcon className="size-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {theme === "dark" ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
    </Button>
    <Button size="icon" variant="ghost" className="relative text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
      <BellIcon className="size-4" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
    </Button>
  </>
);

// --- STORY 1 : STANDALONE ---
const InteractiveStandalone = (args: TopbarProps & { collapsed?: boolean }): React.ReactElement => {
  const [theme, setTheme] = React.useState("light");
  const [collapsed, setCollapsed] = React.useState(args.collapsed ?? false);

  React.useEffect(() => {
    setCollapsed(args.collapsed ?? false);
  }, [args.collapsed]);

  return (
    <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <div className={`flex h-screen w-full bg-background font-sans ${theme}`}>
        <Topbar actionsNode={<FakeActions theme={theme} setTheme={setTheme} />} userMenuNode={<FakeUserMenu />} />
      </div>
    </SidebarProvider>
  );
};

export const Standalone: Story = {
  render: args => <InteractiveStandalone {...args} />,
  args: {
    collapsed: false,
  },
};

// --- STORY 2 : AVEC LA SIDEBAR ---
const sampleGroups = [
  {
    title: "Application",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: Home },
      { label: "Utilisateurs", path: "/users", icon: Users },
      {
        label: "Paramètres",
        path: "/settings",
        icon: Settings,
        subItems: [
          { label: "Vue Générale", path: "/settings/overview" },
          { label: "Statistiques", path: "/settings/stats", badge: 3 },
          { label: "Rapports", path: "/settings/reports" },
        ],
      },
    ],
  },
];

const InteractiveWithSidebar = (args: TopbarProps & { collapsed?: boolean }): React.ReactElement => {
  const [theme, setTheme] = React.useState("light");
  const [collapsed, setCollapsed] = React.useState(args.collapsed ?? false);
  const [currentPath, setCurrentPath] = React.useState("/dashboard");

  React.useEffect(() => {
    setCollapsed(args.collapsed ?? false);
  }, [args.collapsed]);

  return (
    <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <div className={`flex h-screen w-full bg-background font-sans ${theme}`}>
        {/* La Sidebar */}
        <Sidebar
          groups={sampleGroups}
          onItemClick={path => {
            setCurrentPath(path);
          }}
          currentPath={currentPath}
          slots={{ header: <SidebarHeader name="Krosoft" subName="CRM" icon={Shield} /> }}
        />

        {/* La Topbar */}
        <Topbar
          {...args}
          collapsed={collapsed}
          onToggleSidebar={() => {
            setCollapsed(!collapsed);
          }}
          actionsNode={<FakeActions theme={theme} setTheme={setTheme} />}
          userMenuNode={<FakeUserMenu />}
        />

        {/* Le contenu principal */}
        <main className="flex-1 pt-24 px-8 overflow-y-auto">
          <div className="p-8 border border-border rounded-xl bg-card shadow-sm">
            <h1 className="text-3xl font-bold text-foreground mb-4">Layout Complet</h1>
            <p className="text-muted-foreground text-lg mb-6">La Topbar et la Sidebar sont maintenant parfaitement synchronisées.</p>
            <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg border border-primary/20 inline-block font-medium">
              Route active : {currentPath}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Note: La Topbar étant en `fixed` et la Sidebar en statique (`flex-col`), le contenu principal prend naturellement l&apos;espace restant grâce à
              `flex-1`. La largeur de la Topbar s&apos;ajuste dynamiquement pour ne pas recouvrir la Sidebar.
            </p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export const WithSidebar: Story = {
  render: args => <InteractiveWithSidebar {...args} />,
  args: {
    ...Standalone.args,
  },
};
