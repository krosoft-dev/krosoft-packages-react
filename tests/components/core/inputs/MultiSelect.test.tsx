import { cleanup, fireEvent, render, screen, type RenderResult } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MultiSelect } from "../../../../src/components/core/inputs/MultiSelect";

const options = [
  { value: "online", label: "En ligne" },
  { value: "running", label: "En cours d'exécution" },
  { value: "offline", label: "Hors ligne" },
  { value: "pending", label: "En attente" },
];

// « Hors ligne » et « En attente » sont visibles mais non basculables.
const optionsAvecDesactivees = [
  { value: "online", label: "En ligne" },
  { value: "running", label: "En cours d'exécution" },
  { value: "offline", label: "Hors ligne", disabled: true },
  { value: "pending", label: "En attente", disabled: true },
];

const noop = vi.fn();

const renderMultiSelect = (selected: string[], maxCount?: number): RenderResult =>
  render(<MultiSelect options={options} selected={selected} onToggle={noop} onClear={noop} maxCount={maxCount} />);

const openPanel = (container: HTMLElement): void => {
  // Le trigger est le seul `<button>` monté avant l'ouverture : son libellé varie avec la sélection.
  fireEvent.click(container.querySelector("button") as Element);
};

const itemOf = (label: string): Element => screen.getByText(label).closest("[cmdk-item]") as Element;

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

  it("variant pill : affiche le libellé fixe et le badge du nombre de sélections", () => {
    render(<MultiSelect variant="pill" labelKey="Statut" options={options} selected={["online", "offline"]} onToggle={noop} />);

    expect(screen.getByText("Statut")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("marque les options désactivées et ignore leur clic", () => {
    const onToggle = vi.fn();
    const { container } = render(<MultiSelect options={optionsAvecDesactivees} selected={[]} onToggle={onToggle} />);

    openPanel(container);
    const item = itemOf("Hors ligne");

    expect(item.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(item);

    expect(onToggle).not.toHaveBeenCalled();
  });

  it("« Tout sélectionner » n'ajoute que les options basculables", () => {
    const onSelectAll = vi.fn();
    const { container } = render(<MultiSelect options={optionsAvecDesactivees} selected={[]} onToggle={noop} onSelectAll={onSelectAll} />);

    openPanel(container);
    fireEvent.click(screen.getByText("Tout sélectionner"));

    expect(onSelectAll).toHaveBeenCalledWith(["online", "running"]);
  });

  it("bascule sur « Tout désélectionner » dès que les options basculables sont toutes cochées", () => {
    const onSelectAll = vi.fn();
    const { container } = render(<MultiSelect options={optionsAvecDesactivees} selected={["online", "running", "offline"]} onToggle={noop} onSelectAll={onSelectAll} />);

    openPanel(container);
    fireEvent.click(screen.getByText("Tout désélectionner"));

    // « Hors ligne » est désactivée : sa sélection survit à la désélection globale.
    expect(onSelectAll).toHaveBeenCalledWith(["offline"]);
  });

  it("la croix du trigger conserve la sélection portée par une option désactivée", () => {
    const onSelectAll = vi.fn();
    const onClear = vi.fn();
    const { container } = render(
      <MultiSelect options={optionsAvecDesactivees} selected={["online", "offline"]} onToggle={noop} onClear={onClear} onSelectAll={onSelectAll} />,
    );

    fireEvent.pointerDown(container.querySelector('[role="button"]') as Element);

    expect(onClear).not.toHaveBeenCalled();
    expect(onSelectAll).toHaveBeenCalledWith(["offline"]);
  });

  it("masque le bouton global quand aucune option n'est basculable", () => {
    const { container } = render(<MultiSelect options={optionsAvecDesactivees.map(o => ({ ...o, disabled: true }))} selected={[]} onToggle={noop} />);

    openPanel(container);

    expect(screen.queryByText("Tout sélectionner")).toBeNull();
  });
});
