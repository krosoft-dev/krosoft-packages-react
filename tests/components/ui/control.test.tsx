import { cleanup, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SingleSelect } from "../../../src/components/core/inputs/SingleSelect";
import { MultiSelect } from "../../../src/components/core/inputs/MultiSelect";
import { Button, Input, Select, SelectTrigger, SelectValue } from "../../../src/components/ui";

const options = [{ value: "actif", label: "Actif" }];
const noop = vi.fn();

// Contrôles amenés à cohabiter sur une même ligne (barre de filtres, formulaire). Ils
// doivent tous partir de `controlBaseClass` : sinon la barre de recherche et les selects
// posés à côté n'ont plus la même hauteur — c'était le cas de la pastille de filtre,
// rendue 6px plus courte que le reste.
const controls: { name: string; element: React.ReactElement }[] = [
  { name: "Input", element: <Input placeholder="Rechercher" /> },
  {
    name: "SelectTrigger",
    element: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
      </Select>
    ),
  },
  { name: "MultiSelect", element: <MultiSelect options={options} selected={[]} onToggle={noop} onClear={noop} /> },
  { name: "SingleSelect", element: <SingleSelect options={options} value={undefined} onChange={noop} /> },
  { name: "SingleSelect (searchable)", element: <SingleSelect searchable options={options} value={undefined} onChange={noop} /> },
  { name: "MultiSelect (pill)", element: <MultiSelect variant="pill" labelKey="Statut" options={options} selected={[]} onToggle={noop} /> },
  { name: "Button", element: <Button variant="outline">Filtres</Button> },
];

afterEach(() => {
  cleanup();
});

describe("gabarit des contrôles", () => {
  it.each(controls)("$name partage la hauteur et la forme de référence", ({ element }) => {
    const { container } = render(element);

    const control = container.querySelector("input, button");
    const classes = control?.className.split(/\s+/) ?? [];

    expect(classes).toContain("h-10");
    expect(classes).toContain("rounded-control");
  });
});
