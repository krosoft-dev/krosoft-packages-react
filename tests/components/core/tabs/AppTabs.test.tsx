import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppTabs } from "../../../../src/components/core/tabs/AppTabs";
import type { AppTabsProps } from "../../../../src/components/core/tabs/AppTabs";
import type { TabConfig } from "../../../../src/types/TabConfig";

const tabs: TabConfig[] = [
  { value: "users", titleKey: "Utilisateurs", component: () => <div>contenu utilisateurs</div> },
  { value: "roles", titleKey: "Rôles", component: () => <div>contenu rôles</div> },
];

// Expose la query string courante pour vérifier ce que AppTabs écrit dans l'URL.
const LocationSpy: React.FC = () => {
  const location = useLocation();
  return <div data-testid="search">{location.search}</div>;
};

const renderTabs = (initialUrl: string, props?: Partial<AppTabsProps>): ReturnType<typeof render> =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <AppTabs tabs={tabs} {...props} />
      <LocationSpy />
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  // scrollIntoView n'existe pas dans jsdom : le supprimer rend son absence aux autres tests.
  Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

describe("AppTabs", () => {
  it("affiche le premier onglet quand l'URL ne précise rien", () => {
    renderTabs("/");

    expect(screen.getByText("contenu utilisateurs")).toBeTruthy();
  });

  it("affiche l'onglet demandé par l'URL", () => {
    renderTabs("/?tab=roles");

    expect(screen.getByText("contenu rôles")).toBeTruthy();
  });

  it("retombe sur le premier onglet quand l'onglet de l'URL n'existe pas", () => {
    renderTabs("/?tab=inexistant");

    expect(screen.getByText("contenu utilisateurs")).toBeTruthy();
  });

  it("lit l'onglet depuis un paramètre d'URL personnalisé", () => {
    renderTabs("/?subtab=roles", { paramName: "subtab" });

    expect(screen.getByText("contenu rôles")).toBeTruthy();
  });

  it("préserve les autres query params au changement d'onglet", () => {
    renderTabs("/?keep=1&tab=users");

    // En mode d'activation automatique, Radix change d'onglet sur le focus du trigger
    // (le "click" synthétique de jsdom n'émet ni mousedown ni focus).
    fireEvent.focus(screen.getByRole("tab", { name: "Rôles" }));

    const search = new URLSearchParams(screen.getByTestId("search").textContent ?? "");
    expect(search.get("keep")).toBe("1");
    expect(search.get("tab")).toBe("roles");
  });

  it("n'écrit que sur son propre paramètre en cas d'imbrication", () => {
    // Un AppTabs parent porte ?tab=... ; le niveau imbriqué configuré sur "subtab" ne doit
    // toucher que subtab et laisser tab intact.
    renderTabs("/?tab=parent&subtab=users", { paramName: "subtab" });

    // En mode d'activation automatique, Radix change d'onglet sur le focus du trigger
    // (le "click" synthétique de jsdom n'émet ni mousedown ni focus).
    fireEvent.focus(screen.getByRole("tab", { name: "Rôles" }));

    const search = new URLSearchParams(screen.getByTestId("search").textContent ?? "");
    expect(search.get("tab")).toBe("parent");
    expect(search.get("subtab")).toBe("roles");
  });

  it("ramène l'onglet actif dans la zone visible de la liste", () => {
    // La liste défile horizontalement : un onglet actif hors écran doit être recentré.
    // jsdom n'implémente pas scrollIntoView, on l'observe via un stub.
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    renderTabs("/?tab=roles");

    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("tab", { name: "Rôles" }));
  });
});
