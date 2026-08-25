import { LanguageSelector } from "@/components/core/language/LanguageSelector";
import { NotificationItem, NotificationsBell } from "@/components/core/navbar/NotificationsBell";
import { ThemeSelector } from "@/components/core/theme/ThemeSelector";
import { Button } from "@/components/ui";
import { ToastProvider } from "@/components/ui/toast";
import { registerKrosoftLocales } from "@/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import i18next from "i18next";
import { PackageIcon, SearchIcon, UserPlusIcon } from "lucide-react";
import { ThemeProvider } from "next-themes";
import * as React from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { DEMO_LANGUAGE_OPTIONS } from "../constants/languages";
import { DEMO_THEME_OPTIONS } from "../constants/themes";

// Instance i18n dédiée : changer de langue dans la démo ne touche pas le reste du Storybook.
const demoI18n = i18next.createInstance();
void demoI18n.use(initReactI18next).init({ lng: "fr", fallbackLng: "fr", resources: {}, interpolation: { escapeValue: false } });
registerKrosoftLocales(demoI18n);

const withProviders = (Story: React.ComponentType): React.JSX.Element => (
  <I18nextProvider i18n={demoI18n}>
    <ThemeProvider attribute="class" defaultTheme="system" themes={DEMO_THEME_OPTIONS.map(o => o.value)} enableSystem>
      <ToastProvider>
        <Story />
      </ToastProvider>
    </ThemeProvider>
  </I18nextProvider>
);

const NOTIFICATIONS: NotificationItem[] = [
  {
    key: "n-1",
    title: "Colis à récupérer",
    description: "Vinted · Tabac de la Gare",
    date: "Aujourd'hui à 10:12",
    icon: PackageIcon,
    iconClassName: "bg-emerald-500/10 text-emerald-500",
  },
  {
    key: "n-2",
    title: "Nouveau compte à valider",
    description: "camille@exemple.fr",
    date: "Lundi à 09:03",
    read: true,
    icon: UserPlusIcon,
    iconClassName: "bg-blue-500/10 text-blue-500",
  },
];

/** En-tête applicatif : les mêmes contrôles que dans une vraie app (recherche, langue, thème, notifications). */
const AppHeaderBar = (): React.JSX.Element => {
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);

  return (
    <header className="flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">Mon application</span>
      <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
        <Button variant="ghost" size="icon" aria-label="Rechercher">
          <SearchIcon className="size-4" />
        </Button>
        <LanguageSelector languageOptions={DEMO_LANGUAGE_OPTIONS} variant="mini" />
        <ThemeSelector themeOptions={DEMO_THEME_OPTIONS} variant="mini" />
        <NotificationsBell
          items={notifications}
          onSelect={item => {
            setNotifications(prev => prev.map(n => (n.key === item.key ? { ...n, read: true } : n)));
          }}
          onMarkAllAsRead={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          }}
          onRemove={item => {
            setNotifications(prev => prev.filter(n => n.key !== item.key));
          }}
        />
        <span className="flex size-9 items-center justify-center rounded-control bg-primary text-sm font-semibold text-primary-foreground">K</span>
      </div>
    </header>
  );
};

const meta: Meta = {
  title: "Démos/Header",
  decorators: [withProviders],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Reproduit une barre d'en-tête réelle. ",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-[520px] flex-col bg-background">
      <AppHeaderBar />
    </div>
  ),
};
