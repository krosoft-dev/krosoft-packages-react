import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SingleSelect } from "../../../../src/components/core/inputs/SingleSelect";

const options = [
  { value: "cron", label: "Planification" },
  { value: "fileWatcher", label: "Surveillance de fichiers", disabled: true },
];

const openPanel = (): void => {
  fireEvent.click(screen.getByRole("combobox"));
};

const itemOf = (label: string): Element => screen.getByText(label).closest("[cmdk-item]") as Element;

afterEach(() => {
  cleanup();
});

describe("SingleSelect", () => {
  it("searchable : marque les options désactivées et ignore leur clic", () => {
    const onChange = vi.fn();
    render(<SingleSelect searchable options={options} value={undefined} onChange={onChange} />);

    openPanel();
    const item = itemOf("Surveillance de fichiers");

    expect(item.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(item);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("searchable : une option active reste sélectionnable", () => {
    const onChange = vi.fn();
    render(<SingleSelect searchable options={options} value={undefined} onChange={onChange} />);

    openPanel();
    fireEvent.click(itemOf("Planification"));

    expect(onChange).toHaveBeenCalledWith("cron");
  });

  // Ce relais est ce dont `<FormControl>` (Slot) a besoin pour raccrocher le champ a son libelle
  // et a son message d'erreur : sans lui, l'id et les aria-* injectes tomberaient dans le vide.
  it.each([
    ["simple", false],
    ["searchable", true],
  ])("%s : relaie la ref et les props DOM au trigger", (_mode, searchable) => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <SingleSelect
        ref={ref}
        searchable={searchable}
        id="type-field"
        aria-describedby="type-message"
        aria-invalid
        options={options}
        value={undefined}
        onChange={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("combobox");

    expect(ref.current).toBe(trigger);
    expect(trigger.getAttribute("id")).toBe("type-field");
    expect(trigger.getAttribute("aria-describedby")).toBe("type-message");
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
  });
});

// Les deux modes de rendu ont chacun leur trigger (Radix et cmdk) : la largeur doit suivre le
// variant dans l'un comme dans l'autre, sinon passer `searchable` deplacerait la mise en page.
describe("SingleSelect — largeur selon le variant", () => {
  const renderVariant = (variant: "input" | "filter", searchable: boolean, className?: string): Element => {
    render(<SingleSelect variant={variant} searchable={searchable} className={className} options={options} value={undefined} onChange={vi.fn()} />);
    return screen.getByRole("combobox");
  };

  it.each([
    ["simple", false],
    ["searchable", true],
  ])("%s : le variant filter porte la largeur de barre de filtres", (_mode, searchable) => {
    expect(renderVariant("filter", searchable).className).toContain("md:w-[200px]");
  });

  it.each([
    ["simple", false],
    ["searchable", true],
  ])("%s : le variant input laisse le champ occuper son conteneur", (_mode, searchable) => {
    const classes = renderVariant("input", searchable).className;

    expect(classes).not.toContain("md:w-[200px]");
    expect(classes.split(/\s+/)).toContain("w-full");
  });

  it("filter : un className remplace la largeur en ciblant le meme palier", () => {
    expect(renderVariant("filter", false, "md:w-52").className).not.toContain("md:w-[200px]");
  });

  it("filter : un className sans largeur laisse le defaut en place", () => {
    const classes = renderVariant("filter", false, "mt-1").className;

    expect(classes).toContain("md:w-[200px]");
    expect(classes.split(/\s+/)).toContain("mt-1");
  });
});
