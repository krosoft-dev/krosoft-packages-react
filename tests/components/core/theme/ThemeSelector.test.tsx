import { cleanup, render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import * as React from "react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { ThemeSelector } from "../../../../src/components/core/theme/ThemeSelector";
import type { ThemeOption } from "../../../../src/hooks/ui/useTheme";

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Clair", icon: () => <span /> },
  { value: "dark", label: "Sombre", icon: () => <span /> },
];

// next-themes interroge la préférence système au montage : jsdom n'a pas matchMedia.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  cleanup();
});

const renderSelector = (variant: "select" | "mini", id?: string): void => {
  render(
    <ThemeProvider attribute="class" defaultTheme="light" themes={["light", "dark"]}>
      <ThemeSelector themeOptions={THEME_OPTIONS} variant={variant} id={id} />
    </ThemeProvider>,
  );
};

describe("ThemeSelector", () => {
  it("pose l'id sur le déclencheur, pour qu'un label de l'application s'y associe", () => {
    renderSelector("select", "theme");

    expect(screen.getByRole("combobox").id).toBe("theme");
  });

  it("pose l'id sur le bouton de la variante mini", () => {
    renderSelector("mini", "theme");

    expect(screen.getByRole("button").id).toBe("theme");
  });

  it("laisse le déclencheur sans id quand l'application n'en fournit pas", () => {
    renderSelector("select");

    expect(screen.getByRole("combobox").id).toBe("");
  });
});
