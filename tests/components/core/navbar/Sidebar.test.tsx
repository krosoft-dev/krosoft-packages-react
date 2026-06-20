import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { Sidebar, SidebarGroup } from "../../../../src/components/core/navbar/Sidebar";
import { SidebarProvider } from "../../../../src/providers/SidebarProvider";

const DummyIcon = (): React.ReactElement => <svg data-testid="icon" />;

const groups: SidebarGroup[] = [
  {
    title: "Application",
    items: [
      { label: "Accueil", path: "/home", icon: DummyIcon },
      { label: "Messages", path: "/inbox", icon: DummyIcon },
    ],
  },
  {
    title: "Administration",
    items: [{ label: "Utilisateurs", path: "/users", icon: DummyIcon }],
  },
];

const renderSidebar = (props: Partial<React.ComponentProps<typeof Sidebar>> = {}): ReturnType<typeof render> =>
  render(
    <SidebarProvider>
      <Sidebar groups={groups} currentPath="/home" onItemClick={vi.fn()} {...props} />
    </SidebarProvider>,
  );

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  cleanup();
});

describe("Sidebar", () => {
  it("affiche les items des groupes", () => {
    renderSidebar();

    expect(screen.queryByText("Accueil")).not.toBeNull();
    expect(screen.queryByText("Messages")).not.toBeNull();
    expect(screen.queryByText("Utilisateurs")).not.toBeNull();
  });

  it("filtre les items quand searchable est actif", () => {
    renderSidebar({ searchable: true });

    const input = screen.getByPlaceholderText("Rechercher...");
    fireEvent.change(input, { target: { value: "mess" } });

    expect(screen.queryByText("Messages")).not.toBeNull();
    expect(screen.queryByText("Accueil")).toBeNull();
    expect(screen.queryByText("Utilisateurs")).toBeNull();
  });

  it("masque les groupes vides après filtrage", () => {
    renderSidebar({ searchable: true });

    const input = screen.getByPlaceholderText("Rechercher...");
    fireEvent.change(input, { target: { value: "utilisat" } });

    // Le titre du groupe "Application" ne doit plus apparaître puisqu'aucun item ne matche.
    expect(screen.queryByText("Application")).toBeNull();
    expect(screen.queryByText("Administration")).not.toBeNull();
  });

  it("affiche des skeletons quand loading est actif", () => {
    const { container } = renderSidebar({ loading: true });

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    // Les items réels ne sont pas rendus pendant le chargement.
    expect(screen.queryByText("Accueil")).toBeNull();
  });
});
