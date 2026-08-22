import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NotificationItem, NotificationsBell } from "../../../../src/components/core/navbar/NotificationsBell";

const DummyIcon = (): React.ReactElement => <svg data-testid="icon" />;

const items: NotificationItem[] = [
  { key: "n-1", title: "Colis expédié", description: "Vinted · Bordereau créé", date: "22/08/2026 10:12", icon: DummyIcon },
  { key: "n-2", title: "Colis à récupérer", description: "Tabac de la Gare", date: "21/08/2026 18:40", read: true },
];

const renderBell = (props: Partial<React.ComponentProps<typeof NotificationsBell>> = {}): ReturnType<typeof render> =>
  render(<NotificationsBell items={items} {...props} />);

afterEach(cleanup);

describe("NotificationsBell", () => {
  it("compte les entrées non lues sur la pastille", () => {
    renderBell();

    expect(screen.getByRole("button", { name: "Notifications (1)" })).toBeTruthy();
  });

  it("préfère le compteur fourni au décompte des entrées", () => {
    // Liste tronquée côté application : le total réel ne se déduit pas des entrées affichées.
    renderBell({ unreadCount: 12 });

    expect(screen.getByText("9+")).toBeTruthy();
  });

  it("n'affiche aucune pastille quand tout est lu", () => {
    renderBell({ items: items.map(item => ({ ...item, read: true })) });

    expect(screen.getByRole("button", { name: "Notifications" })).toBeTruthy();
    expect(screen.queryByText("1")).toBeNull();
  });

  it("remonte l'entrée choisie et referme le panneau", () => {
    const onSelect = vi.fn();
    renderBell({ onSelect });

    fireEvent.click(screen.getByRole("button", { name: "Notifications (1)" }));
    fireEvent.click(screen.getByText("Colis expédié"));

    expect(onSelect).toHaveBeenCalledWith(items[0]);
    expect(screen.queryByText("Colis à récupérer")).toBeNull();
  });

  it("ne propose « tout marquer comme lu » que s'il reste des non-lues et un callback", () => {
    const onMarkAllAsRead = vi.fn();
    renderBell({ onMarkAllAsRead });

    fireEvent.click(screen.getByRole("button", { name: "Notifications (1)" }));
    fireEvent.click(screen.getByText("Tout marquer comme lu"));

    expect(onMarkAllAsRead).toHaveBeenCalledOnce();
  });

  it("n'affiche la suppression que si un callback est fourni", () => {
    const onRemove = vi.fn();
    const { rerender } = renderBell({ open: true });

    expect(screen.queryAllByRole("button", { name: "Supprimer la notification" })).toHaveLength(0);

    rerender(<NotificationsBell items={items} open onRemove={onRemove} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Supprimer la notification" })[0]);

    expect(onRemove).toHaveBeenCalledWith(items[0]);
  });

  it("applique les classes d'entrée, la surcharge des non-lues remplaçant la mise en avant par défaut", () => {
    renderBell({ open: true, itemClassName: "px-6", unreadItemClassName: "bg-gold/5" });

    // Le panneau Radix est rendu dans un portail : on remonte depuis le texte, pas depuis le conteneur.
    const unread = screen.getByText("Colis expédié").closest("li");
    const read = screen.getByText("Colis à récupérer").closest("li");

    expect(unread?.className).toContain("bg-gold/5");
    expect(unread?.className).not.toContain("bg-accent/40");
    expect(unread?.className).toContain("px-6");
    // Entrée lue : pas de mise en avant, mais les classes communes s'appliquent.
    expect(read?.className).not.toContain("bg-gold/5");
    expect(read?.className).toContain("px-6");
  });

  it("affiche l'état vide et l'état de chargement", () => {
    const { rerender } = renderBell({ items: [], open: true });
    expect(screen.getByText("Aucune notification.")).toBeTruthy();

    rerender(<NotificationsBell items={items} open loading />);
    expect(screen.getByText("Chargement...")).toBeTruthy();
    expect(screen.queryByText("Colis expédié")).toBeNull();
  });
});
