import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SeasonalEffects } from "../../src/seasonal/SeasonalEffects";
import { SeasonalEffectsSettings } from "../../src/seasonal/SeasonalEffectsSettings";
import { useSnowEffect } from "../../src/seasonal/useSeasonalEffects";

// react-snowfall dessine sur un canvas, que jsdom ne sait pas rendre.
vi.mock("react-snowfall", () => ({
  default: ({ images }: { images?: unknown[] }) => <div data-testid={images ? "halloween" : "snow"} />,
}));

// Sans i18next initialisé, `useKrosoftTranslation` retombe sur le français embarqué.
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, ready: false, i18n: { exists: () => false } }),
}));

const PREFIX = "test_";

const setToday = (date: string): void => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(`${date}T12:00:00`));
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("SeasonalEffects", () => {
  it("affiche la neige en décembre", () => {
    setToday("2026-12-15");
    render(<SeasonalEffects storagePrefix={PREFIX} />);

    expect(screen.queryByTestId("snow")).not.toBeNull();
    expect(screen.queryByTestId("halloween")).toBeNull();
  });

  it("affiche Halloween pendant sa période", () => {
    setToday("2026-10-31");
    render(<SeasonalEffects storagePrefix={PREFIX} />);

    expect(screen.queryByTestId("halloween")).not.toBeNull();
    expect(screen.queryByTestId("snow")).toBeNull();
  });

  it("n'affiche rien hors saison", () => {
    setToday("2026-06-15");
    const { container } = render(<SeasonalEffects storagePrefix={PREFIX} />);

    expect(container.innerHTML).toBe("");
  });

  it("respecte la désactivation mémorisée", () => {
    setToday("2026-12-15");
    localStorage.setItem(`${PREFIX}snow-effect-enabled`, "false");
    render(<SeasonalEffects storagePrefix={PREFIX} />);

    expect(screen.queryByTestId("snow")).toBeNull();
  });
});

describe("useSnowEffect", () => {
  it("est activé par défaut et partage la préférence entre composants", () => {
    const first = renderHook(() => useSnowEffect(PREFIX));
    const second = renderHook(() => useSnowEffect(PREFIX));
    expect(first.result.current.isSnowEnabled).toBe(true);

    act(() => {
      first.result.current.setSnowEnabled(false);
    });

    expect(localStorage.getItem(`${PREFIX}snow-effect-enabled`)).toBe("false");
    expect(second.result.current.isSnowEnabled).toBe(false);
  });
});

describe("SeasonalEffectsSettings", () => {
  it("masque l'interrupteur Halloween hors période", () => {
    setToday("2026-06-15");
    render(<SeasonalEffectsSettings storagePrefix={PREFIX} />);

    expect(screen.queryByLabelText("Effet neige")).not.toBeNull();
    expect(screen.queryByLabelText("Effet Halloween")).toBeNull();
  });

  it("enregistre le choix de l'utilisateur", () => {
    setToday("2026-10-31");
    render(<SeasonalEffectsSettings storagePrefix={PREFIX} />);

    fireEvent.click(screen.getByLabelText("Effet Halloween"));

    expect(localStorage.getItem(`${PREFIX}halloween-effect-enabled`)).toBe("false");
    expect(screen.getByLabelText("Effet Halloween").getAttribute("aria-checked")).toBe("false");
  });
});
