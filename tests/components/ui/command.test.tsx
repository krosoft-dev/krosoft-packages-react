import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../src/components/ui/command";

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

const renderPalette = (): ReturnType<typeof render> =>
  render(
    <CommandDialog open>
      <CommandInput placeholder="Rechercher…" />
      <CommandList>
        <CommandGroup heading="Annonces">
          <CommandItem value="item-1">Résultat</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>,
  );

// La dialog est en plein écran sur mobile : la liste plafonnée à 300px s'arrêtait
// au tiers de l'écran, laissant une grande zone vide sous les résultats.
describe("gabarit de la palette de commandes", () => {
  it("empile saisie, liste et pied de page en colonne dans la dialog", () => {
    renderPalette();

    const classes = screen.getByRole("dialog").className.split(/\s+/);

    expect(classes).toEqual(expect.arrayContaining(["flex", "flex-col", "overflow-hidden"]));
    expect(classes).not.toContain("grid");
  });

  it("laisse la liste prendre la hauteur restante sur mobile et retrouver son plafond dès sm", () => {
    renderPalette();

    // La palette est rendue dans un portail : elle est hors du conteneur de `render`.
    const command = document.querySelector("[cmdk-root]");
    const classes = command?.className.split(/\s+/) ?? [];

    expect(command).not.toBeNull();

    expect(classes).toEqual(expect.arrayContaining(["[&_[cmdk-list]]:max-h-none", "[&_[cmdk-list]]:min-h-0", "[&_[cmdk-list]]:flex-1"]));
    expect(classes).toEqual(expect.arrayContaining(["sm:[&_[cmdk-list]]:max-h-[300px]", "sm:[&_[cmdk-list]]:flex-none"]));
  });
});
