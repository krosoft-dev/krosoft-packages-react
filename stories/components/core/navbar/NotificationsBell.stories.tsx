import type { Meta, StoryObj } from "@storybook/react-vite";
import { PackageIcon, UserPlusIcon } from "lucide-react";
import * as React from "react";
import { NotificationItem, NotificationsBell } from "../../../../src/components/core/navbar/NotificationsBell";

const meta: Meta<typeof NotificationsBell> = {
  title: "Core/Navbar/NotificationsBell",
  component: NotificationsBell,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof NotificationsBell>;

const items: NotificationItem[] = [
  { key: "n-1", title: "Colis à récupérer", description: "Vinted · Tabac de la Gare, 12 rue des Lilas", date: "Aujourd'hui à 10:12", path: "/achats/42" },
  { key: "n-2", title: "Colis expédié", description: "Leboncoin · Bordereau créé", date: "Hier à 18:40", path: "/achats/41" },
  { key: "n-3", title: "Nouveau compte à valider", description: "camille@exemple.fr", date: "Lundi à 09:03", read: true, path: "/administration" },
];

/** Une pastille par nature d'événement : le fond et la couleur du glyphe viennent de l'application. */
const withIcons: NotificationItem[] = [
  { ...items[0], icon: PackageIcon, iconClassName: "bg-emerald-500/10 text-emerald-500" },
  { ...items[1], icon: PackageIcon, iconClassName: "bg-amber-500/10 text-amber-500" },
  { ...items[2], icon: UserPlusIcon, iconClassName: "bg-blue-500/10 text-blue-500" },
];

export const Default: Story = {
  args: { items },
};

/** Ouvert d'emblée : c'est l'état qu'on veut voir en atelier. */
export const Open: Story = {
  args: { items, open: true },
};

export const WithIcons: Story = {
  args: { items: withIcons, open: true },
};

export const Empty: Story = {
  args: { items: [], open: true },
};

export const Loading: Story = {
  args: { items: [], open: true, loading: true },
};

/**
 * Liste tronquée côté application : le total réel ne se déduit pas des entrées affichées,
 * d'où `unreadCount`. Au-delà de `maxBadgeCount`, la pastille affiche « 9+ ».
 */
export const TruncatedList: Story = {
  args: { items, unreadCount: 24 },
};

/** La pastille suit la charte du projet quand `bg-primary` ne convient pas. */
export const CustomBadge: Story = {
  args: { items, badgeClassName: "bg-amber-500 text-amber-950" },
};

/** Les entrées suivent aussi la charte : `unreadItemClassName` remplace la mise en avant par défaut. */
export const CustomItems: Story = {
  args: {
    items: withIcons,
    open: true,
    badgeClassName: "bg-amber-500 text-amber-950",
    unreadItemClassName: "bg-amber-500/10",
  },
};

/**
 * Cas réel : la liste vit dans l'application, le composant n'affiche que ce qu'on lui donne.
 * Le clic marque comme lu, « tout marquer comme lu » vide le compteur, la corbeille retire l'entrée.
 */
const Interactive = (): React.ReactElement => {
  const [current, setCurrent] = React.useState(withIcons);

  return (
    <NotificationsBell
      items={current}
      onSelect={item => {
        setCurrent(previous => previous.map(entry => (entry.key === item.key ? { ...entry, read: true } : entry)));
      }}
      onMarkAllAsRead={() => {
        setCurrent(previous => previous.map(entry => ({ ...entry, read: true })));
      }}
      onRemove={item => {
        setCurrent(previous => previous.filter(entry => entry.key !== item.key));
      }}
    />
  );
};

export const Playground: Story = {
  render: () => <Interactive />,
};
