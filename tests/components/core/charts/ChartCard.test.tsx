import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { ChartCard } from "../../../../src/components/core/charts/ChartCard";

afterEach(() => {
  cleanup();
});

describe("ChartCard", () => {
  it("affiche le graphe quand il y a des données", () => {
    render(
      <ChartCard title="Ajouts par mois">
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.getByText("Ajouts par mois")).toBeTruthy();
    expect(screen.getByText("le graphe")).toBeTruthy();
  });

  it("remplace le graphe par le libellé d'absence de données quand isEmpty", () => {
    render(
      <ChartCard title="Ajouts par mois" isEmpty emptyLabel="Pas assez de données">
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.getByText("Pas assez de données")).toBeTruthy();
    expect(screen.queryByText("le graphe")).toBeNull();
  });

  it("propose un libellé d'absence de données par défaut", () => {
    render(
      <ChartCard title="Ajouts par mois" isEmpty>
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.getByText("Aucune donnée disponible")).toBeTruthy();
  });

  it("le chargement prime sur l'absence de données", () => {
    render(
      <ChartCard title="Ajouts par mois" isLoading isEmpty emptyLabel="Pas assez de données">
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.queryByText("Pas assez de données")).toBeNull();
    expect(screen.queryByText("le graphe")).toBeNull();
  });

  it("garde l'en-tête pendant le chargement pour éviter un saut de mise en page", () => {
    render(
      <ChartCard title="Ajouts par mois" description="Six derniers mois" isLoading>
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.getByText("Ajouts par mois")).toBeTruthy();
    expect(screen.getByText("Six derniers mois")).toBeTruthy();
  });

  it("affiche les actions de l'en-tête", () => {
    render(
      <ChartCard title="Ajouts par mois" actions={<button type="button">30 jours</button>}>
        <div>le graphe</div>
      </ChartCard>,
    );

    expect(screen.getByRole("button", { name: "30 jours" })).toBeTruthy();
  });
});
