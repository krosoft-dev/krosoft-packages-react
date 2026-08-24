import { cleanup, render, screen, type RenderResult } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MultiSelect } from "../../../../src/components/core/inputs/MultiSelect";

const options = [
  { value: "online", label: "En ligne" },
  { value: "running", label: "En cours d'exécution" },
  { value: "offline", label: "Hors ligne" },
  { value: "pending", label: "En attente" },
];

const noop = vi.fn();

const renderMultiSelect = (selected: string[], maxCount?: number): RenderResult =>
  render(<MultiSelect options={options} selected={selected} onToggle={noop} onClear={noop} maxCount={maxCount} />);

afterEach(() => {
  cleanup();
});

describe("MultiSelect", () => {
  it("affiche le placeholder sans sélection", () => {
    renderMultiSelect([]);

    expect(screen.getByText("Sélectionner...")).toBeTruthy();
  });

  it("liste tous les libellés sélectionnés sans maxCount", () => {
    renderMultiSelect(["online", "running", "offline"]);

    expect(screen.getByText("En ligne, En cours d'exécution, Hors ligne")).toBeTruthy();
  });

  it("tronque à maxCount et résume le reste par un compteur", () => {
    renderMultiSelect(["online", "running", "offline", "pending"], 2);

    expect(screen.getByText("En ligne, En cours d'exécution")).toBeTruthy();
    expect(screen.getByText("+2")).toBeTruthy();
  });

  it("n'affiche pas de compteur quand la sélection tient dans maxCount", () => {
    renderMultiSelect(["online", "running"], 2);

    expect(screen.getByText("En ligne, En cours d'exécution")).toBeTruthy();
    expect(screen.queryByText(/^\+/)).toBeNull();
  });

  it("ignore un maxCount nul ou négatif", () => {
    renderMultiSelect(["online", "running"], 0);

    expect(screen.getByText("En ligne, En cours d'exécution")).toBeTruthy();
    expect(screen.queryByText(/^\+/)).toBeNull();
  });
});
