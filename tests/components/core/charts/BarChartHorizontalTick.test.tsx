import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { BarChartHorizontalTick } from "../../../../src/components/core/charts/BarChartHorizontalTick";

afterEach(() => {
  cleanup();
});

const renderTick = (props: Partial<React.ComponentProps<typeof BarChartHorizontalTick>> = {}): void => {
  render(
    <svg>
      <BarChartHorizontalTick
        x={140}
        y={20}
        height={210}
        visibleTicksCount={10}
        payload={{ value: "reception_factures", coordinate: 20, index: 0 }}
        maxLabelLength={22}
        {...props}
      />
    </svg>,
  );
};

describe("BarChartHorizontalTick", () => {
  it("affiche le libellé secondaire sous le libellé principal", () => {
    renderTick({ secondaryLabel: "Acme Industries" });

    const primary = screen.getByText("reception_factures");
    const secondary = screen.getByText("Acme Industries");
    expect(Number(secondary.getAttribute("y"))).toBeGreaterThan(Number(primary.getAttribute("y")));
    expect(secondary.getAttribute("font-size")).toBe("10");
    expect(primary.getAttribute("text-anchor")).toBe("end");
    expect(secondary.getAttribute("text-anchor")).toBe("end");
  });

  it("tronque chaque ligne avec maxLabelLength", () => {
    renderTick({ secondaryLabel: "Umbrella Corporation Europe", maxLabelLength: 10 });

    expect(screen.getByText("reception_…")).toBeTruthy();
    expect(screen.getByText("Umbrella C…")).toBeTruthy();
  });

  it("écarte les deux lignes quand la rangée a de la place", () => {
    renderTick({ secondaryLabel: "Acme Industries" });
    const compactGap = Number(screen.getByText("Acme Industries").getAttribute("y")) - Number(screen.getByText("reception_factures").getAttribute("y"));
    cleanup();

    renderTick({ secondaryLabel: "Acme Industries", height: 300 });
    const spaciousGap = Number(screen.getByText("Acme Industries").getAttribute("y")) - Number(screen.getByText("reception_factures").getAttribute("y"));

    expect(spaciousGap).toBeGreaterThan(compactGap);
  });

  it("n'affiche qu'une ligne sans libellé secondaire", () => {
    renderTick();

    expect(screen.getByText("reception_factures")).toBeTruthy();
    expect(document.querySelectorAll("text")).toHaveLength(1);
  });
});
