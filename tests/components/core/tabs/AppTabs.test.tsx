import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppTabs } from "../../../../src/components/core/tabs/AppTabs";
import type { TabConfig } from "../../../../src/types/TabConfig";

const tabs: TabConfig[] = [
  { value: "users", titleKey: "Utilisateurs", component: () => <div>contenu utilisateurs</div> },
  { value: "roles", titleKey: "Rôles", component: () => <div>contenu rôles</div> },
];

const renderTabs = (initialUrl: string): ReturnType<typeof render> =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <AppTabs tabs={tabs} />
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

  it("ramène l'onglet actif dans la zone visible de la liste", () => {
    // La liste défile horizontalement : un onglet actif hors écran doit être recentré.
    // jsdom n'implémente pas scrollIntoView, on l'observe via un stub.
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    renderTabs("/?tab=roles");

    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("tab", { name: "Rôles" }));
  });
});
