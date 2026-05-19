import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { KrosoftTopbar, KrosoftTopbarProps } from "../../../../../src/components/core/navbar/topbar";
import { Sidebar } from "../../../../../src/components/core/navbar/sidebar";
import { Home, Settings, Users } from "lucide-react";

const meta: Meta<typeof KrosoftTopbar> = {
  title: "Core/Navbar/Topbar",
  component: KrosoftTopbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof KrosoftTopbar>;

// Un avatar factice pour simuler le menu utilisateur injecté depuis l'application
const FakeUserMenu = (): React.ReactElement => (
  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm cursor-pointer shadow-sm">
    GB
  </div>
);

// --- STORY 1 : STANDALONE ---
const InteractiveStandalone = (args: KrosoftTopbarProps): React.ReactElement => {
  const [theme, setTheme] = React.useState("light");
  const [collapsed, setCollapsed] = React.useState(args.collapsed);

  return (
    <div className={`flex h-screen w-full bg-background font-sans ${theme}`}>
      <KrosoftTopbar
        {...args}
        theme={theme}
        collapsed={collapsed}
        onToggleTheme={() => {
          setTheme(t => (t === "light" ? "dark" : "light"));
        }}
        onToggleSidebar={() => {
          setCollapsed(!collapsed);
        }}
        userMenuNode={<FakeUserMenu />}
      />

      {/* On simule la marge laissée vide par la sidebar inexistante */}
      <main className={`pt-24 px-8 w-full transition-all duration-300 ${collapsed ? "ml-[5.5rem]" : "ml-[16rem]"}`}>
        <div className="p-8 border border-border rounded-xl bg-card shadow-sm">
          <h1 className="text-3xl font-bold text-foreground mb-4">Topbar Isolée</h1>
          <p className="text-muted-foreground">Ceci est la topbar affichée toute seule, avec l&apos;état `collapsed` géré localement.</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Essayez de cliquer sur le menu Burger pour voir l&apos;animation de largeur.</li>
            <li>Essayez de basculer le thème (Soleil / Lune).</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export const Standalone: Story = {
  render: args => <InteractiveStandalone {...args} />,
  args: {
    collapsed: false,
    isMobile: false,
    hasNotifications: true,

    onSearchClick: () => {
      // noop
    },

    onNotificationsClick: () => {
      // noop
    },
  },
};

// --- STORY 2 : AVEC LA SIDEBAR ---
const sampleGroups = [
  {
    title: "Application",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: Home },
      { label: "Utilisateurs", path: "/users", icon: Users },
      { label: "Paramètres", path: "/settings", icon: Settings },
    ],
  },
];

const InteractiveWithSidebar = (args: KrosoftTopbarProps): React.ReactElement => {
  const [theme, setTheme] = React.useState("light");
  const [collapsed, setCollapsed] = React.useState(args.collapsed);
  const [currentPath, setCurrentPath] = React.useState("/dashboard");

  return (
    <div className={`flex h-screen w-full bg-background font-sans ${theme}`}>
      {/* La Sidebar */}
      <Sidebar
        groups={sampleGroups}
        collapsed={collapsed}
        mobileOpen={false}
        isMobile={false}
        onMobileClose={() => {}}
        onItemClick={path => {
          setCurrentPath(path);
        }}
        currentPath={currentPath}
        appName="Krosoft"
        appSubName="CRM"
      />

      {/* La Topbar */}
      <KrosoftTopbar
        {...args}
        theme={theme}
        collapsed={collapsed}
        onToggleTheme={() => {
          setTheme(t => (t === "light" ? "dark" : "light"));
        }}
        onToggleSidebar={() => {
          setCollapsed(!collapsed);
        }}
        userMenuNode={<FakeUserMenu />}
      />

      {/* Le contenu principal */}
      <main className="flex-1 pt-24 px-8 overflow-y-auto">
        <div className="p-8 border border-border rounded-xl bg-card shadow-sm">
          <h1 className="text-3xl font-bold text-foreground mb-4">Layout Complet</h1>
          <p className="text-muted-foreground text-lg mb-6">La Topbar et la Sidebar sont maintenant parfaitement synchronisées.</p>
          <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg border border-primary/20 inline-block font-medium">Route active : {currentPath}</div>
          <p className="mt-6 text-sm text-muted-foreground">
            Note: La Topbar étant en `fixed` et la Sidebar en statique (`flex-col`), le contenu principal prend naturellement l&apos;espace restant grâce à
            `flex-1`. La largeur de la Topbar s&apos;ajuste dynamiquement pour ne pas recouvrir la Sidebar.
          </p>
        </div>
      </main>
    </div>
  );
};

export const WithSidebar: Story = {
  render: args => <InteractiveWithSidebar {...args} />,
  args: {
    ...Standalone.args,
  },
};
