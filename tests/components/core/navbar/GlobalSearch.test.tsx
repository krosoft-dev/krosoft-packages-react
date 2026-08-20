import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { GlobalSearch, GlobalSearchGroup } from "../../../../src/components/core/navbar/GlobalSearch";

const DummyIcon = (): React.ReactElement => <svg data-testid="icon" />;

const groups: GlobalSearchGroup[] = [
  {
    heading: "Pages",
    items: [
      { key: "page-home", label: "Accueil", path: "/", icon: DummyIcon },
      { key: "page-clients", label: "Clients", description: "Commerce", path: "/clients", icon: DummyIcon },
    ],
  },
  {
    heading: "Documents",
    items: [{ key: "doc-1", label: "Facture 2024-018", path: "/factures/18" }],
  },
];

const renderGlobalSearch = (props: Partial<React.ComponentProps<typeof GlobalSearch>> = {}): ReturnType<typeof render> =>
  render(<GlobalSearch groups={groups} search="" onSearch={vi.fn()} onSelect={vi.fn()} {...props} />);

beforeAll(() => {
  // cmdk observe la taille de sa liste, jsdom n'implémente ni ResizeObserver ni scrollIntoView.
  window.ResizeObserver = class {
    observe(): void {
      return undefined;
    }
    unobserve(): void {
      return undefined;
    }
    disconnect(): void {
      return undefined;
    }
  };
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe("GlobalSearch", () => {
  it("n'affiche que le bouton déclencheur tant que la palette est fermée", () => {
    renderGlobalSearch();

    expect(screen.queryByRole("button", { name: "Rechercher" })).not.toBeNull();
    expect(screen.queryByText("Accueil")).toBeNull();
  });

  it("ouvre la palette au clic sur le déclencheur et affiche les groupes", () => {
    renderGlobalSearch();

    fireEvent.click(screen.getByRole("button", { name: "Rechercher" }));

    expect(screen.queryByText("Pages")).not.toBeNull();
    expect(screen.queryByText("Documents")).not.toBeNull();
    expect(screen.queryByText("Accueil")).not.toBeNull();
    expect(screen.queryByText("Commerce")).not.toBeNull();
    expect(screen.queryByText("Facture 2024-018")).not.toBeNull();
  });

  it("ouvre et ferme la palette avec Ctrl+K", () => {
    renderGlobalSearch();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.queryByText("Accueil")).not.toBeNull();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.queryByText("Accueil")).toBeNull();
  });

  it("ignore le raccourci quand shortcut est désactivé", () => {
    renderGlobalSearch({ shortcut: false });

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(screen.queryByText("Accueil")).toBeNull();
  });

  it("remonte la saisie via onSearch", () => {
    const onSearch = vi.fn();
    renderGlobalSearch({ onSearch });

    fireEvent.click(screen.getByRole("button", { name: "Rechercher" }));
    fireEvent.change(screen.getByPlaceholderText("Rechercher..."), { target: { value: "fact" } });

    expect(onSearch).toHaveBeenCalledWith("fact");
  });

  it("remonte l'item sélectionné, vide la recherche et ferme la palette", () => {
    const onSelect = vi.fn();
    const onSearch = vi.fn();
    renderGlobalSearch({ onSelect, onSearch });

    fireEvent.click(screen.getByRole("button", { name: "Rechercher" }));
    fireEvent.click(screen.getByText("Facture 2024-018"));

    expect(onSelect).toHaveBeenCalledWith(groups[1].items[0]);
    expect(onSearch).toHaveBeenCalledWith("");
    expect(screen.queryByText("Accueil")).toBeNull();
  });

  it("affiche l'état de chargement et masque l'état vide", () => {
    renderGlobalSearch({ groups: [], loading: true, open: true });

    expect(screen.queryByText("Recherche...")).not.toBeNull();
    expect(screen.queryByText("Aucun résultat.")).toBeNull();
  });

  it("affiche l'état vide quand aucun groupe n'a de résultat", () => {
    renderGlobalSearch({ groups: [{ heading: "Pages", items: [] }], open: true });

    expect(screen.queryByText("Aucun résultat.")).not.toBeNull();
    // Un groupe sans item ne rend pas son intitulé.
    expect(screen.queryByText("Pages")).toBeNull();
  });

  it("n'affiche pas de déclencheur en mode contrôlé sans trigger", () => {
    const onOpenChange = vi.fn();
    renderGlobalSearch({ trigger: false, open: true, onOpenChange });

    expect(screen.queryByRole("button", { name: "Rechercher" })).toBeNull();
    expect(screen.queryByText("Accueil")).not.toBeNull();
  });

  it("prévient le parent de l'ouverture demandée par le raccourci en mode contrôlé", () => {
    const onOpenChange = vi.fn();
    renderGlobalSearch({ trigger: false, open: false, onOpenChange });

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    // L'état reste piloté par le parent : rien ne s'ouvre tant que `open` ne change pas.
    expect(screen.queryByText("Accueil")).toBeNull();
  });

  it("applique les classes de pastille fournies par l'item", () => {
    renderGlobalSearch({
      open: true,
      groups: [
        { heading: "Pages", items: [{ key: "page-home", label: "Accueil", path: "/", icon: DummyIcon, iconClassName: "bg-blue-500/10 text-blue-500" }] },
      ],
    });

    const tile = screen.getByTestId("icon").parentElement;

    expect(tile?.className).toContain("bg-blue-500/10");
    expect(tile?.className).toContain("text-blue-500");
    // Le fond neutre par défaut a bien été remplacé, pas seulement complété.
    expect(tile?.className).not.toContain("bg-muted");
  });

  it("n'affiche la ligne d'aide que lorsqu'il y a des résultats", () => {
    const hint = "↑↓ pour naviguer";
    const { rerender } = renderGlobalSearch({ open: true, hint });

    expect(screen.queryByText(hint)).not.toBeNull();

    rerender(<GlobalSearch groups={[{ heading: "Pages", items: [] }]} search="" onSearch={vi.fn()} onSelect={vi.fn()} open hint={hint} />);

    expect(screen.queryByText(hint)).toBeNull();
  });

  it("accepte des libellés personnalisés", () => {
    const { rerender } = renderGlobalSearch({ groups: [], triggerLabel: "Search", placeholder: "Search...", emptyLabel: "No result." });

    // Le déclencheur se vérifie palette fermée : Radix masque le reste de la page aux
    // lecteurs d'écran (`aria-hidden`) dès que la dialog est ouverte.
    expect(screen.queryByRole("button", { name: "Search" })).not.toBeNull();

    rerender(
      <GlobalSearch groups={[]} search="" onSearch={vi.fn()} onSelect={vi.fn()} open triggerLabel="Search" placeholder="Search..." emptyLabel="No result." />,
    );

    expect(screen.queryByPlaceholderText("Search...")).not.toBeNull();
    expect(screen.queryByText("No result.")).not.toBeNull();
  });
});
