import { cleanup, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { CircularGauge } from "../../../../src/components/core/charts/CircularGauge";

afterEach(() => {
  cleanup();
});

/** Le second cercle du SVG porte la progression ; le premier est le fond. */
const getProgressCircle = (container: HTMLElement): SVGCircleElement => container.querySelectorAll("circle")[1];

const getOffset = (container: HTMLElement): number => Number(getProgressCircle(container).getAttribute("stroke-dashoffset"));

const getCircumference = (container: HTMLElement): number => Number(getProgressCircle(container).getAttribute("stroke-dasharray"));

describe("CircularGauge", () => {
  it("colore l'anneau selon les seuils", () => {
    const { container: low } = render(<CircularGauge value={20} />);
    const { container: warning } = render(<CircularGauge value={60} />);
    const { container: danger } = render(<CircularGauge value={95} />);

    expect(getProgressCircle(low).getAttribute("stroke")).toBe("hsl(var(--k-success))");
    expect(getProgressCircle(warning).getAttribute("stroke")).toBe("hsl(var(--k-warning))");
    expect(getProgressCircle(danger).getAttribute("stroke")).toBe("hsl(var(--destructive))");
  });

  it("une couleur explicite prime sur les seuils", () => {
    const { container } = render(<CircularGauge value={95} color="hsl(var(--k-chart-1))" />);

    expect(getProgressCircle(container).getAttribute("stroke")).toBe("hsl(var(--k-chart-1))");
  });

  it("respecte des seuils personnalisés", () => {
    const { container } = render(<CircularGauge value={60} thresholds={{ warning: 70, danger: 90 }} />);

    expect(getProgressCircle(container).getAttribute("stroke")).toBe("hsl(var(--k-success))");
  });

  it("borne le remplissage : au-delà du maximum l'arc ne repart pas à zéro", () => {
    const { container } = render(<CircularGauge value={150} max={100} />);

    expect(getOffset(container)).toBeCloseTo(0, 5);
  });

  it("borne le remplissage sur les valeurs négatives", () => {
    const { container } = render(<CircularGauge value={-10} max={100} />);

    expect(getOffset(container)).toBeCloseTo(getCircumference(container), 5);
  });

  it("ne divise pas par zéro quand le maximum est nul", () => {
    const { container } = render(<CircularGauge value={10} max={0} />);

    expect(getOffset(container)).toBeCloseTo(getCircumference(container), 5);
  });

  it("affiche la valeur formatée, l'unité et le libellé", () => {
    const { container } = render(<CircularGauge value={6.84} max={16} unit="GB" label="Mémoire" />);

    expect(container.textContent).toContain("6.8");
    expect(container.textContent).toContain("GB");
    expect(container.textContent).toContain("Mémoire");
  });
});
