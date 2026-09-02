import { cleanup, fireEvent, render, screen, type RenderResult } from "@testing-library/react";
import { createRef } from "react";
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
    const { container } = render(
      <MultiSelect options={optionsAvecDesactivees} selected={["online", "running", "offline"]} onToggle={noop} onSelectAll={onSelectAll} />,
    );

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

  // Ce relais est ce dont `<FormControl>` (Slot) a besoin pour raccrocher le champ à son libellé
  // et à son message d'erreur : sans lui, l'id et les aria-* injectés tomberaient dans le vide.
  it.each([["input"], ["pill"]] as const)("variant %s : relaie la ref et les props DOM au trigger", variant => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <MultiSelect
        ref={ref}
        variant={variant}
        id="statuts-field"
        aria-describedby="statuts-message"
        aria-invalid
        options={options}
        selected={[]}
        onToggle={noop}
      />,
    );

    const trigger = container.querySelector("button") as HTMLButtonElement;

    expect(ref.current).toBe(trigger);
    expect(trigger.getAttribute("id")).toBe("statuts-field");
    expect(trigger.getAttribute("aria-describedby")).toBe("statuts-message");
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
  });
});

// La largeur sépare le champ de formulaire du contrôle de barre de filtres. Sans le palier
// `md:`, le `w-full` du trigger renvoie chaque filtre sur sa propre ligne dans une barre en
// `flex-wrap` : c'est le défaut que `filter` et `pill` évitent.
describe("MultiSelect — largeur selon le variant", () => {
  const renderVariant = (variant: "input" | "filter" | "pill", className?: string): HTMLButtonElement => {
    const { container } = render(<MultiSelect variant={variant} className={className} options={options} selected={[]} onToggle={noop} />);
    return container.querySelector("button") as HTMLButtonElement;
  };

  it.each([["filter"], ["pill"]] as const)("variant %s : porte la largeur de barre de filtres", variant => {
    expect(renderVariant(variant).className).toContain("md:w-[200px]");
  });

  it("variant input : laisse le champ occuper la largeur de son conteneur", () => {
    const classes = renderVariant("input").className;

    expect(classes).not.toContain("md:w-[200px]");
    expect(classes.split(/\s+/)).toContain("w-full");
  });

  it.each([["filter"], ["pill"]] as const)("variant %s : un className cible la largeur de remplacement", variant => {
    expect(renderVariant(variant, "md:w-52").className).not.toContain("md:w-[200px]");
  });

  // Le défaut de largeur était auparavant posé en `className ?? …` : une classe sans rapport,
  // comme une marge, effaçait alors la largeur au lieu de s'y ajouter.
  it.each([["filter"], ["pill"]] as const)("variant %s : un className sans largeur laisse le défaut en place", variant => {
    const classes = renderVariant(variant, "mt-1").className;

    expect(classes).toContain("md:w-[200px]");
    expect(classes.split(/\s+/)).toContain("mt-1");
  });
});
