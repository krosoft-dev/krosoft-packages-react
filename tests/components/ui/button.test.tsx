import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "../../../src/components/ui/button";

afterEach(() => {
  cleanup();
});

const classes = (name: string): string[] => screen.getByRole("button", { name }).className.split(/\s+/);

// Le variant ne porte que l'habillage (couleurs, ombre) : les dimensions viennent du `size`.
// Un variant qui déclare aussi une hauteur ou un padding se fait écraser par le size par
// défaut — les classes traînent alors sans effet, sauf sur `size="icon"` qui n'a pas de
// padding horizontal et se retrouverait déformé.
describe("Button — variant brand", () => {
  it("laisse le size fixer les dimensions", () => {
    render(<Button variant="brand">Marque</Button>);

    const result = classes("Marque");
    expect(result).toEqual(expect.arrayContaining(["h-10", "px-4"]));
    expect(result).not.toContain("h-12");
    expect(result).not.toContain("px-6");
  });

  it("reste carré en taille icône", () => {
    render(
      <Button variant="brand" size="icon">
        Icône
      </Button>,
    );

    const result = classes("Icône");
    expect(result).toEqual(expect.arrayContaining(["h-10", "w-10"]));
    expect(result).not.toContain("px-6");
  });

  it("porte le dégradé de marque", () => {
    render(<Button variant="brand">Marque</Button>);

    expect(classes("Marque")).toEqual(expect.arrayContaining(["from-brand-from", "to-brand-to", "text-brand-foreground"]));
  });
});
